### useMemo

React.memo() 와 동일한 개념이다.

useMemo(Callback, Values...) 로 이루어져 있는데 뒤의 values 의 경우 의존성 배열로 useEffect 와 동일하게 해당 값의 변경이
감지 되면 실행된다는 뜻이고 콜백 의 경우 감지되어 useMemo 가 실행 될 때 실행하는 콜백함수를 의미한다.

```javascript
//...
const [v1, setV1] = useState(0);
const [v2, setV2] = useState(0);
const [v3, setV3] = useState(0);
const value = useMemo(() => runExpensionJob(v1, v2), [v1, v2])

return (
    <>
      // ...
      <button onClick={() => {
        setV1(Math.random()); 
        setV2(Math.random());
      }}>v1/v2 수정</button>
      <button onClick={() => setV3(Math.random())}>v3 수정</button>
    </>
);

//...

function runExpensionJob (v1, v2) {
  console.log('job executed');
  return v1 + v2;
}
```

위의 함수를 수행하면 `value` 의 경우 처음엔 0으로 출력이 될것이다. 초기엔 v1, v2 를 0으로 초기화 하고 이를 통해 값의 변경이 일어났으니
`runExpensionJob` 이 실행이 된다.

그러나 이후에 v3 를 수정을 했을 때 value 는 실행이 되지 않는다.

그 이유는 useMemo 를 통해 의존성 배열에 v1, v2 가 지정되어 있고 실제로 값의 변경이 일어난건 v3 이며 다시 렌더링이 되더라도
v1, v2 에 의존성이 걸려 있기 때문에 변경은 없으니 그 이전의 값으로 그대로 남아있고 실행이 되지 않는다.

