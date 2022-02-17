import React from 'react';
import propTypes from 'prop-types';
import GensSelector from './GensSelector';

function SettingsPage(props) {
  const {
    gameInProgress, genRange, setGenRange, cbFriendly, setCbFriendly,
  } = props;
  console.log('CB friendly?', cbFriendly);
  return (
    <div className="control">
      <h4 style={{ 'text-align': 'center' }}>Settings</h4>
      <span>Adjust the slider to change which generations to play with. </span>
      <GensSelector
        genRange={genRange}
        gameStarted={gameInProgress}
        setSliderState={(values) => {
          setGenRange([values[0], values[1] - 1]);
        }}
      />
      <span>Colour-blind friendly?</span>
      <input
        type="checkbox"
        checked={cbFriendly}
        onChange={() => {
          setCbFriendly(!cbFriendly);
          localStorage.setItem('cbFriendly', !cbFriendly);
        }}
      />
    </div>
  );
}

SettingsPage.propTypes = {
  gameInProgress: propTypes.bool.isRequired,
  genRange: propTypes.arrayOf(propTypes.number).isRequired,
  setGenRange: propTypes.func.isRequired,
  cbFriendly: propTypes.bool.isRequired,
  setCbFriendly: propTypes.func.isRequired,
};

export default SettingsPage;
