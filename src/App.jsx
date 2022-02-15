import React from 'react';
import { string } from 'prop-types';
import './App.css';
import {
  Route, Routes, BrowserRouter, useParams,
} from 'react-router-dom';
import cryptoJs from 'crypto-js';
import Fuse from 'fuse.js';
import genData from './PokemonData';
import Instructions from './Components/Instructions';
import Grid from './Components/Grid';
import GameState from './Components/GameState';
import GensSelector from './Components/GensSelector';
import GameInput from './Components/GameInput';

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

function monsFuse(monsList) {
  const options = {
    includeScore: true,
    minMatchCharLength: 2,
    threshold: 0.6,
  };
  return new Fuse(monsList, options);
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
    partialGuess: '',
    enteredOnce: false,
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

function retrieveLocalStorageGameState() {
  const localStorageString = localStorage.getItem('gameState');
  const checkSum = localStorage.getItem('id');
  if (cryptoJs.SHA256(localStorageString).toString() !== checkSum) {
    return false;
  }
  try {
    const parsedState = JSON.parse(localStorageString);
    // We don't want to set the state to a finished game
    if (parsedState.gameOver) {
      console.log('Old game finished - discarding state.');
      return false;
    }
    console.log('Restoring old game state.');
    return parsedState;
  } catch {
    console.log('Something went wrong.');
    return false;
  }
}
class Board extends React.Component {
  constructor(props) {
    super();
    const parsedState = retrieveLocalStorageGameState();
    if (parsedState) {
      this.state = parsedState;
    } else {
      this.state = startState();
      this.state.answer = toTitleCase(props.answer) || '';
    }
    const rawGenRange = localStorage.getItem('gens');
    const genRange = rawGenRange
      ? rawGenRange.split(',').map((x) => parseInt(x, 10))
      : defaultGenRange;
    this.state.genRange = genRange;
    localStorage.setItem('gens', genRange);
    this.setStateAndUpdateLocalStorage(this.state);
    const monsList = getMonsList(genRange);
    this.state.monsList = monsList;
    this.state.searchRes = [];
    this.state.fuse = monsFuse(monsList);
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
    const input = evt;
    console.log(evt);
    const { fuse } = this.state;
    const searchRes = fuse.search(input).slice(0, 4);
    if (typeof evt === 'string' && evt !== '') {
      console.log('setting to ', input);
      this.setState({ searchRes, partialGuess: input });
    } else {
      this.setState({ searchRes });
    }
  }

  onSelectGuess(guess) {
    this.state.currentGuess = guess;
    this.onGuess();
  }

  onGuess() {
    // sanitise
    console.log('Guessing.');
    const { currentGuess, monsList, partialGuess } = this.state;
    let { guesses, guessDeltas, answer } = this.state;
    if (answer === '') {
      const testAnswer = process.env.REACT_APP_ANSWER;
      if (process.env.REACT_APP_ANSWER !== undefined) {
        answer = toTitleCase(testAnswer);
      } else {
        const monsIndex = Math.round(Math.random() * monsList.length);
        answer = monsList[monsIndex];
      }
    }
    const guess = currentGuess || partialGuess;
    let lastGuess = guess.toLowerCase();
    lastGuess = toTitleCase(lastGuess).trim();
    if (!monsList.includes(lastGuess)) {
      console.log('Setting state...');
      this.setState(
        {
          currentGuess: '',
          partialGuess: '',
        },
        () => {
          this.setState({ searchRes: [] });
          console.log('Invalid guess - do something here. ', lastGuess);
        },
      );
      return false;
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
    this.setStateAndUpdateLocalStorage(
      {
        currentGuess: '',
        partialGuess: '',
        guesses,
        guessDeltas,
        gameOver,
        gameWon: win,
        answer,
        searchRes: [],
      },
      () => {
        console.log(`Guessed ${lastGuess}`);
        console.log(`Guesses: ${guesses.toString()}`);
        console.log(`Guess deltas: ${guessDeltas.toString()}`);
      },
    );
    return true;
  }

  setStateAndUpdateLocalStorage(props) {
    let localStorageState;
    try {
      const localStorageString = localStorage.getItem('gameState');
      const checkSum = localStorage.getItem('id');
      if (cryptoJs.SHA256(localStorageString).toString() === checkSum) {
        localStorageState = JSON.parse(localStorageString) || {};
      } else {
        localStorageState = {};
      }
    } catch (err) {
      localStorageState = {};
    }
    const updatedState = Object.assign(localStorageState, props);
    const updatedStateString = JSON.stringify(updatedState);
    localStorage.setItem('gameState', updatedStateString);
    localStorage.setItem('id', cryptoJs.SHA256(updatedStateString).toString());
    this.setState(props);
  }

  setSliderState(values) {
    const genRange = [values[0], values[1] - 1];
    const monsList = getMonsList(genRange);
    this.setState({
      genRange,
      monsList,
      fuse: monsFuse(monsList),
      searchRes: [],
    });
    localStorage.setItem('gens', genRange);
  }

  resetOnEnter(event) {
    const { gameOver, enteredOnce } = this.state;
    if (event.keyCode === 13 && gameOver) {
      if (enteredOnce) {
        this.setState(startState());
      } else {
        this.setState({ enteredOnce: true });
      }
    }
  }

  render() {
    const {
      gameOver, gameWon, answer, guesses, guessDeltas, genRange,
    } = this.state;

    console.log('Guesses: ', guesses);
    return (
      <div>
        <Instructions />
        <div className="control">
          <GensSelector
            boardRef={this}
            genRange={genRange}
            gameStarted={guesses.length > 0 && !gameOver}
            setSliderState={(values) => { this.setSliderState(values); }}
          />
          <div className="input-container">
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
            <GameInput
              onChange={(evt) => {
                this.onChange(evt);
              }}
              onSelectGuess={(evt) => {
                this.onSelectGuess(evt);
              }}
              onGuess={() => this.onGuess()}
              {...this.state}
            />
          </div>
        </div>
        <Grid guessDeltas={guessDeltas} guesses={guesses} />
      </div>
    );
  }
}

Board.propTypes = { answer: string.isRequired };

function BoardWrapper() {
  const { answer } = useParams();
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
