import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/dijkstras';
import './Pathfinding Visualizer.css';
import ReactDOM from 'react-dom'

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
      isWall: false,
      distance: Infinity,
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

  const toggleClassName = (element, toCheck) =>{
    let className = element.className;
    const reg = new RegExp(toCheck);
    if(className.match(reg)){
      className.replace(reg, "");
    }
    else{
      className += " ";
      className += toCheck;
    }
    return className;
  }

  const removeClassName = (className, toCheck) => {
    let name = className;
    const reg = new RegExp(toCheck);
    if(name.match(reg)){
      name.replace(reg, "");
    }
    return name;
  }


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

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            const element = document.getElementById(`node-${node.row}-${node.col}`);
            document.getElementById(`node-${node.row}-${node.col}`).className = toggleClassName(element, 'node-shortest-path');
          }, 10 * i);
        }
      }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 1 * i);
            return;
          }else{
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const element = document.getElementById(`node-${node.row}-${node.col}`);
            document.getElementById(`node-${node.row}-${node.col}`).className = toggleClassName(element, 'node-visited');
          }, 1 * i);}
        }
      }

    visualizeDijkstra(){
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        //console.log(visitedNodesInOrder);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        this.setState({grid});
    }

    resetAll(){
      const {grid} = this.state;
      for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[row].length; col++){
          document.getElementById(`node-${row}-${col}`).className = 'node';
          grid[row][col] = createNode(col, row);
        }
      }
      this.setState({grid}, ()=> this.forceUpdate());
    }

    resetState(){
      const grid = getInitialGrid();
      this.setState({grid}, () => console.log(this.state));
    }

    resetNew(){
      const {grid} = this.state;
      const elements = document.getElementsByClassName("node");
      console.log(elements[0]);
      //console.log(elements);
      for(let i = 0; i < elements.length; i-=-1){
        elements[i].className = "node";
        //element.className = 'node';
      }
      for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[row].length; col++){
          grid[row][col] = createNode(col, row);
        }
      }
      this.componentDidMount();
    }



    render(){
        const {grid, mouseIsPressed} = this.state;
        return (
            <div className="wrapper" draggable="false">
                <header>
                    <button onClick={()=>this.visualizeDijkstra()}>
                        Visualize
                    </button>
                    <button onClick={()=>this.resetState()}>
                        Reset
                    </button>    
                    </header>
                <section className="main-body">
                    <div className="main-grid">
                        {
                             grid.map((row) => {
                                return row.map((node, nodeId) => {
                                    const {row, col, isStart, isFinish, isVisited, isWall, distance, previousNode} = node;
                                    return (
                                        <Node
                                          row={row}
                                          col={col}
                                          isStart={isStart}
                                          isFinish={isFinish}
                                          isVisited={isVisited}
                                          isWall={isWall}
                                          distance={distance}
                                          previousNode={previousNode}
                                        >
                                        </Node>
                                    )
                                })
                            }) 
                        }
                        {
                          grid.map((row) => {
                            return row.map((node, nodeID) => {
                              //console.log(node);
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