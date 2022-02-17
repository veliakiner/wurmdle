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
      <BooleanSettingsOption
        label="Colour-blind friendly?"
        settings={settings}
        prop="colourBlind"
        setSettings={setSettings}
      />
      <BooleanSettingsOption
        label="Dark theme?"
        settings={settings}
        prop="darkTheme"
        setSettings={setSettings}
      />
    </div>
  );
}

function BooleanSettingsOption(props) {
  const {
    label, settings, setSettings, prop,
  } = props;
  return (
    <div className="settings-option-container">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={settings[prop]}
        onChange={() => {
          settings[prop] = !settings[prop];
          setSettings({ ...settings });
          localStorage.setItem('settings', JSON.stringify(settings));
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
