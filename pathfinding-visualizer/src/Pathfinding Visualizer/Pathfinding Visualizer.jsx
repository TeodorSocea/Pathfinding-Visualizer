import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstras";
import "./Pathfinding Visualizer.css";
import ReactDOM from "react-dom";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const createNode = (col, row) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isVisited: false,
    isShortestPath: false,
    isWall: false,
    distance: Infinity,
    previousNode: null,
  };
};

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const toggleClassName = (element, toCheck) => {
  let className = element.className;
  const reg = new RegExp(toCheck);
  if (className.match(reg)) {
    className.replace(reg, "");
  } else {
    className += " ";
    className += toCheck;
  }
  return className;
};

export default class PathfindingVisuzlizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      eraseMode: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    this.state.grid[row][col].isWall = this.state.eraseMode ? false : true;
    document.getElementById(`node-${row}-${col}`).className = this.state.eraseMode ? 'node' : 'node node-wall';
    this.state.mouseIsPressed = true;
    
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    this.state.grid[row][col].isWall = this.state.eraseMode ? false : true;
    const element = document.getElementById(`node-${row}-${col}`);
    document.getElementById(`node-${row}-${col}`).className = this.state.eraseMode ? 'node' : 'node node-wall';
    
  }

  handleMouseUp() {
    this.state.mouseIsPressed = false;
    this.setState({ grid: this.state.grid});
  }

  animateShortestPath(nodesInShortestPathOrder, grid) {
    setTimeout(() => {
      this.setState({ grid });
    }, nodesInShortestPathOrder.length * 10 + 1000);
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = toggleClassName(element, "node-shortest-path");
      }, 20 * i);
    }
  }

  async animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, grid) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, grid);
        }, 10 * i);
        return;
      } else {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          const element = document.getElementById(
            `node-${node.row}-${node.col}`
          );
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = toggleClassName(element, "node-visited");
        }, 10 * i);
      }
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    //console.log(visitedNodesInOrder);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, grid);
  }

  resetState() {
    const grid = getInitialGrid();
    this.setState({ grid }, () => console.log(this.state));
  }
  toggleEraseMode(){
    this.setState({eraseMode: this.state.eraseMode ? false : true});
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    window.addEventListener('mouseup', ()=>{this.state.mouseIsPressed=false});
    return (
      <div className="wrapper" draggable="false">
        <header>
          <button onClick={() => this.visualizeDijkstra()}>Visualize</button>
          <button onClick={() => this.resetState()}>Reset</button>
          <button onClick={() => this.toggleEraseMode()}>Erase Mode</button>
        </header>
        <section className="main-body" draggable="fase">
          <div className="main-grid" dragable="false">
            {grid.map((row) => {
              return row.map((node, nodeId) => {
                const {
                  row,
                  col,
                  isStart,
                  isFinish,
                  isVisited,
                  isWall,
                  isShortestPath,
                  distance,
                  previousNode,
                } = node;
                return (
                  <Node
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isVisited={isVisited}
                    isWall={isWall}
                    isShortestPath={isShortestPath}
                    distance={distance}
                    previousNode={previousNode}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                  ></Node>
                );
              });
            })}
          </div>
        </section>
        <footer>poggest</footer>
      </div>
    );
  }
}
