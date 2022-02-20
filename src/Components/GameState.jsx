import React from 'react';
import { string, bool } from 'prop-types';

export default function GameState(props) {
  console.log(JSON.stringify(props));
  let endgameString = '';
  const { answer, gameWon } = props;
  if (gameWon) {
    endgameString += 'You won!';
  } else {
    endgameString += 'You lost.';
  }
  endgameString += ` The answer was ${answer}. `;
  return <span className="game-over-msg">{endgameString}</span>;
}
GameState.propTypes = { answer: string.isRequired, gameWon: bool.isRequired };
