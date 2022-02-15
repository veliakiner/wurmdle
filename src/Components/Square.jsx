import React from 'react';
import { string } from 'prop-types';

function Square(props) {
  let { value } = props;
  const sign = value.slice(-1);
  const classes = { '-': ' toolow', '+': ' toohigh', '=': ' correct' };
  let buttonClass = 'square';
  if ('=-+'.includes(sign)) {
    value = value.slice(0, -1);
    buttonClass += classes[sign] || '';
  }
  if (value === 'Wurmple') {
    value = 'Wurmdle';
  }
  return (
    <button type="button" className={buttonClass}>
      {value}
      {' '}
    </button>
  );
}

Square.propTypes = { value: string.isRequired };

export default Square;
