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

