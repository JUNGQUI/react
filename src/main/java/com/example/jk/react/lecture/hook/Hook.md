### Hook

리액트 진영 ~~페이스북~~ 에서 밀고 있는 API 이다.

배경은 기존의 리액트에서 변화 시 불편한 점에서 출발하게 되었다.
리액트에서 state 변경 및 class component 없이는 state 에 대한 변화나 리액트 life cycle 에 접근해서 처리를 하기가 어렵다.

이로 인해 컴포넌트 내에서 변화를 하려면 [render props](https://ko.reactjs.org/docs/render-props.html) 혹은 [고차 컴포넌트](https://ko.reactjs.org/docs/higher-order-components.html)
구성이 필수적이다.

그러나 이와 같은 구성을 할 경우 복잡해지는 로직에서는 추적하기가 힘들고 관리에도 많은 노력이 필요해지기에 가독성 측면에도 좋지 않다.

이러한 부분을 어려움 없이 수행하고자 hook 이 개발하게 되었다.

#### State Hook

State Hook 은 이름에서도 알 수 있듯이 state 관련된 Hook 이다.

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.tick();
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  // ...
}
```

일반적으로 이와 같이 class 내에서 state 에 대한 수정 접근이 가능해지는데, 리액트에서 이와 같은 구성을 하려면
class 를 계속 생성해야 한다.

그와 반면 hook 을 사용하면

```javascript
function Clock() {
  const [date, setDate] = useState(new Date());
  
  function onChange() {
    setDate(new Date());
  }
  // ...
}
```

이런식으로 function level 에서 state 초기값 설정과 state 변경이 되는 setState 를 이용 할 수 있다.

#### state 는 비동기 배치로 처리된다.

```javascript
function onClick() {
  // 실제로 두배로 값을 늘리고 싶어서 수행했지만, count
  // setCount(count + 1);
  // setCount(count + 1);
  setCount(value => value + 1);
  setCount(value => value + 1);
}
```

위와 같이 count + 1 이후 다시 setCount 를 호출하면 이전에 증가했기 때문에 2배로 증가를 해야 할 것으로 기대된다.

하지만 state 의 경우 비동기 배치 형식으로 작동하기 때문에 state 가 올라가고 일괄적으로 적용이 된다.
비동기면서 배치 형식으로 state 가 업데이트 되는 이유는 rendering 때문인데, state 가 배치가 아니라 바뀌는 즉시 변경이 된다면
지속적으로 화면이 렌더링되고 리소스 낭비와 구현 및 사용하는 사용자에게 혼란을 줄 수 있다.

단, 이 부분에서 scope 의 영향을 받는데, onclick 의 경우 return 당시 (즉 렌더링 시) count 에 대해 렌더링을 시도한다.
이럴 경우엔 count 가 배치로 처리가 되며 setCount 안에는 값을 받아서 함수로 처리를 하는 것을 배치로 실행하기에 배치로 돌아도
차례로 함수가 실행되기에 원하는대로 두번 실행되어 값이 두배로 증가하게 된다.

그러나 만약 리액트 외부에서 이벤트를 발생시킬 경우

```javascript
function onClick() {
  setCount(value => value + 1);
  setCount(value => value + 1);
}
console.log('rendered');

useEffect(() => {
  window.addEventListener('click', onClick);
  return () => window.removeEventListener('click', onClick);
});

return <>
  <button onClick={onClick}>증가</button>
</>
```

console.log 로 찍히는 게 두번 발생하고, 이는 곧 렌더링이 2회 호출된다는 것이다.

값 자체가 변경이 되는게 배치가 아니기에 1회 변경 후 다시 1회 변경되어 렌더링이 두번 실행되고 결과적으로 로그가 두번 찍히게 된다.

그러나 useEffect 를 지우게 되면 값은 2회 증가하지만 로그는 1회만 찍히는데, 이 경우가 배치로 실행됨을 알 수 있다.

#### batchedUpdates

다만 위와 같이 이벤트를 등록해도 강제로 배치처럼 수행하게 작동이 가능하다.

react-dom 내의 unstable_batchedUpdates() 라는 함수가 있는데, 이 값 안에서 실행을 하게 되면 
안에서는 배치 형식으로 작동하게 된다.

#### Effect Hook