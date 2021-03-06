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

- Redux-saga

기본적인 틀은 thunks 와 비슷하다. 다른 점은 [generator](../es6/ES6.md) 를 사용하는 점이다.


```javascript
export default function* () {
  yield all([takeLeading(ACTION, FUNCTION)]);
}
```

- function* : Generator function 으로 return 으로 generator 를 반환한다.
- yield : 사가 미들웨어에 해당 effects 를 등록해준다. 이를 통해 미들웨어는 해당 effects 사용이 가능해진다.
- effect
 
  리덕스 사가의 부수효과, 각종 액션 및 상태값을 제어하는 등 작업을 진행시켜주는 함수들의 모음이다.

  보통 해야 할 일을 표현하는 자바스크립트 객체로 반환된다. 
  - put : 리덕스 사가에서 액션을 디스패치 하는 함수
  - call : 동기적으로 함수를 실행, 전달받은 파라미터는 함수, 동기적이기에 완료 전까지 실행이 멈춘다.
  - take : 원하는 액션이 들어올 때 까지 대기하고, 원하는 액션이 들어왔을 경우 실행한다.
  - takeLeading : 이전 액션에 대한 처리가 끝나기 전까지 이후 액션의 유입에 대해서는 막고 진행한다.
  - takeLatest : 이전 작업중인 액션을 취소시키고 가장 마지막에 유입된 액션에 대한 처리를 진행한다. 
  - all : 여러가지 정의된 리덕스 사가들을 combine 해주는 역할, 보통 root component 에서 받아와서 진행하기 위해 사용한다.


```javascript
import actions from 'action-list';

function* fetchData(action) {
  yield put(actions.SOME_ACTION1(action.SOME_STATE1));
  yield put(actions.SOME_ACTION2(action.SOME_STATE2));
  yield put(actions.setValue('error', ''));
  try {
    yield call(SOME_API_CALL());
  } catch (e) {
    yield put(actions.SOME_ACTION_RECOVER1(action.PREV_SOME_STATE1));
    yield put(actions.SOME_ACTION_RECOVER2(action.PREV_SOME_STATE2));
    yield put(actions.setValue('error', e));
  }
}
```

위와 같이 리덕스-사가를 이용해 특정 비동기 작업 진행 중 예외가 발생하더라도 해당 예외에 맞게 기존 fetch 된 데이터에 대한 변경도 가능하다.

- Throttle, Debounce

일부러 fetch 중 지연을 걸고 1회만 호출되게끔 하는 기법이다. 주로 짧은 시간 내에 같은 이벤트가 발생 할 경우 이런 방법을 쓰며
대표적인 예시로는 검색창의 자동 단어 완성 기능이다.

```javascript
export function* saga_throttle() {
  yield throttle(500, 'INPUT_CHANGED', handleInput)
}
```

위 throttle 은 0.5초간 `INPUT_CHANGED` 액션에 대해 지연을 거는데, 가장 처음에 접근한 액션에 대해서만 1회 호출한다.
즉 최초 접근 이후 0.5초동안 접근하는 `INPUT_CHANGED` 액션에 대해서는 디스패치 하지 않는다.

```javascript
export function* saga_debounce() {
  yield debounce(500, 'INPUT_CHANGED', handleInput);
}
```

거의 모든 조건은 동일하게 작동하는데, throttle 과는 다르게 가장 마지막에 입력된 action 에 대해 작업을 진행한다.

따라서 위의 경우 0.5 초간 대기하며 별도의 추가 `INPUT_CHANGED` 액션이 없다면 가장 마지막에 요청받은 액션을 통해 handleInput 이 실행된다.

- test

react-saga 의 경우 effects 함수가 리턴하는 값이 실행하는 '객체' 이므로 테스트하기가 간편하다.

```javascript
describe('test', () => {
  // ...
  const gen = cloneableGenerator(fetchData)(actions);           // 상태까지 복사 가능한 generator
  expect(gen.next().value).toEqual(put(actions.setLoading()));  // generator 의 첫번째 yield
  // ...
  it('success', () => {
    const successGen = gen.clone();
    expect(successGen().next(Promise.resolve()).value).toEqual(put(actions.SUCCESS())); // 성공 분기의 액션
  });
  it('fail', () => {
    const failGen = gen.clone();
    expect(failGen().throw(err).value).toEqual(put(actions.FAIL()));       // 실패 분기의 액션
  });
});
```

이와 같이 effects 함수들이 모두 객체를 반환하기에 실행하면서 실제 예측가능한 객체를 비교 대상군으로 뽑아서 equal 조건을 달아서
확인이 가능하다.