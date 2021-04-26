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
