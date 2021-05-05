### React Redux

```javascript
import {Provider} from 'react-redux';
import store from '...';

export default function App() {
  <Provider store={store}>
    <SOME_COMPONENT_1/>
    <SOME_COMPONENT_2/>
  </Provider>
}
```

[앞서](./Redux.md) 이야기 했듯이 redux 는 Store 를 통해 많은 상태값을 Context API 없이 관리를 하는 것이다.

기본 골자는 `dispatch (action, state 전달) -> 선언된 reducer 에서 action 에 맞게 로직 수행 -> state 를 store 에 저장
-> store 에서 state 변화에 맞게 렌더링 요청` 으로 볼 수 있다.

기존의 Context API 를 이용하면 동일한 효과를 얻을 수 있으나 state 가 늘어남에 따라 늘어지는 코드 (context 생성),
각 Context react element 가 사실 같은 stack 에 존재해, 불필요한 렌더링 발생 등의 이슈가 있다.

이러한 부분들을 store 내에서 하나의 상태값처럼 여러 상태값을 관리 할 수 있어 redux 가 더 편리하다.

기존의 state 를 가져오고, 변경하는 부분에 대해서는 useEffect 를 통해서 변경을 진행했지만 redux 를 이용하면

- context -> store

```javascript
import {Provider} from 'react-redux';
import store from '...';

export default function App() {
  <Provider store={store}>
    <SOME_COMPONENT_1/>
    <SOME_COMPONENT_2/>
  </Provider>
}
```

이 부분은 바로 위에서도 언급했던 부분인데, react-redux 로부터 Provider 를 받아서 store 로 지정을 하면 하위의 `SOME_COMPONENT_1`,
`SOME_COMPONENT_2` 등의 컴포넌트에서도 `store.state.someState` 와 같은 형식으로 접근이 가능하다.

- state 가져오기 -> useSelector

기존에 state 를 가져오기 위해서 context 를 이용하면 context 에서, 그게 아니라면 컴포넌트 파라미터 형식으로 상태값을 가져와야 했다.

그렇게 가져온 상태값은 변경이 일어날 경우 렌더링이 일어나고 이는 다중 컴포넌트 환경에서 불필요한 렌더링으로 인한 리소스 소모로 이어졌다.

이렇게 가져오는 불편함에 대해서는 store 를 통해서 가져올 수 있지만 여전히 store 에 대한 접근으로 인해 불편함이 있다.

하지만 useSelector 훅을 이용해서 가져올 경우 이 부분이 해소 된다.

```javascript
// ...
const someObj = useSelector(state => state.some.someObj, shallowEqual);
// ...
```

`useSelector` 를 이용하면 첫번째 파라미터의 함수선언을 통해 해당 값이 useSelector 훅을 통해 리턴되고, 이는 곧 store...으로
접근해서 값을 가져오는 것과 동일하다.

또한, [이전에](./Redux.md) 말미에 작성하였듯이 redux 없이 사용 할 경우 불필요한 렌더링을 없애기 위해 얕은 비교를 통해 값을 가져오고
변화를 주었으나, useSelector 의 두번째 파라미터에 `shallowEqual` 을 통해 해당 부분을 해소 할 수 있다.

정확히는 해당 파라미터에는 `equalityFn?: (left: any, right: any) => boolean` 이러한 로직이 들어가는데, 쉽게 말해
이전과 이후의 값을 얕은 비교를 수행해서 변화가 없을 경우 리렌더링을 하지 않게 할당하지 않는다.

그리고 shallowEqual 의 경우 react-redux 내에 내장되어 있어 사용하기 간편한 얕은 비교 함수이다.

> useSelector 를 이용한 다량의 상태 값 로드
> 
> 당연하게도 여러가지 상태값을 가져올 경우 각각 useSelector 를 통해 할당 할 수 있다.
> ```javascript
> // ...
> const someObj1 = useSelector(state => state.some.someObj1);
> const someObj2 = useSelector(state => state.some.someObj2);
> // ...
> ```
> 
> 하지만 이와 같은 부분은 context API 와 redux 를 비교 할 때 이미 말했듯이 불필요하게 코드가 늘어난다.
>
> ```javascript
> // ...
> const [someObj1, someObj2] = useSelector(state => [state.some.someObj1, state.some.someObj2], shallowEqual);
> // 혹은
> const { someObj1, someObj2 } = useSelector(
>     state => ({
>       someObj1: state.some.someObj1,
>       someObj2: state.some.someObj2
>     }),
>     shallowEqual
> );
> ```
> 
> 이렇게 사용이 가능하다.

> tip
> 
> shallowEqual 을 사용할 때 마다 매번 입력해줘야 하기에
> 
> ```javascript
> // ...
> function myUseSelector(state) {
>   return useSelector(state => state.some.someObj1, shallowEqual);
> }
> // ...
> ```
> 
> 이와 같이 custom useSelector 훅을 만들어서 제공해주면 간단하게 사용이 가능하다.

- state 변경 -> dispatch 를 이용해 reducer 를 거쳐 store 에 저장

redux 가 아닐 경우 state 의 변경은 useEffect 내에서만 호출해서 변경했어야 했다. 그러나 redux 를 이용 할 경우 reducer 를 미리
선언해두고 dispatch 와 action, state 를 이용해 **간편하게, 어디에서든, useEffect 없이** 변경이 가능하다.

