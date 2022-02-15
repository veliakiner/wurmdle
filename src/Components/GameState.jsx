import React from 'react';
import { string, bool } from 'prop-types';

export default function GameState(props) {
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
