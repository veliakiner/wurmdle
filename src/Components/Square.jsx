import React from 'react';
import { string } from 'prop-types';
import SettingsContext from '../SettingsContext';

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
    <SettingsContext.Consumer>
      {(settings) => (
        <button type="button" className={buttonClass + (settings.colourBlind ? ' colour-blind' : '')}>
          {value}
          {' '}
        </button>
      )}

    </SettingsContext.Consumer>
  );
}
export function IconSquare(props) {
  const { fileName, name } = props;
  const buttonClass = 'icon-square';
  return (
    <SettingsContext.Consumer>
      {(settings) => (
        <button type="button" className={buttonClass + (settings.colourBlind ? ' colour-blind' : '')}>
          <img className="guess-img" src={fileName} title={name}/>
          {' '}
        </button>
      )}

    </SettingsContext.Consumer>
  );
}

export function LabelSquare(props) {
  const { value } = props;
  const buttonClass = 'icon-square';
  return (
    <SettingsContext.Consumer>
      {(settings) => (
        <button type="button" className={buttonClass + (settings.colourBlind ? ' colour-blind' : '')}>
          {value}
          {' '}
        </button>
      )}

    </SettingsContext.Consumer>
  );
}

Square.propTypes = { value: string.isRequired };

export default Square;
