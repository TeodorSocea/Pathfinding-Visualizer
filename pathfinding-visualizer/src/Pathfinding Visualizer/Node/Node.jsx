  
import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    //console.log(this.props);
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
    const testClassName = 'node-test';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        //onMouseDown={() => onMouseDown(row, col)}
        //onMouseEnter={() => onMouseEnter(row, col)}
        //onMouseUp={() => onMouseUp()}
        ></div>
    );
  }
}