### 컴포넌트 작성 가이드

보통 어떻게 작성을 하는게 가장 편한지에 대한 설명이다.

```javascript
MyComponent.propTypes = {
  // ...
}

export default function MyComponent({props1, props2}) {
  // ...
}

const GLOBAL_STATE = [];
```

1. 컴포넌트의 이름을 지정해서 최상단에서 속성값을 사용 할 수 있다.
2. 함수형 컴포넌트에서 이름은 필수 (디버깅 시 힘들고 가독성이 떨어지니 `필수` 는 아니지만 꼭 준수할 것)
3. 명명된 매개변수 사용하기 (...(props) vs ...({props1, props2}))
4. 컴포넌트 외부에서 사용하는 값들에 대해서는 화면 최하단에 일괄 입력
5. 상태값들과 useEffect 를 모아두지 말고 logic 단위로 state - useEffect 느낌으로 모아라

```javascript
// ...
const [firstState, setFirstState] = useState(0);
const [secondState, setSecondState] = useState(0);

useEffect(() => {
  
});

useEffect(() => {

});
// ...
```

이렇게가 아닌

```javascript
// ...
const [firstState, setFirstState] = useState(0);
useEffect(() => {

});

const [secondState, setSecondState] = useState(0);
useEffect(() => {

});
// ...
```

이렇게 하는 것이 주석치기에도, 가독성 측면에도 효율적이다.

6. 너무 복잡한 로직의 경우 custom hook 으로 바꾸자.