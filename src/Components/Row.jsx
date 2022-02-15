import React from 'react';
import FadeIn from 'react-fade-in';
import { string, arrayOf } from 'prop-types';
import Square from './Square';

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

export default Row;
