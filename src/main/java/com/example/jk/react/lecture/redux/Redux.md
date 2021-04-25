### redux

- 컴포넌트 내에서 진행하던 상태 관리를 끌어올 수 있다.
- 로컬 스토리지 활용도 상승
- 서버 사이드 렌더링 (서버로부터 전달받는 값들의 변화로 인한 렌더링) 시 간단하게 패키징/언패키징이 가능
- Context API 와 동일한 기능을 Context API 보다 더 쉽고 간편하게 사용 가능

```javascript
import React, {useContext, createContext, useReducer} from "react";

const AppContext = createContext({});
const DispatchContext = createContext(() => {});

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  
  return (
      <div>
        <AppContext.Provider value={state}>
          <DispatchContext value={dispatch}>
            <User/>
            <Product/>
          </DispatchContext>
        </AppContext.Provider>
      </div>
  );
}

const INITIAL_STATE = {
  user: {name : 'mike'},
  product: {name : 'iPhone'}
};

function reducer (state, action) {
  switch (action.type) {
    case 'setUserName':
      return {...state.user, name:action.name}
  }
}

function User() {
  console.log('user redner');
  const {user} = useContext(AppContext);
  const dispatch = useContext(DispatchContext);
  
  return <div>
    <p>{`${user.name} 님 안녕하세요.`}</p>
    <button onClick={() => dispatch({type: 'setUserName', name:'john'})} >
      사용자 이름 수정
    </button>
    </div>
}

function Product() {
  console.log('production render');
  const {product} = useContext(AppContext);
  
  return <p>
    {`제품명 : ${product.name}`}
  </p>;
}
```

위와 같은 코드는 이상이 없어보이지만 User 컴포넌트에서 Dispatch 를 이용해 상태값을 변경하게 되면
Product 컴포넌트에서도 이 상태값의 변경을 감지, 전체 컴포넌트가 렌더링이 되는 이슈가 있다.

이 부분을 물론, 각자가 별도로 렌더링되게 구현이 가능하다. 가장 간편한 예로 각 컴포넌트에서만 사용하는 상태값을 각 Context API 로 관리하게
만들면 서로가 서로의 상태값 변경 감지를 하지 않아 렌더링 이슈는 사라진다.

하지만 그렇게 할 경우 코드가 굉장히 길어지며, 만약 해당 상태값 객체에 계속 요소가 추가된다면 가독성에도 문제가 발생하고
리액트 트리 구조도 불필요하게 커진다.

이를 위해 redux 가 활용될 수 있다.

쉽게 이야기 하자면, Context API 도, redux 도 기존의 컴포넌트들에서 여기저기 쓰이던 useState 를 통한 상태값 변경에 대해 
일괄적으로 한 곳에서 상태값에 대해 변경 할 수 있다는 것이고, 이는 곧 관리 포인트가 적어진다는 것이고 가독성 및 데이터 자체의 무결성 등에 영향을 미친다.

다만 Context API 는 필요에 따라 n 개의 리액트 엘리먼트 및 context 가 필요하지만 redux 의 경우 하나의 Provider 로 여러 state 를 동시에 관리가 가능하며
이를 통해 불필요한 렌더링 또한 막아주기에 resource 차원에서도 이점이 있다.

```javascript
import React from 'react';
import {createStore} from 'redux';
import {Provider, useSelector, useDispatch} from 'react-redux';

export default function App() {
  return (
      <Provider store={store}>
        <User/>
        <Product/>
      </Provider>
  )
}

const INITIAL_STATE = {
  user: {name : 'mike'},
  product: {name : 'iPhone'}
};

function reducer (state, action) {
  switch (action.type) {
    case 'setUserName':
      return {...state.user, name:action.name}
  }
}
const store = createStore(reducer);

function User() {
  console.log('user redner');
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  return <div>
    <p>{`${user.name} 님 안녕하세요.`}</p>
    <button onClick={() => dispatch({type: 'setUserName', name:'john'})} >
      사용자 이름 수정
    </button>
  </div>
}

function Product() {
  console.log('production render');
  const product = useSelector(state => state.product);

  return <p>
    {`제품명 : ${product.name}`}
  </p>;
}
```

변경된 부분은 총 3 부분이다.

