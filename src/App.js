import React from "react";
import "./App.css";


class Board extends React.Component {
  state = {
    numRows: 2,
  };

  clickResult() {
    console.log("Times clicked: " + this.state.numRows);
    this.state.numRows = this.state.numRows + 1 ;
  }
  render() {

    return (
      <div>
        <button onClick={() => this.setState({numRows: this.state.numRows + 1})}>click me</button>
        <Grid numRows={this.state.numRows}></Grid>
      </div>
    );
  }
}

function Grid(props) {

  const rows = [];
  
  for (var i = 0; i < props.numRows; i += 1) {
    rows.push(<Row key={i} value={props.numRows} />);
  };
  return (
    <div>
      <div className="status">{"" + JSON.stringify(props)}</div>
      {rows}
    </div>
  );
}

function Row(props) {
  let numSquares = 6;
  let squares = [];
  for (var i = 0; i < numSquares; i += 1) {
    squares.push(<Square key={i} value={i}></Square>);
  }
  return (
    <div className="board-row">
      {squares}
    </div>
  );
}
function Square(props) {
  return <button className="square">{props.value} </button>;
}

function App() {
  return <Board></Board>
}
export default App;
