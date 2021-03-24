### useLayoutEffect

useEffect 의 layout 렌더링 버전이라고 생각하면 쉽다.

기존의 useEffect 의 경우 렌더링이 끝난 상태에서 작업을 진행하는 반면, useLayoutEffect 의 경우 렌더링 이전에 작업을 하게 된다.


```javascript
function useEffectComponent() {
  useEffect(() => {
    console.log('after rendering');
  });
}

function useLayoutEffectComponent() {
  useLayoutEffect(() => {
    console.log('before rendering');
  });
}
```

이렇게 했을 때 주의해야 하는 부분이 있는데, useLayoutEffect 사용 시 해당 과정을 모두 거친 후에야 렌더링이 진행된다.

그 말은 useLayoutEffect 에 과도한 로직이 추가된다면 전반적인 렌더링이 늦어지고 이에 따라 사용자는 해당 상황에 대해 버그처럼 인식하게
될 수 있다.

그렇다면 이렇게 안좋은 것 투성에, 실제로 useEffect 로 거의 대부분 대치가 가능한데 존재하는 이유가 뭘까?

useLayoutEffect 가 사용되는 부분은 렌더링 중 현재 값에 따라 다른 화면을 보여줄 떄 대표적으로 사용된다.

```javascript
function useLayoutEffectBenefit() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (width > 500) {
      setWidth(500);
    }
  });
  
  // ...
  <button onClick={() => setWidth(/*500 미만 로직*/)}>미만</button>
  <button onClick={() => setWidth(/*500 초과 로직*/)}>초과</button>
  // ...
}
```

위 컴포넌트에서 랜덤으로 500을 초과하는 로직이 있다고 가정해보자.

초과 버튼 클릭 시 500 초과의 값으로 렌더링이 진행될것이며, 렌더링 후 useEffect 를 통해 500으로 조정을 하게 된다.

만약 화면에 해당 witdh 를 이용해서 div 를 만든다면 초과 버튼을 클릭하면 항상 화면에 반짝이는 현상이 발견될 것 이다.

그러나 useEffect 부분을 단순히 useLayoutEffect 로만 변경해주면 화면이 변경되고 나서 다시 값을 바꿔 재렌더링되 반짝거리는 버그 현상은
없어진다.