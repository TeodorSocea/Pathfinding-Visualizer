import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/dijkstras';
import './Pathfinding Visualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

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

export default class PathfindingVisuzlizer extends Component{
    constructor(props){
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false
        };
    };
    
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }
    
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
          /*if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }*/
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className += ' node-visited';
          }, 10 * i);
        }
      }

    visualizeDijkstra(){
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        //console.log(visitedNodesInOrder);
        this.animateDijkstra(visitedNodesInOrder);
    }

    render(){
        const {grid, mouseIsPressed} = this.state;
        return (
            <div className="wrapper">
                <header>
                    <button onClick={()=>this.visualizeDijkstra()}>
                        Visualize
                    </button>    
                    </header>
                <section className="main-body">
                    <div className="main-grid">
                        {
                            grid.map((row) => {
                                return row.map((node, nodeId) => {
                                    const {col, row, isStart, isFinish, isWall, isVisited} = node;
                                    return (
                                        <Node
                                        key = {nodeId}
                                        col = {col}
                                        row = {row}
                                        isStart = {isStart}
                                        isFinish ={isFinish}
                                        isWall = {isWall}
                                        isVisited = {isVisited}
                                        mouseIsPressed = {mouseIsPressed}
                                        onMouseDown = { (row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter = { (row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp = { () => this.handleMouseUp()}
                                        >
                                        </Node>
                                    )
                                })
                            })
                        }                                                
                    </div>
                </section>
                <footer>poggest</footer>
            </div>
          );
    };
};