### Context API

useState 를 이용하면 state value 를 설정할 수 있는데, 만약 여러 depth 구조를 가진 컴포넌트를 작성 할 경우
상위 depth 에선 1도 사용하지 않는 값을 하위 depth 로 내려주기 위해 계속 신경을 써주는 구조가 나오게 된다.

```javascript
import React, {useState, useContext, createContext} from 'react';

export default function NonContext() {
  const [username, setUserName] = useState('mike');
  const [age, setAge] = useState(23);
  const [count, setCount] = useState(0);

  console.log('rendered');
  return (
      <>
        <LocalProfile username={username} />
        <button onClick={() => setCount(count + 1)}>증가</button>
      </>
  );
}

function LocalProfile({username}) {
  console.log('Profile rendered');
  return (<div>
    <Greeting username={username} />
  </div>);
}

function Greeting({username}) {
  console.log('Greeting rendered');
  return <p>{`${username}, 안녕!`}</p>;
}
```

위 코드에서는 NonContext - LocalProfile - Greeting 순으로 진행이 되는데 Greeting 컴포넌트에서 사용하고자 LocalProfile 컴포넌트에서는
사용하지도 않는 값을 전달을 위해 사용을 하고 있다.

이렇게 할 경우

1. 코드 가독성
2. 최적화 불가능
    - React.memo 최적화를 해도 LocalProfile 에선 결과적으로 username 을 받고 있기 때문에 새로 렌더링을 해 최적화를 못한다.

이러한 단점으로 인해 context API 가 존재한다.

```javascript
import React, {useState, useContext, createContext} from 'react';

// 이와 같이 2가지로 나눠서 context 사용이 가능하다. 하지만 번거롭기에
const NameContext = createContext('unknown');
const AgeContext = createContext(0);

// context 에서 이렇게 합쳐서 사용이 가능하다. value 에 들어가는 prop 이름은 user
const UserContext = createContext({username : 'unknown', age : 0});

export default function Context() {
  // const [username, setUserName] = useState('mike');
  // const [age, setAge] = useState(23);
  // const [count, setCount] = useState(0);
  
  const [user, setUser] = useState({username : 'mike', age : 23});
  const [count, setCount] = useState(0);
  console.log('rendered');
  return (
      // 2가지 context 로 만들 경우
      // <NameContext.Provider value={username}>
      //   <AgeContext.provider value={age}>
      //     // ...
      //   </AgeContext.provider>
      // </NameContext.Provider>
      
      <UserContext.Provider value={user}>
        <LocalProfile />
        <button onClick={() => setCount(count + 1)}>증가</button>
      </UserContext.Provider>
  );
}

const LocalProfile = React.memo(function () {
  console.log('Profile rendered');
  return (<div>
    <Greeting />
  </div>);
});

function Greeting() {
  console.log('Greeting rendered');
  const {username} = useContext(UserContext);
  return <p>{`${username}, 안녕!`}</p>;
}
```

위와 같이 코드를 구현하면 동일한 결과를 Greeting 컴포넌트는 단 한번도 호출이 되지 않는다.

> {} 를 통해 전달 시 주의점
> 
> 의존성 배열에 값을 전달 하거나 파라미터로써 전달 할 경우 {} 로 감싸서 전달하는 경우와 그렇지 않은 경우가 있다. 간단하게 설명하자면
> {} 감싸서 전달 할 경우 매번 새로운 객체를 생성해서 전달해주는 형식을 띄게 되며, 이를 통해 전달될 경우 새로 생긴 값으로 추정하여 렌더링 시
> 참고하는 부분이 된다.
> 
> 즉, {} 로 전달 할 경우 이전과 동일한 값을 가지고 있더라도 새롭게 렌더링 대상으로 취급하게 된다.
> 
> 위에서 언급했던 NonContext 컴포넌트를 다시 보자
>
> ```javascript
> import React, {useState, useContext, createContext} from 'react';
> 
> export default function NonContext() {
>   const [username, setUserName] = useState('mike');
>   const [age, setAge] = useState(23);
>   const [count, setCount] = useState(0);
> 
>   console.log('rendered');
>   return (
>       <>
>         <LocalProfile username={username} />
>         <button onClick={() => setCount(count + 1)}>증가</button>
>       </>
>   );
> }
> 
> function LocalProfile({username}) { // username 을 새 변수로써 받아옴
>   console.log('Profile rendered');
>   return (<div>
>     <Greeting username={username} />
>   </div>);
> }
> 
> function Greeting({username}) { // 위와 마찬가지로 새 변수로써 받아옴
>   console.log('Greeting rendered');
>   return <p>{`${username}, 안녕!`}</p>;
> }
> ```
> 
> 해당 부분은 `username` 을 실제로 쓰지 않는 LocalProfile 컴포넌트 아래에 실제로 `username` 을 실제로 쓰는 Greeting 컴포넌트로 인해 
> 값을 전달하고 있다.
> 
> 이로 인해 불필요하게 LocalProfile 도 렌더링이 되고 있는데 이와 같이 {}를 이용해서 전달한다면 실제 username 이 바뀌지 않더라도
> 상위 컴포넌트가 변경될 경우 {} 로 인해 새로운 '객체' 가 생성이 된다.
> 
> 리액트에서는 이를 `변경` 으로 감지해서 하위 컴포넌트들 모두를 다시 렌더링하게 된다.

Context 의 원리는 하위에서 값이 바뀌었을 경우 상위로 Context 를 찾을 때 까지 쭉 올라가면서 검색을 하게 되고
결과적으로 못찾게 된다면 `const UserContext = createContext({username : 'unknown', age : 0});` 이와 같이
초기값을 가져와서 렌더링하게 된다.

또한 위에서 언급하였듯이 변경으로 인한 re-rendering 이 실제로 사용하지 않는 컴포넌트에서는 값의 전달이 없으므로 렌더링 대상에 포함되지 않는다.