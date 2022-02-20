import React, { useState } from 'react';
import propTypes from 'prop-types';
import './App.css';
import {
  Route, Routes, BrowserRouter, useParams,
} from 'react-router-dom';
import { allStats } from './Libraries/Pokemon/PokemonData';
import Instructions from './Components/Instructions';
import Grid from './Components/Grid';
import GameState from './Components/GameState';
import GameInput from './Components/GameInput';
import { getMonsList, monsFuse, calcGuesses } from './Libraries/Pokemon/utils';
import {
  retrieveLocalStorageGameState,
  updateLocalStorageGameState,
} from './Libraries/localStorage';
import SettingsPage from './Components/SettingsPage';
import SettingsContext from './SettingsContext';
import Horse from './Components/Horse';

const defaultGenRange = [1, 3];
console.log('No cheating!');
console.log = process.env.NODE_ENV === 'development' ? console.log : () => {}; // implement better logging solution
function genState(genRange) {
  const monsList = getMonsList(genRange);
  const fuse = monsFuse(monsList);
  return {
    genRange,
    monsList,
    fuse,
    searchRes: [],
  };
}
function startState() {
  return {
    answer: '',
    currentGuess: '',
    lastGuess: '',
    guesses: [],
    guessDeltas: [],
    gameOver: false, // TODO: change the gameInProgress
    gameInProgress: false,
    gameWon: false,
    partialGuess: '',
    enteredOnce: false,
    dupeGuess: '',
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
    if (props.parsedState) {
      this.state = props.parsedState;
      console.log('Setting parsed state');
    } else {
      this.state = startState();
      this.state.answer = toTitleCase(props.answer) || '';
    }
    const { genRange, setGameInProgress, forceGameOver } = props;
    this.setGameInProgress = setGameInProgress;
    updateLocalStorageGameState(this.state);
    Object.assign(this.state, genState(genRange));
    const { monsList } = this.state;
    this.maxGuesses = calcGuesses(monsList);

    if (forceGameOver) {
      this.state.gameOver = true;
      this.state.gameInProgress = false;
      this.state.gameWon = false;
      this.state.answer = 'Koffing';
    }
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
      this.setState({ searchRes, partialGuess: input, dupeGuess: '' });
    } else {
      this.setState({ searchRes, dupeGuess: '' });
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
    if (!monsList.includes(lastGuess) || guesses.includes(lastGuess)) {
      console.log('Setting state...');
      this.setState(
        {
          currentGuess: '',
          partialGuess: '',
          dupeGuess: lastGuess,
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
    if (guesses.length > this.maxGuesses - 2) {
      noMoreGuesses = true;
    }
    const gameOver = noMoreGuesses || win;
    const gameInProgress = !gameOver;
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
      updateLocalStorageGameState({
        currentGuess: '',
        partialGuess: '',
        guesses,
        guessDeltas,
        gameOver,
        gameWon: win,
        answer,
        searchRes: [],
        gameInProgress,
      }),
      () => {
        console.log(`Guessed ${lastGuess}`);
        console.log(`Guesses: ${guesses.toString()}`);
        console.log(`Guess deltas: ${guessDeltas.toString()}`);
      },
    );
    console.log('Game in progress after guess?', gameInProgress);
    this.setGameInProgress(gameInProgress);
    return true;
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
      gameOver, gameWon, answer, guesses, guessDeltas, dupeGuess,
    } = this.state;

    console.log('Guesses: ', guesses);
    return (
      <div>
        <Instructions maxGuesses={this.maxGuesses} />
        <div className="control">
          <div className="input-container">
            <div className={gameOver ? '' : 'hide'}>
              <GameState answer={answer} gameWon={gameWon} />

              <div className="start-over">
                <button
                  type="submit"
                  onClick={() => this.setState(startState())}
                >
                  Start over
                </button>
                {' '}
                <span>{' (or type Enter)'}</span>
              </div>
            </div>
            <GameInput
              onChange={(evt) => {
                this.onChange(evt);
              }}
              onSelectGuess={(evt) => {
                this.onSelectGuess(evt);
              }}
              onGuess={() => this.onGuess()}
              onGiveUp={() => this.setState({
                gameOver: true,
                gameWon: false,
                gameInProgress: false,
              })}
              {...this.state}
            />
          </div>
        </div>
        <Grid
          guessDeltas={guessDeltas}
          guesses={guesses}
          dupeGuess={dupeGuess}
        />
      </div>
    );
  }
}

Board.propTypes = {
  answer: propTypes.string.isRequired,
  setGameInProgress: propTypes.func.isRequired,
  genRange: propTypes.arrayOf(propTypes.number).isRequired,
  // TODO: incorrect, and probably shouldn't be passing in arbitrary objects
  parsedState: propTypes.objectOf(propTypes.string).isRequired,
  forceGameOver: propTypes.bool,
};
Board.defaultProps = {
  forceGameOver: false,
};

function BoardWrapper(props) {
  const { force } = props;
  const { answer } = useParams();
  const rawGenRange = localStorage.getItem('gens');
  const parsedState = retrieveLocalStorageGameState();
  const initialGenRange = rawGenRange
    ? rawGenRange.split(',').map((x) => parseInt(x, 10))
    : defaultGenRange;
  const [toggleSettings, setToggleSettings] = useState(force.settings || false);
  const [genRange, setGenRange] = useState(initialGenRange);
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings')) || {},
  );
  const [gameInProgress, setGameInProgress] = useState(
    parsedState.gameInProgress || false,
  );
  if (settings.darkTheme) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('gens', genRange);
  console.log('Show settings', toggleSettings);
  console.log('Gen range', genRange);
  return (
    <div className="container" style={{ maxWidth: '800px', margin: 'auto' }}>
      <meta
        name="viewport"
        content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <SettingsContext.Provider value={settings}>
        <button
          className="settings-btn"
          type="button"
          title="Settings"
          onClick={() => setToggleSettings(!toggleSettings)}
        >
          <img
            alt="Go to the settings page"
            height="40px"
            width="40px"
            src="./settings.svg"
          />
        </button>
        <h1 className="header">Wurmdle</h1>

        {toggleSettings ? (
          <SettingsPage
            setGenRange={setGenRange}
            genRange={genRange}
            gameInProgress={gameInProgress}
            settings={settings}
            setSettings={setSettings}
          />
        ) : (
          <Board
            answer={answer || ''}
            genRange={genRange}
            setGameInProgress={setGameInProgress}
            parsedState={parsedState}
            forceGameOver={force.gameOver}
          />
        )}
      </SettingsContext.Provider>
    </div>
  );
}
BoardWrapper.propTypes = {
  force: propTypes.objectOf(propTypes.bool),
};
BoardWrapper.defaultProps = {
  force: { settings: false, gameOver: false },
};

function App() {
  /* TODO: violates OCP */
  let routes = [
    <Route path="/" element={<BoardWrapper />} />,
    <Route path="/share" element={<Horse />} />,
  ];
  const devRoutes = [
    <Route path="/:answer" element={<BoardWrapper />} />,
    <Route
      path="/settings"
      element={<BoardWrapper force={{ settings: true }} />}
    />,
    <Route
      path="/gameover"
      element={<BoardWrapper force={{ gameOver: true }} />}
    />,
  ];
  if (process.env.NODE_ENV === 'development') {
    routes = routes.concat(devRoutes);
  }
  // So that each route has its own key. Not sure why this fucking matters.
  routes = routes.map((route) => (
    <React.Fragment key={route.props.path}>
      {route}
      {' '}
    </React.Fragment>
  ));
  return (
    <BrowserRouter>
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
}
export default App;
