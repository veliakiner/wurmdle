import React from "react";
import "./App.css";

// class AppComponent extends React.Component {
//   state = {
//     numChildren: 0
//   }

//   render () {
//     const children = [];

//     for (var i = 0; i < this.state.numChildren; i += 1) {
//       children.push(<ChildComponent key={i} number={i} />);
//     };

//     return (
//       <ParentComponent addChild={this.onAddChild}>
//         {children}
//       </ParentComponent>
//     );
//   }

//   onAddChild = () => {
//     this.setState({
//       numChildren: this.state.numChildren + 1
//     });
//   }
// }

// const ParentComponent = props => (
//   <div className="card calculator">
//     <p><a href="#" onClick={props.addChild}>Add Another Child Component</a></p>
//     <div id="children-pane">
//       {props.children}
//     </div>
//   </div>
// );

// const ChildComponent = (props) => <div>{"I am child " + props.number}</div>;

class Board extends React.Component {
  state = {
    timesClicked: 1,
    row: [this.renderSquare(0), this.renderSquare(1), this.renderSquare(2)],
  };
  renderSquare(i) {
    return <Square value={i} />;
  }
  clickResult() {
    console.log("Times clicked: " + this.state.timesClicked);
    this.state.timesClicked += 1;
  }
  render() {
    const status = "Next player: X";
    return (
      <div>
        <button
          onClick={() => {
            this.clickResult();
            this.state.row.push(this.renderSquare(this.state.timesClicked));
          }}
        >
          click me
        </button>
        <div className="status">{status}</div>
        <Row value={0}></Row>
        <Row value={3}></Row>
        <Row value={6}></Row>
      </div>
    );
  }
}

function Row(props) {
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
  let board = new Board();
  return board.render();
}
export default App;
