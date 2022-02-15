import React from 'react';
import propTypes, { bool, arrayOf, number } from 'prop-types';
import ReactSlider from 'react-slider';

function GensSelector(props) {
  const { genRange, gameStarted, setSliderState } = props;
  console.log(gameStarted);
  return (
    <ReactSlider
      disabled={gameStarted}
      className="horizontal-slider"
      thumbClassName="example-thumb"
      trackClassName="example-track"
      defaultValue={[genRange[0], genRange[1] + 1]}
      ariaLabel={['Lower thumb', 'Upper thumb']}
      ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
      renderThumb={(props2, state) => (
        <div {...props2}>{state.valueNow - state.index}</div>
      )}
      pearling
      onAfterChange={(values) => {
        setSliderState(values);
      }}
      minDistance={1}
      min={1}
      max={9}
      marks
    />
  );
}

GensSelector.propTypes = {
  setSliderState: propTypes.func.isRequired,
  genRange: arrayOf(number).isRequired,
  gameStarted: bool.isRequired,
};

export default GensSelector;
