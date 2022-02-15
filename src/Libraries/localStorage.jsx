import cryptoJs from 'crypto-js';

export function retrieveLocalStorageGameState() {
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
export function updateLocalStorageGameState(props) {
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
  return props;
}
