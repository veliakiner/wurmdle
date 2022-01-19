import React from "react";
import "./App.css";
import FadeIn from "react-fade-in";

const stats = require("./gen3.json");
const maxGuesses = 5;
let monsList = Object.keys(stats);
function startState(defaultAns) {
  let answer = defaultAns || monsList[(Math.random() * monsList.length) | 0];
  console.log(answer);
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
const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
console.log("No cheating!")
console.log = (process.env.NODE_ENV === "development") ? console.log: () => {} // implement better logging solution
class Board extends React.Component {
  state = startState();
  calculateCorrectness(lastGuess) {
    let answer = this.state.answer;
    console.log(lastGuess);
    console.log(answer);
    let guessStats = stats[lastGuess].slice(3);
    let ansStats = stats[answer].slice(3);
    let delta = [];
    for (var i = 0; i < guessStats.length; i += 1) {
      let diff = ansStats[i] - guessStats[i];
      if (diff > 0) {
        delta.push(guessStats[i] + "-");
      } else if (diff < 0) {
        delta.push(guessStats[i] + "+");
      } else {
        delta.push(guessStats[i] + "=");
      }
    }
    console.log(delta.toString());
    console.log("Incorrect. Try again");

    if (lastGuess === answer) {
      console.log("Correct!");
      return [delta, true];
    }
    return [delta, false];
  }
  onGuess() {
    // sanitise
    let lastGuess = this.state.currentGuess.toLowerCase();
    lastGuess = toTitleCase(lastGuess).trim();
    if (!(lastGuess in stats)) {
      console.log("Invalid guess.");
      this.setState({
        currentGuess: "",
      });
      return;
    }
    let delta, win, noMoreGuesses;
    [delta, win] = this.calculateCorrectness(lastGuess);
    if (this.state.guesses.length > maxGuesses - 2) {
      noMoreGuesses = true;
    }
    let gameOver = noMoreGuesses || win;
    console.log("Game over? " + gameOver);
    this.setState(
      {
        numRows: this.state.numRows + 1,
        currentGuess: "",
        guesses: this.state.guesses.concat(lastGuess),
        lastGuess: lastGuess,
        guessDeltas: this.state.guessDeltas.concat([delta]),
        gameOver: gameOver,
        gameState: win,
      },
      () => {
        console.log("Guessed " + lastGuess);
        console.log("Guesses: " + this.state.guesses.toString());
        console.log("Guesse deltas: " + this.state.guessDeltas.toString());
        if (noMoreGuesses && !win) {
          this.setState({
            guesses: this.state.guesses.concat(this.state.answer),
            guessDeltas: this.state.guessDeltas.concat([
              this.calculateCorrectness(this.state.answer)[0],
            ]),
          });
        }
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
        <Instructions></Instructions>
        <div className="control">
          {this.state.gameOver ? (
            <div>
              <GameState
                values={{
                  answer: this.state.answer,
                  gameState: this.state.gameState,
                }}
              ></GameState>
              <button
                className="start-over"
                onClick={() => this.setState(startState())}
              >
                Start over
              </button>
            </div>
          ) : (
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
              }}
            >
              <button onClick={() => this.onGuess()}>Guess</button>
              <input
                placeholder="Graveler, Pikachu, etc.."
                onChange={(e) => this.onChange(e)}
                value={this.state.currentGuess}
              ></input>
            </form>
          )}
        </div>
        <Grid
          values={{
            deltas: this.state.guessDeltas,
            guesses: this.state.guesses,
          }}
        ></Grid>
      </div>
    );
  }
}

function Instructions() {
  return (
    <div>
      <div className="subtitle">
        Welcome to Wurmdle! Try to guess the Pokemon based on its base stats!
        You have five guesses, Gens 1-3 only.
      </div>
      <div className="key">
        <div className="key-elem">Key:</div>
        <div className="keys">
          <span className="key-elem">
            <Square key="toolow" value="0-"></Square> Too low
          </span>
          <span className="key-elem">
            <Square key="toohigh" value="999+"></Square> Too high
          </span>
          <span className="key-elem">
            <Square key="correct" value="100="></Square> Correct
          </span>
        </div>
      </div>
    </div>
  );
}

function GameState(props) {
  console.log(JSON.stringify(props));
  let endgameString = "";
  let victory = props.values.gameState;
  if (victory) {
    endgameString += "Game over - you won!";
  } else {
    endgameString += "Sorry you have lost the game :(.";
  }
  endgameString += " The answer was " + props.values.answer;
  return <span className="game-over-msg">{endgameString}</span>;
}
function Grid(props) {
  const rows = [];
  let deltas = props.values.deltas;
  let guesses = props.values.guesses;
  rows.push(
    <Row
      key={-1}
      value={["HP", "ATK", "DEF", "SPA", "SPD", "SPE"]}
      guess={"Guess"}
    />
  );
  for (var i = 0; i < deltas.length; i += 1) {
    rows.push(<Row key={i} value={deltas[i]} guess={guesses[i]} />);
  }
  return <div>{rows}</div>;
}

function Row(props) {
  let numSquares = 6;
  let squares = [];
  console.log(JSON.stringify(props));
  for (var i = 0; i < numSquares; i += 1) {
    let value = props.value[i];
    squares.push(<Square key={i} value={value}></Square>);
  }
  squares.push(<Square key={-1} value={props.guess}></Square>);
  return (
    <FadeIn>
      <div className="board-row">{squares}</div>
    </FadeIn>
  );
}
function Square(props) {
  let value = props.value;
  let sign = props.value.slice(-1);
  let classes = { "-": " toolow", "+": " toohigh", "=": " correct" };
  let buttonClass = "square";
  if ("=-+".includes(sign)) {
    value = value.slice(0, -1);
    buttonClass += classes[sign] || "";
  }
  return <button className={buttonClass}>{value} </button>;
}
function App() {
  return <Board></Board>;
}
export default App;
