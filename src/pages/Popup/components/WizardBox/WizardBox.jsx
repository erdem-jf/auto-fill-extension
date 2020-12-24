import React from 'react';
import { string, func, number } from 'prop-types';

const WizardBox = ({ type, className, count, onClick }) => {
  return (
    <button
      className={className}
      onClick={onClick}
    >
      {
        type !== 'new' ? (
          <>
            <h5>{type.toUpperCase()}</h5>
            {/* <h3>{count}</h3> */}
          </>
        ) : (
          <>
            <h3>+</h3>
          </>
        )
      }
    </button>
  );
};

WizardBox.propTypes = {
  title: string,
  className: string,
  count: number,
  onClick: func
};

WizardBox.defaultProps = {
  title: '',
  className: '',
  count: '',
  onClick: ''
};

export default WizardBox;