const store = createStore(reducer) : reducer 를 store 에 지정, redux Provider 가 해당 store 를 사용
const user = useSelector(state => state.user) : user를 Context 로 state 에서 가져오던 부분이 selector 를 통해서 딱 원하는 상태값만을 가져옴
const dispatch = useDispatch() : store 로 지정된 dispatch 를 호출

쉽게 생각해보면 모든 상태값에 대해 하나로 통합, 관리하고 호출 시 렌더링에 방해되지 않게 골라서 사용이 가능한 Context API 라고 보면 된다.


#### 구조

1. 액션
2. 미들웨어
3. 리듀서
4. 스토어
5. 뷰

#### 액션

useReducer 를 이용해서 구현 할 때 초기값과 dispatch 에 개발자가 정의한 reduce 함수가 들어가고 파라미터로 '액션' 을 받는다.

이떄의 액션이 리덕스에서도 동일하게 적용된다. 위의 코드를 다시 보자.

```javascript
// ...
function reducer (state, action) {
  switch (action.type) {
    case 'setUserName':
      return {...state.user, name:action.name}
  }
}
// ...
<button onClick={() => dispatch({type: 'setUserName', name:'john'})} >
// ...
```

정의된 reducer 함수는 action 을 받고, 받은 action 으로 내부에서 정의된 바에 따라 별도의 행동을 취하게 된다.

action 에는 type 속성을 기본적으로 가지고 있고, 별도의 속성값은 개발자가 주어지는데로 적용이 가능하다.
(위의 action.name 과 같이)

보면 action 의 type 은 유니크한 값이 되어야 하므로 보통 생성자(action creator)를 만들어서 구현을 한다.

```javascript
// ...
const typeAdd : 'add';
const typeDelete : 'delete';

function addAction(id, score) {
  return {type: typeAdd, id : id, score : score};
}

function deleteAction(id) {
  return {type: typeDelete, id : id};
}
// ...
```

이와 같이 구현을 해야 오탈자등으로 인한 type 의 유니크함이 깨지지 않는다.
물론 creator 의 type 자체를 상수로 적용해서 사용하는게 가장 좋다.

#### 미들웨어

말 그대로 중간에 위치한 software 라는 느낌이 있는데, 여기서 중간은 action, dispatch -> reducer 사이의 중간이다.

이렇게 중간에 끼어서 무엇을 하냐면, 예를 들어 리듀서로 무조건 전달하는 것이 아닌 전달 직전 로그를 찍는다던지, 타입에 따라 굳이 리듀서로
전달하지 않고 다른 작업을 진행한다던지 와 같은 작업을 진행 할 수 있고, 상황에 따라 reducer 이후의 작업도 가능하다.

```javascript
const MyMiddleware = store => next => action => next(action);
```

일반적으로 미들웨어는 위와 같이 표현을 하는데, store 를 이용하기 위해 store 를 받고, next 의 경우 다음 작업이 있을 경우
마치 재귀처럼 다음 함수로 접근하여 로직을 처리한다.

```javascript
const middle1 = store => next => action => {
  console.log('middle 1 start');
  const result = next(action);
  console.log('middle 1 end');
  return result;
}

const middle2 = store => next => action => {
  console.log('middle 2 start');
  const result = next(action);
  console.log('middle 2 end');
  return result;
}

const reducer = (state, action) => {
  console.log('reducer');
  return state;
}

const store = createStore(reducer, applyMiddleware(middle1, middle2));
store.dispatch({type: 'someType'});
// ...
```

위의 로직을 해석하자면 먼저 렌더링 후 reducer 가 1회 호출 된다.

이후 store.dispatch 를 통해 action -> ... -> store 까지의 라이프 사이클이 진행되는데, 전달 전

`middle 1 start - middle 2 start - reducer - middle 2 end - middle 1 end`

와 같은 순서로 진행된다.

`applyMiddleware` 로 인해 미들웨어가 호출되고 연결되어 있는 middle2 로 인해 middle1 내 next 호출 시 middle2 가 호출된다.

이후에 결과를 전달 받고 middle2 end 출력 이후 middle1 으로 돌아오고 다시 middle 1 도 종료되면서 마무리 된다.

```javascript
const delayMiddleware = store => next => action => {
  if (action.meta?.delay) {
    return next(action);
  }
  
  const timer = setTimeout(next(action), delay);
  return function cancel() {
    clearTimeout(timer);
  }
}
```

