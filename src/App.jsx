import React from 'react';
import propTypes, {
  string, bool, arrayOf, number,
} from 'prop-types';
import './App.css';
import FadeIn from 'react-fade-in';
import ReactSlider from 'react-slider';
import {
  Route, Routes, BrowserRouter, useParams,
} from 'react-router-dom';
import genData from './PokemonData';

function getGens(genRange) {
  const [minGen, maxGen] = genRange;
  const gens = [];
  for (let i = minGen; i <= maxGen; i += 1) {
    gens.push(i);
  }
  return gens;
}

const allStats = genData(getGens([1, 8]));
const defaultGenRange = [1, 3];

function getMonsList(genRange) {
  console.log('Getting list for gens ', genRange);
  const gens = getGens(genRange);
  const stats = genData(gens); // can just filter stats by gens or something
  return Object.keys(stats);
}

console.log('No cheating!');
console.log = process.env.NODE_ENV === 'development' ? console.log : () => {}; // implement better logging solution
const maxGuesses = 5;
function startState() {
  return {
    answer: '',
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

function calculateCorrectness(lastGuess, answer) {
  console.log(lastGuess);
  let guessStats = allStats[lastGuess].stats;
  let ansStats = allStats[answer].stats;
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

class Board extends React.Component {
  constructor(props) {
    super();
    this.state = startState();
    this.state.answer = toTitleCase(props.answer) || '';
    const rawGenRange = localStorage.getItem('gens');
    const genRange = rawGenRange
      ? rawGenRange.split(',').map((x) => parseInt(x, 10))
      : defaultGenRange;
    this.state.monsList = getMonsList(genRange);
    this.state.genRange = genRange;
    localStorage.setItem('gens', genRange);
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
    const { currentGuess, monsList } = state;
    let { guesses, guessDeltas } = state;
    let { answer } = state;
    if (answer === '') {
      const testAnswer = process.env.REACT_APP_ANSWER;
      if (process.env.REACT_APP_ANSWER !== undefined) {
        answer = toTitleCase(testAnswer);
      } else {
        const monsIndex = Math.round(Math.random() * monsList.length);
        answer = monsList[monsIndex];
      }
    }
    let lastGuess = currentGuess.toLowerCase();
    lastGuess = toTitleCase(lastGuess).trim();
    if (!monsList.includes(lastGuess)) {
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
    const [delta, win] = calculateCorrectness(lastGuess, answer);
    if (guesses.length > maxGuesses - 2) {
      noMoreGuesses = true;
    }
    const gameOver = noMoreGuesses || win;
    console.log(`Game over? ${gameOver}`);
    guesses = guesses.concat(lastGuess);
    guessDeltas = guessDeltas.concat([delta]);
    if (gameOver && !win) {
      guesses = guesses.concat(answer);
      guessDeltas = guessDeltas.concat([
        calculateCorrectness(answer, answer)[0],
      ]);
    }
    this.setState(
      {
        currentGuess: '',
        guesses,
        guessDeltas,
        gameOver,
        gameWon: win,
        answer,
      },
      () => {
        console.log(`Guessed ${lastGuess}`);
        console.log(`Guesses: ${guesses.toString()}`);
        console.log(`Guesse deltas: ${guessDeltas.toString()}`);
      },
    );
  }

  resetOnEnter(event) {
    const { gameOver } = this.state;
    if (event.keyCode === 13 && gameOver) {
      this.setState(startState());
    }
  }

  render() {
    const {
      gameOver,
      gameWon,
      answer,
      currentGuess,
      guesses,
      guessDeltas,
      glow,
      genRange,
    } = this.state;

    console.log('Guesses: ', guesses);
    return (
      <div>
        <Instructions />
        <div className="control">
          <SelectGens
            boardRef={this}
            genRange={genRange}
            gameStarted={guesses.length > 0 && !gameOver}
          />
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
        You have five guesses. Adjust the slider to change which generations to
        play with.
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
Board.propTypes = { answer: string.isRequired };

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
  guesses: arrayOf(string).isRequired,
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

function setSliderState(values, boardRef) {
  const genRange = [values[0], values[1] - 1];
  boardRef.setState({
    genRange,
    monsList: getMonsList(genRange),
  });
  localStorage.setItem('gens', genRange);
}

function SelectGens(props) {
  const { boardRef, genRange, gameStarted } = props;
  console.log(gameStarted);
  return (
    <ReactSlider
      disabled={gameStarted}
      className="horizontal-slider"
      thumbClassName="example-thumb"
      trackClassName="example-track"
      defaultValue={[genRange[0], genRange[1] + 1]}
      ariaLabel={['Lower thumb', 'Upper thumb']}
      ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
      renderThumb={(props2, state) => (
        <div {...props2}>{state.valueNow - state.index}</div>
      )}
      pearling
      onAfterChange={(values) => {
        setSliderState(values, boardRef);
      }}
      minDistance={1}
      min={1}
      max={9}
      marks
    />
  );
}
SelectGens.propTypes = {
  boardRef: propTypes.any.isRequired, // This suggests passing in a state object is frowned upon
  genRange: arrayOf(number).isRequired,
  gameStarted: bool.isRequired,
};

function BoardWrapper() {
  const { answer } = useParams();
  console.log(answer);
  return <Board answer={answer || ''} />;
}

function App() {
  /* TODO: violates OCP */
  const routes = [<Route path="/" element={<BoardWrapper />} />];
  // Helps hardcode answer when testing
  if (process.env.NODE_ENV === 'development') {
    routes.push(<Route path="/:answer" element={<BoardWrapper />} />);
  }
  return (
    <BrowserRouter>
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
}
export default App;
