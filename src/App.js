import React from "react";
import "./App.css";

let stats = {
  kingler: [55, 130, 115, 50, 50, 75],
  mew: [100, 100, 100, 100, 100, 100],
  mewtwo: [106, 110, 90, 154, 90, 130],
  machamp: [90, 130, 80, 65, 85, 55],
};

function startState (answer) {
  return {
    answer: answer,
    numRows: 2,
    currentGuess: "",
    lastGuess: "",
    guesses: [],
    guessDeltas: [],
    gameOver: false,
  };
}

class Board extends React.Component {
  state = startState("kingler")
  calculateCorrectness(lastGuess) {
    let answer = this.state.answer;
    console.log(lastGuess);
    console.log(answer);
    let guessStats = stats[lastGuess];
    let ansStats = stats[answer];
    let delta = [];
    for (var i = 0; i < guessStats.length; i += 1) {
      let diff = ansStats[i] - guessStats[i];
      if (diff > 0) {
        delta.push(guessStats[i] + " (+)");
      } else if (diff < 0) {
        delta.push(guessStats[i] + " (-)");
      } else {
        delta.push(guessStats[i] + " (=)");
      }
    }
    console.log(delta.toString());
    console.log("Incorrect. Try again");

    if (lastGuess == answer) {
      console.log("Correct!");
      return [delta, true];
    }
    return [delta, false];
  }
  onGuess() {
    // sanitise
    let lastGuess = this.state.currentGuess.toLowerCase();
    if (!(lastGuess in stats)) {
      console.log("Invalid guess.");
      this.setState({
        currentGuess: "",
      });
      return;
    }
    let delta, gameOver;
    [delta, gameOver] = this.calculateCorrectness(lastGuess);
    this.setState(
      {
        numRows: this.state.numRows + 1,
        currentGuess: "",
        guesses: this.state.guesses.concat(lastGuess),
        lastGuess: lastGuess,
        guessDeltas: this.state.guessDeltas.concat([delta]),
        gameOver: gameOver,
      },
      () => {
        console.log("Guessed " + lastGuess);
        console.log("Guesses: " + this.state.guesses.toString());
        console.log("Guesse deltas: " + this.state.guessDeltas.toString());
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
        {this.state.gameOver ? (
          <button
            onClick={() =>
              this.setState(startState("kingler"))
            }
          >
            Start over
          </button>
        ) : (
          <form>
            <button onClick={() => this.onGuess()}>Guess</button>
            <input
              onChange={(e) => this.onChange(e)}
              value={this.state.currentGuess}
            ></input>
          </form>
        )}
        <Grid values={this.state.guessDeltas}></Grid>
      </div>
    );
  }
}

function Grid(props) {
  const rows = [];
  let deltas = props.values;
  for (var i = 0; i < deltas.length; i += 1) {
    rows.push(<Row key={i} value={deltas[i]} />);
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
    let value = props.value[i];
    squares.push(<Square key={i} value={value}></Square>);
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
