import React from 'react';
import propTypes from 'prop-types';
import GensSelector from './GensSelector';

function SettingsPage(props) {
  const {
    gameInProgress, genRange, setGenRange, settings, setSettings,
  } = props;
  console.log('Settings:', settings);
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
      <div>
        <span>Colour-blind friendly?</span>
        <input
          type="checkbox"
          checked={settings.colourBlind}
          onChange={() => {
            settings.colourBlind = !settings.colourBlind;
              // Can't assign the existing object, 
              // presumably because react doesn't check object props to see if it's changed.
            setSettings({ ...settings });
            localStorage.setItem('settings', JSON.stringify(settings));
          }}
        />
      </div>
      <div>
        <span>Dark theme?</span>
        <input
          type="checkbox"
          checked={settings.darkTheme}
          onChange={() => {
            settings.darkTheme = !settings.darkTheme;
            setSettings({ ...settings });
            localStorage.setItem('settings', JSON.stringify(settings));
          }}
        />
      </div>
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
