import React from 'react';
import { string, arrayOf } from 'prop-types';
import GuessRow, {LabelRow} from './Row';

function Grid(props) {
  const rows = [];
  const { guessDeltas, guesses } = props;
  console.log(guessDeltas);
  rows.push(
    <LabelRow
      key={-1}
      values={['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE']}
      guess="Guess"
    />,
  );
  for (let i = 0; i < guessDeltas.length; i += 1) {
    rows.push(<GuessRow key={i} values={guessDeltas[i]} guess={guesses[i]} />);
  }
  return <div>{rows}</div>;
}

Grid.propTypes = {
  guessDeltas: arrayOf(arrayOf(string)).isRequired,
  guesses: arrayOf(string).isRequired,
};

export default Grid;
