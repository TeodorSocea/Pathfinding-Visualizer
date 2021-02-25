import React, {Component} from 'react';
import Node from './Node/Node';

import './Pathfinding Visualizer.css';

export default class PathfindingVisuzlizer extends Component{
    constructor(props){
        super(props);
        this.state = {
            nodes: [],
        };
    };
    componentDidMount(){
        const nodes =[];
        for(let row = 0; row < 15; row++){
            for(let col = 0; col < 50; col++){
                const currentNode = {
                    col,
                    row,
                    isStart : row === 7 && col === 3,
                    isFinish : row === 5 && col === 47,
                    isWall : false,
                };
                nodes.push(currentNode);
            }
        }
        this.setState({nodes});
    }
    render(){
        const {nodes} = this.state;
        return (
            <div className="wrapper">
                <header>Poggers</header>
                <section className="main-body">
                    <div className="main-grid">
                        {
                            nodes.map((node, nodeId) => {
                                const {isStart, isFinish, col, row} = node;
                                return(
                                    <Node
                                        col = {col}
                                        row = {row}
                                        key={nodeId}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                    ></Node>
                                )
                            })
                        }                                                
                    </div>
                </section>
                <footer>poggest</footer>
            </div>
          );
    };
};