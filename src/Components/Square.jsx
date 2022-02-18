import React from 'react';
import { string } from 'prop-types';
import SettingsContext from '../SettingsContext';

function Square(props) {
  const { value } = props;
  const buttonClass = 'square';
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