```javascript
const ADD = createAction('add')
const DELETE = createAction('delete')

export const addReducer = value => ({type: ADD, state: value});
export const deleteReducer = value => ({type: DELETE, state: value});

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

이와 같이 미리 reducer 를 먼저 생성해주고 (addReducer 에서 값 전달의 경우 `속성값을 전달한다` 고 하고 넘어가자)

```javascript
function App () {
  // ...
  store.dispatch(addReducuer(store.some.someObj1));
  // ...
}
```

이렇게 store.dispatch 를 통해 useEffect 없이 상태값에 대한 변경 로직 수행이 가능하다.

물론 이 부분도 훅을 이용해 이쁘게 변경이 가능한데,

```javascript
function App () {
  // ...
  // store.dispatch(addReducuer(store.some.someObj1));
  // 대신
  const dispatch = useDispatch();
  dispatch(addReducer(store.some.someObj1));
  // ...
}
```

이와 같이 useDispatch 훅을 이용해서 사용이 가능하다.

#### reselect

컴포넌트에서 객체를 사용 할 경우 전체 객체에 대해 접근을 하는 경우가 많다.

```javascript
// ...
function ChildComponent({someValue}) {
  // ...
  // use someValue for doing something
  // ...
}
```

그런데, `childComponent` 내에서 전체 데이터 중 일부만 사용해야 하는 조건이 걸렸다고 가정을 해보자.

filter 등을 이용하면 필요한 데이터만 사용할 수 있다. 그러나 그렇게 할 경우 컴포넌트에서 필요하지 않은 전체 데이터가 불러와지는 부분이 있다.

또한 filter 의 조건에 따라 미리 list 를 나눠서 상태값으로 관리를 한다면 문제가 되진 않지만, 실제로 그렇게 하더라도 중복으로 결정이 될 수 있는
조건이 있다면 list 자체에도 데이터 중복이 들어갈 수 있다.

예를 들어, 나이라는 조건이 붙고 8~19세 / 18세 이상 이라는 조건이 붙었다고 가정할 때 데이터에서 8~19 와 18세 이상에서는 중복으로 불려와지는 데이터가 존재하게 된다.

이 데이터들을 가공하였을 때 불필요하게 다른 조건에 중복되서 걸리는 데이터들이 수정되어 반대편 조건을 사용하는 컴포넌트에도 렌더링이 되는 등 리소스 낭비가 발생한다.

그리고 또 하나의 문제점은 렌더링 유무와 상관 없이 filter 를 사용하면 값의 변경 유무와 상관 없이 무조건적으로 실행하게 된다는 것이다.

```javascript
// ...
const someFilteredVaule = someValue.filter(item => item.SOME_PROPS <= 150);
// ...
```

위와 같은 코드가 컴포넌트 내에 내재되어 있다고 가정했을 때, someValue 나 SOME_PROPS 가 변경되지 않아도 해당 필터 작업은 진행이 된다는 것이다.


```javascript
import {createSelector} from 'reselect';

const getFriends = state => state.friend.friends;
export const getAgeLimit = state => state.friend.ageLimit;
export const getShowLimit = state => state.friend.showLimit;

export const getFriendWithAgeLimit = createSelector(
    [getFriends, getAgeLimit]
    , (friends, ageLimit) => friends.filter(item => item.age <= ageLimit)
);

export const getFriendWithShowAgeLimit = createSelector(
    [getFriendWithAgeLimit, getShowLimit]
    , (friendsWithAgeLimit, showLimit) => friendsWithAgeLimit.slice(0, showLimit)
);
```

`createSelector` 함수는 메모이제이션 기능이 있기 때문에 filter 등의 연산을 넣더라도 실제 반영되는 값이 변경되지 않으면 실행이 되지 않고, 이전에 연산했던 결과를 리턴한다.

따라서 앞서 말했듯 불필요한 연산을 피할 수 있다.

또한 이와 같이 구현을 할 때 약간의 팁이라 볼 수 있는것이, reselect 패키지를 이용해서 별도의 파일로 `연산` 과 관계된 모든 코드를 별도의 파일로 분리하여
구성을 한다면, 화면을 위한 컴포넌트와 로직의 컴포넌트가 분리되 가독성이나 유지보수성 측면에서 이점이 있다.

#### 팁

- 상수값 범용으로 리듀서 구현

상태값을 추가할때 변하지 않는 상수적인 값을 추가한다면 굳이 액션, 액션생성자까지 구현 할 필요 없이 리듀서, 액션을 범용적으로 구현해서 호출 후 사용하는 방식으로 간단히 추가 할 수 있다.

```javascript
// ...
export function createSetValueAction(type) {
  return (type, value) => ({type: type, value});
}

export function setValueReducer(state, action) {
  state[action.key] = action.value;
}
// ...
const SET_VALUE = 'COMPONENT/SET_VALUE';
export const setValue = createSetValueAction(SET_VALUE);

const reducer = createReducer(INITIAL_STATE, {
  // 이러한 액션들 대신
  // [SOME_ACTION1] : (state, action) => {state.someValue1 = action.someValue1},
  // [SOME_ACTION2] : (state, action) => {state.someValue2 = action.someValue2},
  // [SOME_ACTION3] : (state, action) => {state.someValue3 = action.someValue3},
  // 이렇게 하나로 관리
  [SET_VALUE] : setValueReducer,
  // ...
});
// ...
```

일일이 하나씩 action, action creator 를 만들어 주는 대신 setValue 형식으로 하나의 액션에서 상수 값들에 대한 변경이 가능해진다.

- 액션 크리에이터를 모아서 사용

```javascript
// ...
export const actions = {
  addFriend : friend => ({type : ADD, friend}),
  removeFriend : friend => ({type : REMOVE, friend}),
  editFriend : friend => ({type : EDIT, friend}),
  setValue : createSetValueAction(SET_VALUE)
}
```

하나 하나씩을 밖으로 export 하는 것 보단 관리하기 편하게 action 객체 하나를 생성하고 거기에서 필요한 액션을 추출해서 사용하는 것이
가독성측면에서도, 유지보수성 측면에서도 보기 편하다.