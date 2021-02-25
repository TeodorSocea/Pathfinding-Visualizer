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
            <div className="wrapper">
                <header>Poggers</header>
                <section className="main-body">
                    <div className="main-grid"></div>
                </section>
                <footer>poggest</footer>
            </div>
          );
    };
};