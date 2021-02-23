### 합성, 상속

[state 끌어올리기](StateUp.md) 에서 보였다시피 react 에서 state, props 를 통해 제어 창구를 하나로
만들어서 사용하는 법을 보았다. 그렇다면 당연하게도 컴포넌트끼리 합성, 상속 그리고 컴포넌트에서 타 컴포넌트를 제어하는 등 작업도 가능하다.

```javascript
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

위 컴포넌트는 porps.children 이라는 특수한 props 를 통해 div 내에 렌더링 하는 것이다.

이렇게 만들어진 컴포넌트를 사용해서 렌더링을 할 경우 이렇게 표현이 가능하다.

```javascript
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

위 WelcomeDialog 컴포넌트의 경우 FancyBoard 컴포넌트에 따라 div tag 내에 props.children 을 렌더링하기에
h1 tag, p tag 를 렌더링하게 된다.

결과적으로 html 내에 이와 같이 렌더링된다.

```html
<div id="root">
  <div class="FancyBorder FancyBoarder-blue">
    <!-- FancyBoard 컴포넌트 내의 props.children start -->
    <h1 class="Dialog-title">
      Welcome
    </h1>
    <p class="Dialog-message">
      Thank you for visiting our spacecraft!
    </p>
    <!-- FancyBoard 컴포넌트 내의 props.children end -->
  </div>
</div>
```

또한 타이틀 - 내용 과 같이 좌 우 형식이 필요할 때도 있다.

```javascript
function Contacts() {
  return <div className="Contacts" />;
}

function Chat() {
  return <div className="Chat" />;
}

function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

Contacts 컴포넌트와 Chat 컴포넌트 를 각기 생성하고 SplitPane 컴포넌트에서는 left, right 로 각기 다른 div tag 에 배치한다.
최종적으로 해당 컴포넌트의 props 에 각 컴포넌트를 mapping 하여 좌우 대비되는 div 구성을 할 수 있다.

기존의 방식과 다를게 없지만 중요한 포인트는 `props 에도 컴포넌트 mapping 이 가능하다` 는 점이다.

![좌우대칭](../../../../../resources/CompositionAndInheritance_1.png)

당연하게도, props 에 컴포넌트를 넣는게 아니라 컴포넌트의 합성을 통해 구현도 가능하다.

```javascript
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

이전과 달라진 점은 FancyBoard 컴포넌트 내부에 아예 구성되는 tag 를 구현하고 내부에 props 로부터 값을 받아 렌더링을 진행했다.

```javascript
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

마찬가지로 지금까지 모든 것을 다 합쳐서도 가능하다.

Dialog 는 위에 언급했던것과 동일하고 그 dialog 내에 children 도 동일하게 붙여넣었다.

그리고 input, button 을 children 으로써 제공하여 합성된 컴포넌트를 제공 할 수 있다.

### 그리고 상속...

아쉽게도 facebook 에서도 상속은 제대로된 케이스에 대해 추천하지 못한다고 한다. 그 이유로는 이미 기존의 react 는 props, state 를 통해 제어가 가능하고
이 부분의 관리포인트가 하나로 일원화로 되어 있어서 제대로된 케이스를 발견하지 못했지 않았을까 싶다.