import React from "react";
import "./App.css";


class Board extends React.Component {
  state = {
    numRows: 3,
  };

  clickResult() {
    console.log("Times clicked: " + this.state.numRows);
    this.state.numRows = this.state.numRows + 1 ;
  }
  render() {

    const children = [];

    for (var i = 0; i < this.state.numRows; i += 1) {
      children.push(<Grid key={i} numRows={this.state.numRows} />);
    };
    return (
      <div>
        <button onClick={() => this.setState({numRows: this.state.numRows + 1})}>click me</button>
        {children}
      </div>
    );
  }
}

function Grid(props) {
  return (
    <div>
      <div className="status">{"" + JSON.stringify(props)}</div>
      <Row value={0}></Row>
      <Row value={3}></Row>
      <Row value={6}></Row>
    </div>
  );
}

function Row(props) {
  let squares = [];
  for (var i = 0; i < props.value; i += 1) {
    squares.push(<Square value={i}></Square>);
  }
  return (
    <div className="board-row">
      <Square value={props.value}></Square>
      <Square value={props.value + 1}></Square>
      <Square value={props.value + 2}></Square>
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
