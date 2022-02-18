import React from 'react';
import FadeIn from 'react-fade-in';
import { string, arrayOf } from 'prop-types';
import Square, {IconSquare} from './Square';

function GuessRow(props) {
  const numSquares = 6;
  const squares = [];
  const { guess, values } = props;
  console.log(JSON.stringify(props));
  for (let i = 0; i < numSquares; i += 1) {
    const value = values[i];
    squares.push(<Square key={i} value={value} />);
  }
  squares.push(<IconSquare key={-1} fileName={`./sprites/${guess.toLowerCase()}.png`} />);
  return (
    <FadeIn>
      <div className="board-row">{squares}</div>
    </FadeIn>
  );
}
GuessRow.propTypes = {
  guess: string.isRequired,
  values: arrayOf(string).isRequired,
};



export function LabelRow(props) {
  const numSquares = 6;
  const squares = [];
  const { guess, values } = props;
  console.log(JSON.stringify(props));
  for (let i = 0; i < numSquares; i += 1) {
    const value = values[i];
    squares.push(<Square key={i} value={value} />);
  }
  squares.push(<IconSquare key={-1} />);
  return (
    <FadeIn>
      <div className="board-row">{squares}</div>
    </FadeIn>
  );
}
LabelRow.propTypes = {
  guess: string.isRequired,
  values: arrayOf(string).isRequired,
};


export default GuessRow;
