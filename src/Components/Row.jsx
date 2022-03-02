import React from 'react';
import FadeIn from 'react-fade-in';
import { string, arrayOf } from 'prop-types';
import Square, { IconSquare } from './Square';
import { allStats } from '../Libraries/Pokemon/PokemonData';

function createSquares(values) {
  const squares = [];
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    squares.push(<Square key={i} value={value} />);
  }
  return squares;
}
function GuessRow(props) {
  const { guess, values, dupeGuess } = props;
  const squares = createSquares(values);
  squares.push(<IconSquare key={-1} fileName={`./sprites/${allStats[guess].sprite}`} name={guess} />);
  return (
    <FadeIn>
      <div className={`board-row${dupeGuess === guess ? ' animate' : ''}`}>{squares}</div>
    </FadeIn>
  );
}
GuessRow.propTypes = {
  guess: string.isRequired,
  values: arrayOf(string).isRequired,
  dupeGuess: string.isRequired,
};

export function LabelRow(props) {
  const { values } = props;
  const squares = createSquares(values);
  return (
    <FadeIn>
      <div className="board-row">{squares}</div>
    </FadeIn>
  );
}
LabelRow.propTypes = {
  values: arrayOf(string).isRequired,
};

export default GuessRow;
