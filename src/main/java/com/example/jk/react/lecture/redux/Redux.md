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

이를 위해 리덕스가 등장할 수 있다.

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