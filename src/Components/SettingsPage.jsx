import React from 'react';
import propTypes from 'prop-types';
import GensSelector from './GensSelector';

function SettingsPage(props) {
  const { gameInProgress, genRange, setGenRange } = props;
  console.log('Game in progress?', gameInProgress);
  return (
    <div className="control">
      <GensSelector
        boardRef={this}
        genRange={genRange}
        gameStarted={gameInProgress}
        setSliderState={(values) => {
          setGenRange([values[0], values[1] - 1]);
        }}
      />
    </div>
  );
}

SettingsPage.propTypes = {
  gameInProgress: propTypes.bool.isRequired,
  genRange: propTypes.arrayOf(propTypes.number).isRequired,
  setGenRange: propTypes.func.isRequired,
};

export default SettingsPage;
