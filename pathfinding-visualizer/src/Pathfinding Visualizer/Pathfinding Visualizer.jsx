import React, {Component} from 'react';
import Node from './Node/Node';

import './Pathfinding Visualizer.css';

export default class PathfindingVisuzlizer extends Component{
    constructor(props){
        super(props);
        this.state = {};
    };

    render(){
        return (
            <div>Pog<Node></Node>
            </div>
        );
    };
};