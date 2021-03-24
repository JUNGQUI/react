### useReducer

여러 상태 값을 제어하기 위해서 useReducer 를 이용해서 값을 관리하는 것이 편리하다.

```javascript
export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
      <>
        // ...
        <input type="text" onChange={e => dispatch({type : 'setName', name : e.currentTarget.value})}></input>
        // ...
      </>
  );
}

const INITIAL_STATE = {name: 'init name', age: 0};
function reducer(state, action) {
  switch(action.type) {
    case 'setName':
      return {...state, name: action.name}
    case 'setAge':
      if (action.age > MAX_AGE) {
        return {...state, age: MAX_AGE};
      } else {
        return {...state, age: action.age};
      }
  }
}
```

전달되는 reducer 를 통해서 dispatch 에 접근이 가능하고 dispatch 를 통해서 state 에 대한 제어가 가능하다.

> store, action, reducer, dispatch
> 
> redux 에서 나오는 개념이다. 간단하게 설명을 하자면
> 
> - store : state 를 저장하고 있는 곳, reducer 를 통해서만 state 의 값 변경이 발생한다.
> - reducer : 전달받은 action 에 따라 로직을 수행해 store 에 있는 state 를 수정한다.
> - action : 컴포넌트 수준에서 state 에 대해 수행되어야 할 일종의 `명령어` 다.
> - dispatch : action 을 reducer 에 전달하는 역할을 수행한다.

코드에서 초기에 state, dispatch 를 선언하고 해당 값들에 useReducer 를 이용해서 state 에는 초기 값 INITIAL_STATE 를, 
dispatch 에는 reducer function 을 리턴한다.

후에 이벤트 발생 시 이벤트에 dispatch 를 등록해주고 dispatch 는 이벤트가 발생함에 따라 매핑되어 있는 reducer 에 action, state 를
전달하게 된다.

이후 reducer 에서는 전달받은 action 에 맞게 state 를 변형하고 return state 를 통해서 state 에 값을 변경하게 된다.

dispatch 에 입력받는 파라미터는 항상 객체 형식이며, 이 객체 형식을 action 을 통해서 접근, 사용이 가능하다.

위의 로직에서 개발자의 입김(?) 이 들어간 부분은 state 설정과 dispatch 를 통해 전달되는 action 뿐이며 그 말인 즉슨,
action.KEY 의 경우 개발자의 커스텀 부분이라는 뜻이다.

### with context API

dispatch 는 함수 형식을 띄고 이를 통해 state 를 관리하기에 context API 와 같이 사용하면 하위 컴포넌트들에도 별도의
값 전달 없이 사용이 가능하다.

```javascript
const ProfileContext = useContext();

// ...

const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

return (
    <>
      // ...
      <ProfileContext.Provider value={dispatch}>
        <SOME_COMPONENT />
      </ProfileContext.Provider>
      // ...
    </>
);
// ...
```

위 코드처럼 dispatch 자체를 context API 를 통해 제공한다면 하위의 (혹은 n depth 의 컴포넌트) 에서도 상위 (혹은 root) 컴포넌트에서
사용하던 reducer 를 그대로 사용이 가능하다.