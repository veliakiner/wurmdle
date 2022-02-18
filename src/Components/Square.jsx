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
  let { fileName } = props;
  let buttonClass = 'icon-square';
  return (
    <SettingsContext.Consumer>
      {(settings) => (
        <button type="button" className={buttonClass + (settings.colourBlind ? ' colour-blind' : '')}>
          <img src={fileName}/>
          {' '}
        </button>
      )}

    </SettingsContext.Consumer>
  );
}

export function LabelSquare(props) {
  let { value } = props;
  let buttonClass = 'icon-square';
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