또한 위와 같이 delay 를 주고, 결과값으로 해당 timeout 을 없애는 함수를 전달하고 있는데, 이렇게 구성할 경우

```javascript
// ...
const cancle = store.dispatch({...});
cancel(); // return 으로 cancel '함수' 를 받았기 때문에 전달받은 값을 실행 시 clearTimeout 실행
// ...
```

이와 같이 사용도 가능하다.

> action.meta?.delay
> 
> 최근에 추가된 javascript 표준인데, optional chaining 이라고 한다.
> 
> 짐작가능하듯이 말 그대로 해당 값의 체이닝을 optional 하게 적용한다는 것으로 값이 유의미할때(undefined 등이 아닐 떄) 비로소 값이
> 있다고 판단하고 체이닝을 하고, 아닐 경우 null 로 값이 들어가게 된다.
> 
> 따라서 위의 if(action.meta?delay) 의 경우 meta 가 있을경우 delay 를 가져와보고 delay 가 없거나 meata 가 없을 경우 실행이 되지 않는다.

#### 리듀서

앞서 이야기 했듯이 리덕스에서 상태값에 대해 일괄적으로 관리가 가능하다고 했는데, 리듀서가 바로 이 로직의 핵심 부분을 담당한다.

정확히 말하자면, 리덕스의 경우 리액트에서 유래되었으나 리액트에서만 쓸 수 있는 것은 아니다.

순수 자바스크립트 내에서도 리듀서를 이용해서 변수등을 일괄 관리 할 수 있다. 다만 리액트에서부터 유래되었기에 리덕스와 궁합이 굉장히 좋다.

```javascript
import produce from 'immer';

const ADD = "customReducerAdd";
const DELETE = "customReducerDelete";

function customReducer(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ADD:
        // draft.user.push(SOME_USER);
        // draft.users[0].name = 'OTHER NAME';
      case DELETE:
        // ...
    }
  })
}
```

위의 `customReducer` 가 리듀서 역할을 수행하는 함수인데, 파라미터로 두 가지를 받는다.

첫번째 파라미터는 현재 적용이 될 state, 두번째 파라미터는 리듀서 가 수행할 action 이다.

action 에는 기본적으로 type 이 속성값으로 존재하며 이 action 을 통해 리듀서 내부 로직에서 액션에 따라 수행을 진행하면 된다.

> produce?
> 
> immer 패키지의 produce 는 불변객체로 관리하는 reducer 에서 불편한 부분을 개선하기 위해 사용하는 패키지이다.
> 
> 기본적인 활용법은 리듀서 내에 produce 로 한번 더 함수로 감싸서 그 내부에서 state 변경에 대해 처리하는 것인데, 그렇다면 그냥 리듀서와 다른점이
> 무엇이냐면, 불변 객체에 대한 처리 방법이다.
> 
> ```javascript
> const someState = {
>   user : {
>     name : 'mike',
>     age : 25
>   },
>   product : 'iPhone'
> }
> ```
> 
> 위와 같은 구조가 있고 이를 리듀서를 이용해 수정을 한다고 가정을 하면 일반적으로 불변객체로 존재해야 하기에 name 을 수정하더라도
> `{...someState, user.name : 'mike2'}` 와 같이 불편하게 하나 하나 지정을 해야 한다.
> 
> 그러나 produce 를 이용하면 `draft.user.name = 'mike2'` 와 같이 변경하고자 하는 state 만 수정해도 이전과 같이 불변객체로
> 사용이 가능하다.

> 주의
>
> 리듀서 내부에서 랜덤 함수, 타이머 등을 이용해서 상시 변화가 가능한 값이나, 리듀서 내에서 서버 호출을 통해 값이 바뀔 수 있는 것에 대해서는
> 변화가 없게 개발해야 한다.
> 
> 내부에서 어떤 요인에 의해 값이 항상 다르게 바뀐다면 시점과 연결되어 있는 리듀서 특성상 치명적으로 다가온다.
> 
> 그렇기에 리듀서는 순수 함수로써 작동해야 한다.
> 
> 또한 값을 변경할때도 주의를 해야 하는데, 하나의 객체를 선택하고 그 객체 안의 속성값을 변경할 때 정상적으로 변경이 되지 않을 수 있다.
> 
> 그 이유는 객체를 변경하고 그 안에 속성값을 변경 시 변경 시점에서 바라보고 있는 객체는 이전 객체의 레퍼런스 일 수 있기 떄문이다.
> 
> 따라서 객체를 바꾸고 그 안의 속성도 바꾼다고 할 떄는 레퍼런스 값을 전달해서 제어를 하는 것이 좋다.

