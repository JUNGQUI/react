### 조건부 렌더링

JSX 를 통해 redner 를 할 수 있고 상황에 따라 component 를 다르게 mapping 이 가능하다.

예컨데, 이전에 봤던 toggle button 또한 조건부 렌더링의 일환이라고 볼 수 있다.

아래의 조건을 가지는 화면을 그려내야 한다고 가정해보자.

#### 로그인 로그아웃 기능을 구현

1. 각 상태 (로그인/아웃) 마다 h1 tag 를 이용해서 다른 인사말이 등장
2. 각 상태마다 버튼의 구성이 변경 (로그인/아웃)
3. 각 상태마다 버튼에 mapping 되어 있는 event 가 변경
    - 로그인 시 -> 로그아웃 이벤트
    - 로그아웃 시 -> 로그인 이벤트
    
우선 각 상황 별 component 가 필요하다.

```javascript
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

이후 상태에 따라 변경되게 각 컴포넌트를 합성하여 새로운 컴포넌트를 만들자.

```javascript
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
```

이제 버튼을 만들어야 한다. 마찬가지로, 각 상태별로 버튼 컴포넌트가 달라져야 한다.

```javascript
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

마지막으로 각 상태별 버튼 이벤트 (로그인/아웃) 을 추가하자.

```javascript
handleLoginClick() {
  this.setState({isLoggedIn: true});
}

handleLogoutClick() {
  this.setState({isLoggedIn: false});
}
```

클릭 시 해당 이벤트들이 발생하게 되고 setState 를 통해서 state 가 변경되게 된다.

완성된 최종 구문을 보자면 아래와 같다.

```javascript
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    
    // event binding
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    
    // state 설정 (로그인/아웃)
    this.state = {isLoggedIn: false};
  }

  // 로그인 이벤트
  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  // 로그아웃 이벤트
  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    // render 당시 state 에서 로그인 상태를 가져온다.
    const isLoggedIn = this.state.isLoggedIn;
    
    // 상태에 따라 button 컴포넌트 분기점
    let button;
    if (isLoggedIn) {
      // 앞서 로그인/아웃 이벤트가 bind 되었기 때문에 function 을 그대로 전달
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      // 상동
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

이와 같이 분기를 통해 컴포넌트 설정이 가능하다.

그런데, 막상 만들고 나니 굉장히 복잡한 것 같다. 가독성을 위한다면 좋은 방법이나 실제로 구현 시 많은 코드가 필요하게 된다.

react 에서는 이와 같은 상황에 대해 && 연산자를 사용할 수 있다.
우리가 흔히 아는 && 연산자의 경우 특히 if 에서는 and condition 을 의미하는데, react rendering 에서는 expression 으로 표현된다.

즉,

```javascript
render() {
  const count = 0;
  return (
      <div>
        { count && <h1>Messages: {count}</h1>}
      </div>
  );
}

```

```javascript
function Message (props) {
  if (props.count == 0) {
    return;
  } else {
    return <h1>Messages : {props.count}</h1>
  }
}

render() {
  const count = 0;
  return (
      <div>
        <Message count={count} />
      </div>
  );
}
```

위의 두가지 case 의 경우 동일한 결과를 나타낸다.

즉, react 내의 if && condition 은 `condition ? expression : null` 의 의미를 가진다.

물론 당연하게도 위와 같은 방식의 구현도 inline 으로 구현 가능하다.

`condition ? true Expression : false Expression`

```javascript
function Message (props) {
  // 위의 compnent 의 결과가 간단해졌다.
  return props.count == 0 ? null : <h1>Messages : {props.count}</h1>
}

render() {
  const count = 0;
  return (
      <div>
        <Message count={count} />
      </div>
  );
}
```

또한 위에서 보았다시피 null 을 반환하게 되면 아무런 rendering 을 하지 않는다. 즉 컴포넌트는 빈 값을 그리게 되기 때문에 어떠한 것도 그려지지 않는다.
