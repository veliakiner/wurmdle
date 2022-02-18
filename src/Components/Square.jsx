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

export function IconSquare(props) {
  const { fileName } = props;
  let { name } = props;
  const buttonClass = 'square icon-square';

  name = name === 'Wurmple' ? 'Wurmdle' : name;
  return (
    <SettingsContext.Consumer>
      {(settings) => (
        <button type="button" className={buttonClass + (settings.colourBlind ? ' colour-blind' : '')}>
          <img alt={name} className="guess-img" src={fileName} title={name} />
          {' '}
        </button>
      )}

    </SettingsContext.Consumer>
  );
}
IconSquare.propTypes = { name: string.isRequired, fileName: string.isRequired };

export default Square;
