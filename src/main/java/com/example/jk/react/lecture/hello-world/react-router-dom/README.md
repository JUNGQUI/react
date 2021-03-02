### SPA

- popstate : 브라우저 ui 를 통해 페이저 전환 시
- pushState, replaceState : 자바스크립트를 통해 페이지 전환 시

```javascript
import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';

function App() {
  const [pageName, setPageName] = useState('');
  
  useEffect(() => {
    window.onpopstate = function (event) {
      console.log(`location: ${document.location}, state: ${event.state}`)
    };
  }, []);
  
  function onClick1() {
    const pageName = 'page1';
    window.history.pushState(pageName, '', '/page1');
    setPageName(pageName);
  }

  function onClick2() {
    const pageName = 'page2';
    window.history.pushState(pageName, '', '/page2');
    setPageName(pageName);
  }
  
  return (
      <div>
        <button onClick={onClick1}>
          page1
        </button>
        <button onClick={onClick2}>
          page2
        </button>
      </div>
  );
}

React.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
);

```

### react-router-dom

장점
- 상태 변경에 따른 rendering 관리
- 코드 스플리팅

설치
- npm install react-route-dom

```javascript
import { BrowserRouter, Route, Link } from 'react-router-dom';

<BrowserRouter>
  <Link to={SOME_URI}>go SOME_URI</Link>
  <Link to='/'>HOME</Link>
  
  <Route exact path="/" component={Home}/>  // url 이 명확하게 / 일때만 렌더링
  <Route path="/photo" component={Photo}/>  // url 이 /photo, /photo/my/photo. /photo/you 일 경우 렌더링
</BrowserRouter>
```

BrowserRouter 를 통해 Route 내의 컴포넌트 내 state 가 있을 경우 지정된 state 에 대해 관리를 해준다.

예컨데, `match` 라는 state 가 있는데, 이 state 가 컴포넌트 내에 있을 경우 url route 되서 들어온 url 을 가져오게 된다.

이와 같이 잘 알면 사용하기에 따라 쉽게 여러 state 나 routing 이 가능하다.