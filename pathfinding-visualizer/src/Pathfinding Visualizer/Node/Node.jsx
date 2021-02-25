  
import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
      isVisited,
      mouseIsPressed
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isVisited
      ? 'node-visited'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}