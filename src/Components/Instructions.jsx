import React from 'react';
import propTypes from 'prop-types';
import Square from './Square';

function Instructions(props) {
  const { maxGuesses } = props;
  return (
    <div>
      <div className="subtitle">
        Try to guess the Pokemon based on its base stats! You have
        {' '}
        {maxGuesses}
        {' '}
        guesses.
        <div>
          Report issues or suggest improvements/features
          {' '}
          <a href="https://github.com/veliakiner/wurmdle/issues">here</a>
          .
        </div>
      </div>
      <div className="key">
        <div className="key-elem">Key:</div>
        <div className="keys">
          <span className="key-elem">
            <Square key="toolow" value="0-" />
            {' '}
            Too low
          </span>
          <span className="key-elem">
            <Square key="toohigh" value="999+" />
            {' '}
            Too high
          </span>
          <span className="key-elem">
            <Square key="correct" value="100=" />
            {' '}
            Correct
          </span>
        </div>
      </div>
    </div>
  );
}

Instructions.propTypes = {
  maxGuesses: propTypes.number.isRequired,
};

export default Instructions;
