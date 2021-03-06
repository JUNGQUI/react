### ReactDOM

일반적으로 DOM 에 화면을 그리는 부분은 사용자에게 많은 리소스를 요구하게 된다.

그 이유는 화면 중 하나의 요소만 변경이 되었다 하더라도 극단적일 경우 전체 화면에 대해서 다시 그리는 현상이 발생 할 수 있기 떄문인데
화면이 빈번하게 변하는 브라우저에서 이러한 리소스 낭비를 막기 위해 리액트는 메모리단에 가상돔을 구성하고 이를 토대로 DOM 과 비교 후 실제 적용 여부 및
적용을 할 요소만 판단해서 변경한다.

그렇지만 이 중에서도 효율등의 문제가 발생 할 수 있다.

```javascript
function App() {
  const [second, setSecond] = useState(0);
  
  function tik() {
    useEffect(()  => {
      setTimeout(() => {
        setSecond(sec => sec + 1);
      }, 1000);
    });
  }
  
  return (
      <div key={second}>
        <p>제목입니다.</p>
        <p>{second} 초가 지났군요.</p>
      </div>
  );
}
```

1초마다 시간을 재는 간단한 component 이다. 겉으로 봤을때는 아무런 이상이 없는 것으로 보이나, 실제로 구동 시
div 전체가 삭제되었다가 다시 생성되는 것을 1초마다 반복하게 된다.

우리가 원한 바는 div 내의 p 에 innerHTML 만이 바뀌기를 예상했으나 실제로 이렇게 된 이유는 key 가 state 때 마다 바뀌기 때문인데
react key 가 매 초 바뀌기 때문에 리액트는 이 부분 전체가 `변경` 되었다고 판단하고 다시 렌더링 과정을 거치게 된다.

이렇게 된다면 리액트를 사용하는 의미가 퇴색되는데 그렇기에 활용 할 수 있는 방안이 여럿 있다.

1. 설계

당연하게도, 설계 측면에서부터 state 로 관리하는 부분이 어디서 어디까지인지, 전체 화면 중 변하는 부분과 변하지 않는 부분, 부분적으로 변하는 부분 등을
파악하고 고려하여 개발을 진행해야 한다.

위의 경우 사실 div 내의 key 값이 들어갈 이유 자체가 없고, 들어가더라도 키값은 변경 요청 대상의 유니크함을 명시해주면 되기 때문에 별도로 구성을 해도 된다.

2. React.memo

[여기](../state/State1.md)에서도 언급했듯이, 해당 메소드를 통해 컴포넌트를 export 하게 되면 정확하게 해당 요소에 속하는 state 가
변경이 되었을 경우에만 렌더링을 시도한다. 이를 통해 예상치 못했던 리소스 낭비를 막을 수 있다.