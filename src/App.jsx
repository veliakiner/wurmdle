import React from 'react';
import './App.css';
import FadeIn from 'react-fade-in';

const stats = require('./gen3.json');

const maxGuesses = 5;
const monsList = Object.keys(stats);
function startState(defaultAns) {
  const monsIndex = Math.round(Math.random() * monsList.length);
  const answer = defaultAns || monsList[monsIndex];
  console.log(answer);
  return {
    answer,
    numRows: 2,
    currentGuess: '',
    lastGuess: '',
    guesses: [],
    guessDeltas: [],
    gameOver: false,
  };
}
const toTitleCase = (phrase) => phrase
  .toLowerCase()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
console.log('No cheating!');
console.log = process.env.NODE_ENV === 'development' ? console.log : () => {}; // implement better logging solution
class Board extends React.Component {
  state = startState();

  resetOnEnter(event) {
    if (event.keyCode === 13 && this.state.gameOver) {
      this.setState(startState());
    }
  }

  componentDidMount() {
    this.resetOnEnter_ = (evt) => {
      this.resetOnEnter(evt);
    }; // hopefully guarantees that I'm removing the event listener...
    document.addEventListener('keydown', this.resetOnEnter_, false);
  }

  componentWillUnmount() {
    console.log(
      document.removeEventListener('keydown', this.resetOnEnter_, false),
    );
  }

  calculateCorrectness(lastGuess) {
    const { answer } = this.state;
    console.log(lastGuess);
    console.log(answer);
    const guessStats = stats[lastGuess].slice(3);
    const ansStats = stats[answer].slice(3);
    const delta = [];
    for (let i = 0; i < guessStats.length; i += 1) {
      const diff = ansStats[i] - guessStats[i];
      if (diff > 0) {
        delta.push(`${guessStats[i]}-`);
      } else if (diff < 0) {
        delta.push(`${guessStats[i]}+`);
      } else {
        delta.push(`${guessStats[i]}=`);
      }
    }
    console.log(delta.toString());
    console.log('Incorrect. Try again');

    if (lastGuess === answer) {
      console.log('Correct!');
      return [delta, true];
    }
    return [delta, false];
  }

  onGuess() {
    // sanitise
    let lastGuess = this.state.currentGuess.toLowerCase();
    lastGuess = toTitleCase(lastGuess).trim();
    if (!(lastGuess in stats)) {
      console.log('Invalid guess.');
      this.setState({
        currentGuess: '',
      });
      return;
    }
    let delta; let win; let
      noMoreGuesses;
    [delta, win] = this.calculateCorrectness(lastGuess);
    if (this.state.guesses.length > maxGuesses - 2) {
      noMoreGuesses = true;
    }
    const gameOver = noMoreGuesses || win;
    console.log(`Game over? ${gameOver}`);
    this.setState(
      {
        numRows: this.state.numRows + 1,
        currentGuess: '',
        guesses: this.state.guesses.concat(lastGuess),
        lastGuess,
        guessDeltas: this.state.guessDeltas.concat([delta]),
        gameOver,
        gameState: win,
      },
      () => {
        console.log(`Guessed ${lastGuess}`);
        console.log(`Guesses: ${this.state.guesses.toString()}`);
        console.log(`Guesse deltas: ${this.state.guessDeltas.toString()}`);
        if (noMoreGuesses && !win) {
          this.setState({
            guesses: this.state.guesses.concat(this.state.answer),
            guessDeltas: this.state.guessDeltas.concat([
              this.calculateCorrectness(this.state.answer)[0],
            ]),
          });
        }
      },
    );
  }

  onChange(evt) {
    const input = evt.target.value;
    this.setState({ currentGuess: input });
  }

  render() {
    return (
      <div>
        <Instructions />
        <div className="control">
          <div className={this.state.gameOver ? '' : 'hide'}>
            <GameState
              values={{
                answer: this.state.answer,
                gameState: this.state.gameState,
              }}
            />
            <button
              className="start-over"
              onClick={() => this.setState(startState())}
            >
              Start over
            </button>
          </div>

          <form
            className={this.state.gameOver ? 'hide' : ''}
            onSubmit={(evt) => {
              evt.preventDefault();
            }}
          >
            <button onClick={() => this.onGuess()}>Guess</button>
            <input
              placeholder="Graveler, Pikachu, etc.."
              onChange={(e) => this.onChange(e)}
              value={this.state.currentGuess}
            />
          </form>
        </div>
        <Grid
          values={{
            deltas: this.state.guessDeltas,
            guesses: this.state.guesses,
          }}
        />
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
            <Square key="toolow" value="0-" />
            {' '}
            Too low
          </span>
          <span className="key-elem">
            <Square key="toohigh" value="999+" />
            {' '}
            Too high
          </span>
          <span className="key-elem">
            <Square key="correct" value="100=" />
            {' '}
            Correct
          </span>
        </div>
      </div>
    </div>
  );
}

function GameState(props) {
  console.log(JSON.stringify(props));
  let endgameString = '';
  const victory = props.values.gameState;
  if (victory) {
    endgameString += 'Game over - you won!';
  } else {
    endgameString += 'Sorry you have lost the game :(.';
  }
  endgameString
    += ` The answer was ${
      props.values.answer
    }. Type enter to start a new game!`;
  return <span className="game-over-msg">{endgameString}</span>;
}
function Grid(props) {
  const rows = [];
  const { deltas } = props.values;
  const { guesses } = props.values;
  rows.push(
    <Row
      key={-1}
      value={['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE']}
      guess="Guess"
    />,
  );
  for (let i = 0; i < deltas.length; i += 1) {
    rows.push(<Row key={i} value={deltas[i]} guess={guesses[i]} />);
  }
  return <div>{rows}</div>;
}

function Row(props) {
  const numSquares = 6;
  const squares = [];
  console.log(JSON.stringify(props));
  for (let i = 0; i < numSquares; i += 1) {
    const value = props.value[i];
    squares.push(<Square key={i} value={value} />);
  }
  squares.push(<Square key={-1} value={props.guess} />);
  return (
    <FadeIn>
      <div className="board-row">{squares}</div>
    </FadeIn>
  );
}
function Square(props) {
  let { value } = props;
  const sign = props.value.slice(-1);
  const classes = { '-': ' toolow', '+': ' toohigh', '=': ' correct' };
  let buttonClass = 'square';
  if ('=-+'.includes(sign)) {
    value = value.slice(0, -1);
    buttonClass += classes[sign] || '';
  }
  return (
    <button className={buttonClass}>
      {value}
      {' '}
    </button>
  );
}
function App() {
  return <Board />;
}
export default App;
