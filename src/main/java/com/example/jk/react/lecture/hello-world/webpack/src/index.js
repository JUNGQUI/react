import React from 'react';
import ReactDom from 'react-dom';
import Button from './Button.js';

function Container() {
  return React.createElement(
      'div'
      , null
      , React.createElement('p', null, '버튼 클릭')
      , React.createElement(Button, {label : "좋아요"})
      , React.createElement(Button, {label : "싫어요"})
  )
}

const documentDom = document.getElementById('root');
ReactDom.render(React.createElement(Container), documentDom);