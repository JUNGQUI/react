### Event 처리

JSX 부분에서 설명했듯이 React 에서 이벤트는 표기하는 방식이 다르다.

기존 javascript 가 이와 같다면

```javascript
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React 의 경우 JSX 에서 보았듯이 괄호를 통해 묶은 상태에서 function 을 지정해준다.

```javascript
<button onclick={activateLasers}>
  Activate Lasers
</button>
```

그래서 이벤트를 만들면 이와 같이 구현이 가능하다.

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 콜백에서 `this`가 작동하려면 아래와 같이 바인딩 해주어야 합니다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

컴포넌트 내에 handleClick 함수를 만들고 render 시 해당 함수를 호출하게 적용한다.

이렇게 발생한 이벤트에 대해 state 를 바꾸게 변경하고 state 에 따라 버튼의 이름이 바뀌게 변경했다.

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 콜백에서 `this`가 작동하려면 아래와 같이 바인딩 해주어야 합니다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

React 에서 EventListener 를 별도로 지정할 필요 없이 초기 rendering 당시 function 을 정의하여 JSX 에 mapping 해주면 가능하다.

위 코드를 보면

```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // constructor 당시 this 의 handleClick 에 this.handleClick 을 bind 하되
    // bind 하면서 this 즉, props 를 전달한다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // handleClick 의 경우 호출 받을 경우 this 의 state 를 set 한다.
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    // rendering 시 this 의 handleClick 을 mapping 한다.
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

> 주의
> bind 동시에 this 를 (props 를) 주지 않을 경우 bind 이후 함수에서 호출하는
> this의 경우 windows 혹은 undefined 가 된다.
> 
> 이럴경우 당연하게도, this 에는 state 가 없기 때문에 setState 도 의미가 없고 적용이 되지 않는다.
> 
> 그렇기 때문에 this 를 통해 props 를 constructor 에서 bind 를 통해 props 를 해당 function 에 말 그대로 binding 해준다.
> 
> 물론 내부에서 state 를 변경하지 않는 function 이라면 그대로 bind() 로 (parameter 없이) 진행을 해도 괜찮다.
> ~~근데 이러면 react function 이 아니잖아...~~