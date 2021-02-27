### Hook

https://ko.reactjs.org/docs/hooks-intro.html

- State Hook
  
```javascript
class SomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {someState : 'SOME STATE'};
  }
  
  changeSomeState () {
    this.setState({someState : 'SOME STATE CHANGED'});
  }
  
  componentButton() {
    return <p>{this.state.someState}</p>
    <button onclick={changeSomeState}>변경</button>
  }

  ReactDOM.render(componentButton, document.getElementById('root'));
}

function SomeComponentByHook() {
  const [someState, setSomeState] = useState('SOME STATE');

  return <p>{someState}</p>
  <button onclick={setSomeState('SOME STATE CHANGED')}>변경</button>;
}
```

위 두 가지 케이스는 동일하게 사용이 가능하다. State Hook 의 가장 큰 장점은 class component 가 아님에도
state 에 대한 접근이 가능하다는 점 (사용, 초기화, 수정 등) 이다.

- Effect Hook
