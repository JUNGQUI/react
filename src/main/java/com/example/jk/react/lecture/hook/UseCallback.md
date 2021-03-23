### useCallback

useMemo 와 마찬가지로 memoization 을 이용하는 훅이다. 다른 점은 useMemo 의 경우 결과에 대한 값을 return 하지만
useCallback 은 말 그대로 callback 함수 자체를 return 하기 때문에 함수로써 사용이 가능하다.

```javascript
const [name, setName] = useState('default');
const [age, setAge] = useState(0);
const onSave = useCallback(() => saveToServer(name, age), [name, age]);

// ...
<button onClick={onSave}></button>
// ...

function saveToServer(name, age) {}
```

당연하게도 onClick 과 같은 이벤트에 함수를 직접 실행하게 되면 렌더링이 될 때 `새로운 함수` 가 들어가진 것으로 보여지기 떄문에
렌더링 대상으로 포함하게 되고 최적화에 영향을 주게 된다.

