import React, { useState } from 'react';
import Select from 'react-select';
import {
  string, bool, func, arrayOf,
} from 'prop-types';

function searchOptions(searchRes) {
  const options = [];
  searchRes.forEach((element) => {
    options.push({ label: element.item, value: element.item });
  });
  console.log(options);
  return options;
}

function GameInput(props) {
  const {
    onChange,
    onSelectGuess,
    onGuess,
    gameOver,
    currentGuess,
    searchRes,
    partialGuess,
  } = props;
  const [glow, setGlow] = useState(0);

  return (
    <form
      className={+gameOver ? 'hide' : ''}
      onSubmit={(evt) => {
        evt.preventDefault();
      }}
    >
      <button
        className="input"
        type="submit"
        onClick={() => {
          if (!onGuess()) {
            setGlow(true);
          }
        }}
      >
        Guess
      </button>

      <Select
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        className={`input input-box ${glow ? 'glow' : 'no-glow'}`}
        placeholder="Graveler, Pikachu, etc.."
        onInputChange={(e) => {
          setGlow(false);
          onChange(e);
        }}
        onChange={(e) => onSelectGuess(e.label)}
        value={
          partialGuess !== ''
            ? {
              label: currentGuess,
              value: currentGuess,
            }
            : ''
        }
        options={searchOptions(searchRes)}
        noOptionsMessage={() => null}
      />
    </form>
  );
}
GameInput.propTypes = {
  onChange: func.isRequired,
  onGuess: func.isRequired,
  onSelectGuess: func.isRequired,
  gameOver: bool.isRequired,
  currentGuess: string.isRequired,
  partialGuess: string.isRequired,
  searchRes: arrayOf(string).isRequired, // is wrong, fix later
};

export default GameInput;
