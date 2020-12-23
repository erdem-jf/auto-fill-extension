import React from 'react';
import { func, string, number } from 'prop-types';

const Range = ({ label, min, max, step, value, onChange }) => {
  return (
    <>
      <input type="range" id={label} name={label} min={min} max={max} onChange={onChange} value={value} aria-label={label} step={step} />
      <span>{value}</span>
    </>
  )
};

Range.propTypes = {
  label: string,
  min: string,
  max: string,
  value: number,
  onChange: func
};

Range.defaultProps = {
  label: '',
  min: "0",
  max: "10",
  value: 0,
  onChange: f => f
};

export default Range;
