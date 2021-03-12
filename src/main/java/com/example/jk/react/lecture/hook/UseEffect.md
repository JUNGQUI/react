#### Effect Hook

`Side Effect`, 부수 효과를 다루는 Hook 이다. 일반적으로 side effect 라고 하면 부작용이라고 생각하는 부분들이 있는데
정확하게는 `Negative Side Effect` 의 경우가 우리가 흔히 아는 '의도치 않은 변경으로 인한 부작용' 이고, side effect 자체는 부작용이라는
부정적인 이미지는 아니다.

리액트 내에서 부수 효과는 여러가지를 의미하는데 `외부에서 내부의 상태값 변경 시` 를 의미한다.

단적인 예로는 시간이 오래 걸리는 서버에 요청하여 값을 반환하는 작업이라고 가정해보자면, 서버에 요청 후 값을 가지고 올때 Hook 이 아닌 직접적으로 수행하는 부수 효과가 있다면
값을 가져온 순간 렌더링을 시도할 것이고 그럴 경우 렌더링을 할 때 마다 해당 부수 효과가 중복으로 실행되게 된다.

```javascript
function App() {
  const [count, setCount] = useState(0);
  
  console.log('rendered');
  
  return (
      <>
        <p>{count}</p>
        <button onClick={e => { setCount(v => v + 1); } }>증가</button>
      </>
  );
}
```

위 상황에서 log 를 찍는 부분이 서버를 호출해서 값을 가져오는 것이라 가정하고, onclick 시 이벤트가 값을 변경하면 리액트는
렌더링을 시도할 것이고 (값이 변경되었기에) 값 변경 후 렌더링 과정에서 위의 로그 부분이 Hook 처리가 안되었기에 자연스럽게 다시 호출이 될 것이다.

```javascript
import React, {useEffect, useState} from 'react';

export default function EffectHook() {
  const [countState, setCountState] = useState({count1 : 0, count2 : 0});

  console.log('렌더링 될 때마다 ㄷㄷㄷㅈ');
  useEffect(() => {
    console.log('count2 가 바뀔때만 ㄷㄷㄷㅈ');
  }, [countState.count2]);

  return (
      <>
        <p>{countState.count1}, {countState.count2}</p>
        <button onClick={e => {setCountState({...countState, count1 : countState.count1 + 1});}}>count 1 증가</button>
        <button onClick={e => {setCountState({...countState, count2 : countState.count2 + 1});}}>count 2 증가</button>
      </>
  );
}
```

하지만 useEffect 에 두번째 매개변수로 state 값을 주면 해당 값이 변경 될때만 useEffect 가 실행되어 내부 로직을 수행하게 된다.