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