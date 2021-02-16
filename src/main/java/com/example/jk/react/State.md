### State

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

이전 props, component 에서 시계를 만들어봤다.

위 컴포넌트는 div 태그로 감싸져있고 안에 h1, h2 태그로 현재 시각이 나타내져 있으며 해당 컴포넌트를 rendering 할 때 1초 주기로
변경점을 반영하게끔 설계되어 있다.

조금 더 간단한 방법은 없을까? 예컨데, 현재의 tick() 의 경우 구성부터 로직, 렌더링까지 모두 포함되어 있다.

이를 State 를 통해 더 간단히 만들 수 있다.

우선 렌더링과 구현을 먼저 분리하자.

```javascript
function Clock(props) {
  return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {props.date.toLocaleTimeString()}.</h2>
      </div>
  );
}

function tick() {
  ReactDom.render(
      <Clock date={new Date()} />,
      Document.getElementById('root')
  )
}

setInterval(tick, 1000);
```

이로써 이전과 동일한 결과이나, 구성과 렌더링을 나눴다. 하지만 완벽하게 끝난건 아닌데, 그 이유는 Clock 에 있다.

tick 은 1초당 한번의 행동만을 관장해야 하며, 렌더링만을 담당해야 한다. 하지만 현재 tick 내에는 Clock 호출과 동시에 시간을 넘겨주게 되어 있다.

```javascript
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

React 내의 Component 를 상속받아 clock 을 class 로 만들어 내고, 내부에서 this 를 활용해서 props 를 사용하게 변경했다.

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

function tick() {
  ReactDom.render(
      <Clock />,
      Document.getElementById('root')
  )
}

setInterval(tick, 1000);
```

이후 constructor 를 이용해서 new Date() 를 받게 변경하고, Clock 태그에서 new Date 를 제거한다.

### Life Cycle

react 생명 주기는 [여기](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) 를 보면 잘 알 수 있다.

최초에 생성시 constructor 를 호출하여 state, props 을 설정해주고 render 를 실행한다.

이후 componentDidMount 함수를 통해 내부에 함수를 설정해준다.

tick 함수 내에는 현재 state (this.state) 에 new Date() 를 할당해주고, didMount 가 1초마다 tick 을 호출하게 timerID 에 지정해준다.
(timerID 의 경우 커스텀 state 이다.)

위의 life cycle 에 의하면 render 가 우선 진행되고, 이후 변경점에 대해 didMount 를 통해 반영하기 때문에 constructor 를 통해 우선 먼저 setting 을
해준 후 진행된다.

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
        () => this.tick(),
        1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDom.render(
    <Clock />,
    Document.getElementById('root')
);
```

요약해보자면

1. constructor 를 통해 초기 props, state 설정
2. render 를 통해 화면 구성
3. componentDidMount 를 통해 로직 구현 (현재는 timer 를 통해 tick 을 1초마다 돌게 할당)
4. 1초마다 didMount 를 통해 변화 감지, 이후 render (this.state.date 를 통해)