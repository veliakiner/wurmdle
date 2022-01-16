import React from "react";
import "./App.css";

let stats = {
  kingler: [55, 130, 115, 50, 50, 75],
  mew: [100, 100, 100, 100, 100, 100],
  mewtwo: [106, 110, 90, 154, 90, 130],
  machamp: [90, 130, 80, 65, 85, 55],
};

class Board extends React.Component {
  state = {
    answer: "kingler",
    numRows: 2,
    currentGuess: "",
    lastGuess: "",
    guesses: [],
    guessDeltas: []
  };
  calculateCorrectness(lastGuess) {
    let answer = this.state.answer;
    console.log(lastGuess);
    console.log(answer);
    if (lastGuess == answer) {
      console.log("Correct!");
    } else {
      let guessStats = stats[lastGuess];
      let ansStats = stats[answer];
      let delta = [];
      for (var i = 0; i < guessStats.length; i += 1) {
        delta.push(ansStats[i] - guessStats[i]);
      }
      console.log(delta.toString());
      console.log("Incorrect. Try again");
      return delta
    }
  }
  onGuess() {
    // sanitise
    let lastGuess = this.state.currentGuess
    let delta = this.calculateCorrectness();
    this.setState(
      {
        numRows: this.state.numRows + 1,
        currentGuess: "",
        guesses: this.state.guesses.concat(lastGuess),
        lastGuess: this.state.currentGuess,
        guessDeltas: this.state.guessDeltas.concat(delta)
      },
      () => {
        console.log("Guessed " + lastGuess);
        console.log("Guesses: " + this.state.guesses.toString());
      }
    );
  }
  onChange(evt) {
    let input = evt.target.value;
    this.setState({ currentGuess: input });
  }
  render() {
    return (
      <div>
        <form>
          <button onClick={() => this.onGuess()}>Guess</button>
          <input onChange={(e) => this.onChange(e)}></input>
        </form>
        <Grid numRows={this.state.numRows}></Grid>
      </div>
    );
  }
}

function Grid(props) {
  const rows = [];

  for (var i = 0; i < props.numRows; i += 1) {
    rows.push(<Row key={i} value={props.numRows} />);
  }
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
  return <div className="board-row">{squares}</div>;
}
function Square(props) {
  return <button className="square">{props.value} </button>;
}

function App() {
  return <Board></Board>;
}
export default App;