사실 조금 더 간편하게 사용이 가능한 방법이 있다.

```javascript
const ADD = "customReducerAdd";
const DELETE = "customReducerDelete";

const customReducer = createReducer(INITIAL_STATE, {
  [ADD] : (state, action) => {
    // draft.user.push(SOME_USER);
    // draft.users[0].name = 'OTHER NAME';
  },
  [DELETE] : (state, action) => {
    // ...
  },
})
```

바로 `createReducer` 를 이용하는 것이다. 리덕스에서 사용이 가능한 reducer 제공 함수로 첫번째 파라미터에 state, 두번째 파라미터에
action 에 따른 switch 를 대신해서 지정을 하면 자연스럽게 위에서 사용했던 리듀서와 동일하게 사용이 가능하다.

참고 : [여기](https://redux-toolkit.js.org/api/createReducer)

#### Store

말 그대로 저장소의 의미를 가지는데, 작업이 끝난 리듀서가 전달해준 state 를 저장하는 역할을 수행한다.

또한 앞서 이야기 한 미들웨어와 리듀서를 연결해주는 역할도 하며 subscribe() 를 이용해서 디스패치를 통해 실행된 리듀서 이후 로직에 대해
수행도 가능하다.

위에서 작성한 함수를 보면

```javascript
// ...
export default function App() {
  return (
      <Provider store={store}>
        <User/>
        <Product/>
      </Provider>
  )
}
// ...
function reducer (state, action) {
  switch (action.type) {
    case 'setUserName':
      return {...state.user, name:action.name}
  }
}
const store = createStore(reducer);
// ...
```

리듀서를 정의하고 createStore 를 통해 리듀서와 연결해준다. 이후 Provider 리액트 엘리먼트를 통해 store 가 실행되고 디스패치를 통해(store.dispatch({type: ...}))
전달되는 action 에 따라 리듀서가 실행된다.

이렇게 저장되는 state 에 대해서 Provider 리액트 엘리먼트 안의 컴포넌트는 store 를 통해 접근이 가능하고 사용하게 된다.

```javascript
// ...
let prevState;
store.subscribe(() => {
  const state = store.getState();
  if (prevState !== state) {
    console.log('diff');
  } else {
    console.log('same');
  }
  prevState = state;
})
// ...
```

위와 같이 사용을 하면 리듀서 진행 후 값에 대해 접근하여 후처리가 가능하다.

#### 리덕스 없이 리덕스 구현하기
```javascript
const ADD = "customReducerAdd";
const DELETE = "customReducerDelete";

export const addAction = state => ({type : ADD, state});
export const deleteAction = state => ({type : ADD, state});

export const customReducer = createReducer(INITIAL_STATE, {
  [ADD] : (state, action) => {
    // draft.user.push(SOME_USER);
    // draft.users[0].name = 'OTHER NAME';
  },
  [DELETE] : (state, action) => {
    // ...
  },
})
```

```javascript
import addAction from '...';

function SomeComponent() {
  const [state, setState] = useState(0);
  // ...
  store.dispatch(addAction(state));
  // ...
}
```

위와 같은 방식의 컴포넌트가 있다고 가정해보자. (리듀서로 불러와서 매핑은 끝났다고 가정)

위 상황에서 state 를 업데이트를 하면 SomeComponent 의 경우 state 가 바뀌었기에 항상 렌더링이 될 것이다. 하지만 이 컴포넌트가
단독으로 쓰이는 것이 아니고, state 에 위에서 언급한 부분외 별도의 상태값이 존재 할 경우 실제 state 의 변경과는 관계 없이 항상 렌더링이 될 것이다.

이를 방지하기 위해 

```javascript
  // ...
  const prevState = state;
  store.dispatch(() => {
    let state = state;
    if (prevState !== state) {
      addAction(state);
    }
  });
  // ...
```

위와 같이 실제 state 의 변경이 일어났는지를 확인하는 코드 작성이 필요하다.

TODO

- [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- 실제 리액트-리덕스의 경우 위와 같은 경우를 어떻게 해결하는지 추가