import React from 'react';
import { string, bool, arrayOf } from 'prop-types';
import './App.css';
import FadeIn from 'react-fade-in';
import genData from './PokemonData';

const stats = genData([1, 2, 3]);

console.log('No cheating!');
console.log = process.env.NODE_ENV === 'development' ? console.log : () => {}; // implement better logging solution

const maxGuesses = 5;
const monsList = Object.keys(stats);
function startState(defaultAns) {
  const monsIndex = Math.round(Math.random() * monsList.length);
  const answer = defaultAns || monsList[monsIndex];
  console.log(answer);
  return {
    answer,
    currentGuess: '',
    lastGuess: '',
    guesses: [],
    guessDeltas: [],
    gameOver: false,
    gameWon: false,
    glow: false,
  };
}
const toTitleCase = (phrase) => phrase
  .toLowerCase()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
class Board extends React.Component {
  constructor() {
    super();
    this.state = startState();
  }

  componentDidMount() {
    /* Don't fully understand why this works. I think it's creating a closure to
    retain reference to the correct "this" */
    this.resetOnEnterWrapped = (evt) => {
      this.resetOnEnter(evt);
    }; // hopefully guarantees that I'm removing the event listener...
    document.addEventListener('keydown', this.resetOnEnterWrapped, false);
  }

  componentWillUnmount() {
    console.log(
      document.removeEventListener('keydown', this.resetOnEnterWrapped, false),
    );
  }

  onChange(evt) {
    const input = evt.target.value;
    this.setState({ currentGuess: input, glow: false });
  }

  onGuess(state) {
    // sanitise
    const {
      currentGuess, guesses, guessDeltas, answer,
    } = state;
    let lastGuess = currentGuess.toLowerCase();
    lastGuess = toTitleCase(lastGuess).trim();
    if (!(lastGuess in stats)) {
      this.setState(
        {
          currentGuess: '',
        },
        () => {
          this.setState({ glow: true });
          console.log('Invalid guess - do something here.');
        },
      );
      return;
    }
    let noMoreGuesses;
    const [delta, win] = this.calculateCorrectness(lastGuess);
    if (guesses.length > maxGuesses - 2) {
      noMoreGuesses = true;
    }
    const gameOver = noMoreGuesses || win;
    console.log(`Game over? ${gameOver}`);
    this.setState(
      {
        currentGuess: '',
        guesses: guesses.concat(lastGuess),
        guessDeltas: guessDeltas.concat([delta]),
        gameOver,
        gameWon: win,
      },
      () => {
        console.log(`Guessed ${lastGuess}`);
        console.log(`Guesses: ${guesses.toString()}`);
        console.log(`Guesse deltas: ${guessDeltas.toString()}`);
        if (noMoreGuesses && !win) {
          this.setState({
            guesses: guesses.concat(answer),
            guessDeltas: guessDeltas.concat([
              this.calculateCorrectness(answer)[0],
            ]),
          });
        }
      },
    );
  }

  calculateCorrectness(lastGuess) {
    const { answer } = this.state;
    console.log(lastGuess);
    let guessStats = stats[lastGuess].stats;
    let ansStats = stats[answer].stats;
    const delta = [];
    // TODO: Refactor into function to test, and make less shit
    guessStats = Object.values(guessStats);
    ansStats = Object.values(ansStats);
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

  resetOnEnter(event) {
    const { gameOver } = this.state;
    if (event.keyCode === 13 && gameOver) {
      this.setState(startState());
    }
  }

  render() {
    const {
      gameOver, gameWon, answer, currentGuess, guesses, guessDeltas, glow,
    } = this.state;
    return (
      <div>
        <Instructions />
        <div className="control">
          <div className={gameOver ? '' : 'hide'}>
            <GameState answer={answer} gameWon={gameWon} />
            <button
              type="submit"
              className="start-over"
              onClick={() => this.setState(startState())}
            >
              Start over
            </button>
          </div>

          <form
            className={gameOver ? 'hide' : ''}
            onSubmit={(evt) => {
              evt.preventDefault();
            }}
          >
            <button type="submit" onClick={() => this.onGuess(this.state)}>
              Guess
            </button>

            <input
              className={glow ? 'glow' : 'no-glow'}
              placeholder="Graveler, Pikachu, etc.."
              onChange={(e) => this.onChange(e)}
              value={currentGuess}
            />
          </form>
        </div>
        <Grid guessDeltas={guessDeltas} guesses={guesses} />
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
  const { answer, gameWon } = props;
  if (gameWon) {
    endgameString += 'Game over - you won!';
  } else {
    endgameString += 'Sorry you have lost the game :(.';
  }
  endgameString += ` The answer was ${answer}. Type enter to start a new game!`;
  return <span className="game-over-msg">{endgameString}</span>;
}
GameState.propTypes = { answer: string.isRequired, gameWon: bool.isRequired };

function Grid(props) {
  const rows = [];
  const { guessDeltas, guesses } = props;
  console.log(guessDeltas);
  rows.push(
    <Row
      key={-1}
      values={['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE']}
      guess="Guess"
    />,
  );
  for (let i = 0; i < guessDeltas.length; i += 1) {
    rows.push(<Row key={i} values={guessDeltas[i]} guess={guesses[i]} />);
  }
  return <div>{rows}</div>;
}
Grid.propTypes = {
  guessDeltas: arrayOf(arrayOf(string)).isRequired,
  guesses: arrayOf(arrayOf(string)).isRequired,
};

function Row(props) {
  const numSquares = 6;
  const squares = [];
  const { guess, values } = props;
  console.log(JSON.stringify(props));
  for (let i = 0; i < numSquares; i += 1) {
    const value = values[i];
    squares.push(<Square key={i} value={value} />);
  }
  squares.push(<Square key={-1} value={guess} />);
  return (
    <FadeIn>
      <div className="board-row">{squares}</div>
    </FadeIn>
  );
}
Row.propTypes = {
  guess: string.isRequired,
  values: arrayOf(string).isRequired,
};

function Square(props) {
  let { value } = props;
  const sign = value.slice(-1);
  const classes = { '-': ' toolow', '+': ' toohigh', '=': ' correct' };
  let buttonClass = 'square';
  if ('=-+'.includes(sign)) {
    value = value.slice(0, -1);
    buttonClass += classes[sign] || '';
  }
  if (value === 'Wurmple') {
    value = 'Wurmdle';
  }
  return (
    <button type="button" className={buttonClass}>
      {value}
      {' '}
    </button>
  );
}
Square.propTypes = { value: string.isRequired };

function App() {
  return <Board />;
}
export default App;
