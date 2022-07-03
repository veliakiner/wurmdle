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
        label="Only fully-evolved?"
        settings={settings}
        prop="onlyFullyEvolved"
        setSettings={setSettings}
        disable={gameInProgress}
      />
      <div className="settings-option-container">
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
    </div>
  );
}

SettingsPage.propTypes = {
  gameInProgress: propTypes.bool.isRequired,
  genRange: propTypes.arrayOf(propTypes.number).isRequired,
  setGenRange: propTypes.func.isRequired,
  settings: propTypes.objectOf(propTypes.bool).isRequired,
  setSettings: propTypes.func.isRequired,
};

function BooleanSettingsOption(props) {
  const {
    label, settings, setSettings, prop, disable,
  } = props;
  return (
    <div className="settings-option">
      <label>
        <span style={{ padding: '5px' }}>{label}</span>
        <input
          disabled={disable}
          type="checkbox"
          checked={settings[prop]}
          onChange={() => {
            settings[prop] = !settings[prop];
            setSettings({ ...settings });
            localStorage.setItem('settings', JSON.stringify(settings));
          }}
        />
      </label>
    </div>
  );
}
BooleanSettingsOption.propTypes = {
  label: propTypes.string.isRequired,
  settings: propTypes.objectOf(propTypes.bool).isRequired,
  setSettings: propTypes.func.isRequired,
  prop: propTypes.string.isRequired,
  disable: propTypes.bool,
};
BooleanSettingsOption.defaultProps = {
  disable: false,
};
export default SettingsPage;
