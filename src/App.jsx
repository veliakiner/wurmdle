import React from 'react';
import propTypes, {
  string, bool, arrayOf, number,
} from 'prop-types';
import './App.css';
import ReactSlider from 'react-slider';
import {
  Route, Routes, BrowserRouter, useParams,
} from 'react-router-dom';
import cryptoJs from 'crypto-js';
import Fuse from 'fuse.js';
import Select from 'react-select';
import genData from './PokemonData';
import Instructions from './Components/Instructions';
import Grid from './Components/Grid';

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

function searchOptions(searchRes) {
  const options = [];
  searchRes.forEach((element) => {
    options.push({ label: element.item, value: element.item });
  });
  console.log(options);
  return options;
}

console.log('No cheating!');
console.log = process.env.NODE_ENV === 'development' ? console.log : () => {}; // implement better logging solution
const maxGuesses = 5;
function startState() {
  console.log('?????');
  return {
    answer: '',
    currentGuess: '',
    lastGuess: '',
    guesses: [],
    guessDeltas: [],
    gameOver: false,
    gameWon: false,
    glow: false,
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
  console.log('Updating???');
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
    // in the case that we select from the dropdown
    // function callbackFunc() {
    //   if (evt.nativeEvent.data === undefined) {
    //     this.onGuess(this.state);
    //   }
    // }
    if (typeof evt === 'string' && evt !== '') {
      console.log('setting to ', input);
      this.setState({ searchRes, partialGuess: input, glow: false });
    } else {
      this.setState({ searchRes, glow: false });
    }
  }

  onGuess(state) {
    // sanitise
    console.log('Guessing???');
    const { currentGuess, monsList, partialGuess } = state;
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
          this.setState({ glow: true, searchRes: [] });
          console.log('Invalid guess - do something here. ', lastGuess);
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
        console.log(`Guesse deltas: ${guessDeltas.toString()}`);
      },
    );
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
      gameOver,
      gameWon,
      answer,
      currentGuess,
      guesses,
      guessDeltas,
      glow,
      genRange,
      searchRes,
      partialGuess,
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

            <form
              className={+gameOver ? 'hide' : ''}
              onSubmit={(evt) => {
                evt.preventDefault();
              }}
            >
              <button
                className="input"
                type="submit"
                onClick={() => this.onGuess(this.state)}
              >
                Guess
              </button>

              <Select
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                className={`input input-box ${glow ? 'glow' : 'no-glow'}`}
                placeholder="Graveler, Pikachu, etc.."
                onInputChange={(e) => this.onChange(e)}
                onChange={(e) => {
                  this.state.currentGuess = e.label;
                  this.onGuess(this.state);
                }}
                value={
                partialGuess !== ''
                  ? {
                    label: currentGuess,
                    value: currentGuess,
                  }
                  : ''
              }
                options={searchOptions(searchRes)}
                noOptionsMessage={() => null}
              />
            </form>
          </div>
        </div>
        <Grid guessDeltas={guessDeltas} guesses={guesses} />
      </div>
    );
  }
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

function setSliderState(values, boardRef) {
  const genRange = [values[0], values[1] - 1];
  const monsList = getMonsList(genRange);
  boardRef.setState({
    genRange,
    monsList,
    fuse: monsFuse(monsList),
    searchRes: [],
  });
  localStorage.setItem('gens', genRange);
}

function GensSelector(props) {
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
GensSelector.propTypes = {
  boardRef: propTypes.any.isRequired, // This suggests passing in a state object is frowned upon
  genRange: arrayOf(number).isRequired,
  gameStarted: bool.isRequired,
};

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
