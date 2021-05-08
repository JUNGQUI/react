### Redux 비동기 라이브러리

- Redux-thunk

들어가기에 앞서, 이전에 미들웨어를 통해 액션이 디스패치 된 후 리듀서로 전달되기 이전에 비동기 작업을 처리하는 등의 작업을 진행한다고 작성한적이 있는데
그 부분이 Redux-thunk, Redux-saga 등의 라이브러리가 진행시켜준다.

가장 보편적인 라이브러리로, 객체가 아닌 함수 형태의 액션을 리턴해서 추후 사용 할 수 있게 해주는 미들웨어다.

```javascript
// 더하는 로직
const addOne = x => x + 1;
// 즉시 실행
addOne(1);

// thunk 로 감싸서 실행
function addOneThunk(x) {
  const thunk = () => addOne(x);
  return thunk;
}

const fn = addOneThunk(1);
setTimeout(() => {
  const value = fn();
  console.log(value);
}, 1000);
```

위와 같이 thunk 는 작업 즉, 함수를 감싸서 나중에 작업을 진행 할 수 있게 함수를 변수처럼 사용하는 것을 의미한다.

실제로 react-thunk 는 아래와 같이 사용이 가능하다.

```javascript
const someFn = () => async dispatch => {
  dispatch({...});  // real action

  try {
    const SOME_STATES = await someAPI.getPost(); // API 호출
    dispatch({ type: SOME_ACTION_1, ...SOME_STATE }); // 성공
  } catch (e) {
    dispatch({ type: SOME_ACTION_2, error: e }); // 실패
  }
}

const reducer = createReducer(INITIAL_STATE, {
  // 이렇게 하나로 관리
  [SET_VALUE] : setValueReducer,
  // ...
});

// 실제 컴포넌트
export default function App() {
  // ...
  useEffect(() => {
    someFn();
  }, [someFn])
  // ... 이후 dispatch 및 action 진행
}
```

위 코드는 useEffect를 통해 thunk 로 감싸진 `someFn` 를 통해 통신을 먼저 진행하고(비동기 진행 시 async, await 추가), 이후 
로직에 대해 리듀서를 진행하는 코드이다.

thunk 내에서도 dispatch, getState 를 파라미터로 받을 수 있고 이를 통해 상태값 변경 등 작업도 가능하기에 이처럼 하나의 함수로 감싸서
기존 flow 와는 다르게 새롭게 로직을 수행하는 것을 react-thunk 라고 볼 수 있다.

- Redux-Observable

RxJS 기반으로 만들어진 비동기 처리 미들웨어로 Rx 즉, 리액티브 프로그래밍 기반이기에 진입장벽이 높다.

TODO 추후 진행

- Redux-saga

기본적인 틀은 thunks 와 비슷하다. 다른 점은 generator 를 사용하는 점이다.

> generator?
> 
> 

```javascript
export default function* () {
  yield all([takeLeading(ACTION, FUNCTION)]);
}
```

- function*
- yield
- takeLeading
- effect
  - put
  - call
  - all
