import '../../styles/main.scss';
import React from 'react';
import { render } from 'react-dom';

import Store from './store';
import Popup from './Popup';

render((
  <Store>
    <Popup />
  </Store>
), window.document.querySelector('#root'));
