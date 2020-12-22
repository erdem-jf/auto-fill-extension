import React from 'react';
import { shape, string, func } from 'prop-types';

const Select = ({
  options,
  value,
  onChange
}) => {
  return (
    <select value={value} onChange={onChange}>
      {
        options.map(option => <option value={option}>{option}</option>)
      }
    </select>
  )
};

Select.propTypes = {
  options: shape([]),
  value: string,
  onChange: func,
};

Select.defaultProps = {
  options: [],
  value: '',
  onChange: '',
};

export default Select;
