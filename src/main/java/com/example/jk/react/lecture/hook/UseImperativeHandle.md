### useImperativeHandle

context API 가 상위 -> 하위 컴포넌트로의 값 계승이라면 useImerpativeHandle 은 하위 -> 상위 컴포넌트로의 값 공유다.

```javascript
function Profile() {
  const [age, setAge] = useState(0);
  const [name, setName] = useName('mike');

  useImperativeHandler(ref, () => ({
    addAge: value => setAge(value + age),
    getNameLength: () => name.length
  }));
  // ...
}

export default forwardRef(Profile);
```

```javascript
export default function App() {
  const profileRef = useRef();
  const onClick = () => {
    if (profileRef.current) {
      // ...
      profileRef.current.getNameLength();
      profileRef.current.addAge(/* ... */);
      // ...
    }
  };
  
  // ...
  return (
      <>
        <Profile ref={profileRef}/>
        // ...
      </>
  );
}
```

위 두 가지 코드 중 첫번째 코드의 경우 App 의 하위 컴포넌트로, 하위 컴포넌트에서 각각 `addAge` `getNameLength` 두가지 함수를
정의하였고 useImperativeHandle 을 통해 ref 에 해당 정의한 함수를 매핑해주었다.

이후 forwardRef 를 통해 매핑이 끝난 ref 를 상위 컴포넌트로 돌려주게 된다.