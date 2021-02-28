import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  render() {
    //console.log(this.props);
    const {
      col,
      isFinish,
      isStart,
      isWall,
      isShortestPath,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
      isVisited,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isShortestPath
      ? "node-shortest-path"
      : isVisited
      ? "node-visited"
      : isWall
      ? "node-wall"
      : "";
    const testClassName = "node-test";

    return (
      <div draggable="false"
        onDragStart="return false"
        onDragEnd="return false"
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
