import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstras";
import "./Pathfinding Visualizer.css";

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

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

const toggleClassName = (element, toCheck) => {
  let className = element.className;
  const reg = new RegExp(toCheck);
  if (className.match(reg)) {
    className = className.replace(reg, "");
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
      walling: false,
      movingStart: false,
      movingFinish: false,
      redoDijkstra: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  removeOldRun() {
    for (let row = 0; row < this.state.grid.length; row++) {
      for (let col = 0; col < this.state.grid[row].length; col++) {
        this.state.grid[row][col].isVisited = false;
        this.state.grid[row][col].isShortestPath = false;
        this.state.grid[row][col].isStart =
          row === START_NODE_ROW && col === START_NODE_COL;
        this.state.grid[row][col].isFinish =
          row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
        this.state.grid[row][col].distance = Infinity;
        this.state.grid[row][col].previousNode = null;
        const element = document.getElementById(`node-${row}-${col}`).className;
        if (element.match(/node-visited/)) {
          document.getElementById(
            `node-${row}-${col}`
          ).className = element.replace(/node-visited/, "");
        }
        if (element.match(/node-shortest-path/)) {
          document.getElementById(
            `node-${row}-${col}`
          ).className = element.replace(/node-shortest-path/, "");
        }
      }
    }
  }

  handleMouseDown(row, col) {
    if (
      row == START_NODE_ROW &&
      col == START_NODE_COL &&
      this.state.walling == false
    ) {
      this.state.movingStart = true;
      this.state.grid[START_NODE_ROW][START_NODE_COL].isStart = false;
    } else if (
      row == FINISH_NODE_ROW &&
      col == FINISH_NODE_COL &&
      this.state.walling == false
    ) {
      this.state.movingFinish = true;
    } else {
      this.state.walling = true;
      this.state.grid[row][col].isWall = this.state.eraseMode ? false : true;
      document.getElementById(`node-${row}-${col}`).className = this.state
        .eraseMode
        ? "node"
        : "node node-wall";
      this.state.mouseIsPressed = true;
    }
  }

  handleMouseEnter(row, col) {
    if (
      !this.state.mouseIsPressed &&
      !this.state.walling &&
      !this.state.movingStart &&
      !this.state.movingFinish
    )
      return;
    if (row == START_NODE_ROW && col == START_NODE_COL) {
      this.state.movingStart = this.state.movingFinish
        ? false
        : this.state.walling
        ? false
        : true;
    } else if (this.state.movingStart && !this.state.walling) {
      if (
        this.state.grid[row][col].isWall == false &&
        this.state.grid[row][col].isFinish == false
      ) {
        this.state.grid[row][col].isStart = true;
        this.state.grid[START_NODE_ROW][START_NODE_COL].isStart = false;
        const oldStart = document.getElementById(
          `node-${START_NODE_ROW}-${START_NODE_COL}`
        );
        const newStart = document.getElementById(`node-${row}-${col}`);
        document.getElementById(
          `node-${START_NODE_ROW}-${START_NODE_COL}`
        ).className = toggleClassName(oldStart, "node-start");
        document.getElementById(
          `node-${row}-${col}`
        ).className = toggleClassName(newStart, "node-start");
        [START_NODE_ROW, row] = [row, START_NODE_ROW];
        [START_NODE_COL, col] = [col, START_NODE_COL];
        if (!!this.state.redoDijkstra) this.redoDijkstra();
      }
    } else if (row == FINISH_NODE_ROW && col == FINISH_NODE_COL) {
      this.state.movingFinish = this.state.walling ? false : true;
    } else if (this.state.movingFinish && !this.state.walling) {
      if (
        this.state.grid[row][col].isWall == false &&
        this.state.grid[row][col].isStart == false
      ) {
        this.state.grid[row][col].isFinish = true;
        this.state.grid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
        const oldStart = document.getElementById(
          `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        );
        const newStart = document.getElementById(`node-${row}-${col}`);
        document.getElementById(
          `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
        ).className = toggleClassName(oldStart, "node-finish");
        document.getElementById(
          `node-${row}-${col}`
        ).className = toggleClassName(newStart, "node-finish");
        [FINISH_NODE_ROW, row] = [row, FINISH_NODE_ROW];
        [FINISH_NODE_COL, col] = [col, FINISH_NODE_COL];
        if (!!this.state.redoDijkstra) this.redoDijkstra();
      }
    } else {
      this.state.grid[row][col].isWall = this.state.eraseMode ? false : true;
      const element = document.getElementById(`node-${row}-${col}`);
      document.getElementById(`node-${row}-${col}`).className = this.state
        .eraseMode
        ? "node"
        : "node node-wall";
    }
  }

  handleMouseUp() {
    this.setState({ grid: this.state.grid });
    this.state.mouseIsPressed = false;
    this.state.walling = false;
    this.state.movingStart = false;
    this.state.movingFinish = false;
  }

  animateShortestPath(nodesInShortestPathOrder, grid) {
    setTimeout(() => {
      this.setState({ grid }, () => console.log(this.state));
    }, nodesInShortestPathOrder.length * 20);
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
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
    this.state.redoDijkstra = true;
    this.removeOldRun();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    console.log("before dijkstra");
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    visitedNodesInOrder.pop();
    visitedNodesInOrder.shift();
    console.log("after dijkstra");
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    nodesInShortestPathOrder.pop();
    nodesInShortestPathOrder.shift();
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, grid);
  }

  redoDijkstra() {
    this.removeOldRun();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    console.log("before dijkstra");
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    visitedNodesInOrder.pop();
    visitedNodesInOrder.shift();
    console.log("after dijkstra");
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    nodesInShortestPathOrder.pop();
    nodesInShortestPathOrder.shift();
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      document.getElementById(
        `node-${node.row}-${node.col}`
      ).className = toggleClassName(element, "node-visited");
    }
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-shortest-path";
    }
  }

  resetState() {
    const grid = getInitialGrid();
    this.setState({ grid: this.state.grid }, () => {
      this.setState({ grid: grid, redoDijkstra: false });
    });
  }

  toggleEraseMode() {
    this.setState({ eraseMode: this.state.eraseMode ? false : true });
    const element = document.getElementById("eraser");
    document.getElementById("eraser").className = toggleClassName(
      element,
      "button-erase-on"
    );
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    window.addEventListener("mouseup", () => {
      this.state.mouseIsPressed = false;
      this.state.walling = false;
      this.state.movingStart = false;
      this.state.movingFinish = false;
    });
    return (
      <div className="wrapper" draggable="false">
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
          rel="stylesheet"
          media="screen"
        />
        <header>
          <div className="header-wrapper">
            <div className="title">
              <p>Pathfinding Visualizer</p>
            </div>
            <div className="buttons">
              <button onClick={() => this.visualizeDijkstra()}>
                Visualize
              </button>
              <button onClick={() => this.resetState()}>Reset</button>
              <button
                onClick={() => {
                  this.removeOldRun();
                  this.state.redoDijkstra = false;
                }}
              >
                Remove old run
              </button>
              <button
                id="eraser"
                className="button-erase"
                onClick={() => this.toggleEraseMode()}
              >
                Erase Mode: {this.state.eraseMode ? "ON" : "OFF"}
              </button>
            </div>
          </div>
          <div className="legend">LEGEND</div>
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
        <footer>
          <a
            href="https://github.com/TeodorSocea"
            target="_blank"
            className="social-links github"
          >
            <button>
              <i class="fa fa-github"></i>
            </button>
          </a>
          <a
            href="https://www.linkedin.com/in/teodor-socea-b3946a205/"
            target="_blank"
            className="social-links linkedin"
          >
            <button>
              <i class="fa fa-linkedin"></i>
            </button>
          </a>
        </footer>
      </div>
    );
  }
}
