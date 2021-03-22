### Ref

Reference 의 준말로 state 를 통한 값의 제어 뿐 아니라 DOM element 에 대한 접근 및 기타 값으로 명시하지 못하는 다른 부분에 대해서
핸들링 하기 위해 사용한다.

- 포커스, 텍스트 선택영역, 혹은 미디어의 재생을 관리할 때.
- 애니메이션을 직접적으로 실행시킬 때.
- 서드 파티 DOM 라이브러리를 React 와 같이 사용할 때.

[리액트 공식 홈페이지](https://ko.reactjs.org/docs/refs-and-the-dom.html) 에서는 위와 같이 설명을 하고 있는데, 공통점은
state 와 같은 value 가 아닌 그 외의 것들에 대한 제어 및 값 활용에서 쓰이는 것을 알 수 있다.

```javascript
import React, {useRef, useEffect} from 'react';

export default function RefElement() {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, [])

  return (
      <div>
        <input type="text" ref={inputRef} />
        <button>저장</button>
      </div>
  );
}
```

위의 javascript 파일을 보면 input element 에 ref 로 inputRef 를 할당해서 사용하고 있고 해당 inputRef 의 경우 useRef 를 이용해서 생성하고
useEffect 내에서 ref 를 사용하고 있다.

코드를 하나씩 보자면,

```
inputRef.current    // input DOM element 선택
.focus()            // 선택된 input 에 focus event 발생
```

이와 같이 state 로만 접근하는게 아닌 DOM 의 element 에 대한 이벤트, 값 변경 등을 이용 할 때 이와 같이 사용이 가능한게 Ref 이다.

ref 의 경우 Life Cycle 내에서 활용이 되어야 하는데 ref 자체가 html DOM 의 객체에 대해 접근하여 어떠한 작업을 진행하는 것이기에 렌더링 이후에 진행이 될 수 밖에 없고
그로 인해 useEffect 내에서 사용을 한다.

#### useRef

이렇게 유용한(?) ref 또한 hook 으로 제공이 된다. 아래의 예시를 보자.

```javascript
import React, {useState, useCallback} from 'react';

export default function RefElement2() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [showText, setShowText] = useState(true);

  return (
      <>
        {showText &&
        (
            <input type="text"
                   ref={ref => ref && setText(INITIAL_TEXT)}
                   value={text}
                   onChange={e => setText(e.target.value)} />
                   )
        }
        <button onClick={() => setShowText(!showText)}>{showText ? '가리기' : '보이기'}</button>
      </>
  );
}

const INITIAL_TEXT = '안녕하세요';
```

input 에 값을 입력하면 입력하는데로 input 에 입력이 되고, 버튼을 클릭하면 해당 input 이 없어지고 생긴다.

없어졌다가 생길 경우엔 INITIAL_TEXT 가 초기 값으로 할당이 된다.

하지만 이 함수에 문제점이 있는데, onChange 가 작동을 하지 않는다는 것이다.

구동을 설명하자면 

1. onChange 작동
2. 값의 변경, 변경으로 인해 state 가 변경, 전체 html 렌더링
3. 렌더링과 동시에 ref 에 새로운 함수 입력
4. state 가 변경되었지만 ref 에 새로운 함수가 입력됨에 따라 해당 함수를 수행하게 되고 수행결과 초기값을 set 한다.
5. 변경되었지만, 변경되지 않았다.

이와 같은 문제가 발생하는 이유는 4번 때문인데, ref 의 경우 새로운 함수가 입력되면 이전 함수에 null 을 넣어 없애고, 이후에 전달 받은 새로운 함수를 참조값으로써
새로 실행하게 된다.

코드에서는 기본적으로 ref 에 새로운 함수를 입력하는데, 렌더가 될 때 마다 결과적으로 새로운 함수가 입력되는 모양이기에 값의 변경이 일어나지 않은 것처럼 초기 값을
set 하게 된다.

```javascript
// ...
const setInitialCallback = useCallback(ref => ref && setText(INITIAL_TEXT), []);
// ...
ref={setInitialCallback}
// ...
```

따라서 이와 같이 ref 에 정의가 된 function 을 전달해야 하며, 새로운 함수처럼 느껴지지 않게끔 useCallback 으로 함수를 생성해야 한다.

> useCallback?
> 
> useEffect 와 유사하며, callback 을 메모이제이션 하는데, 쉽게 메모리단에서 저장한다고 보면 이해하기 쉽다.
> 
> `useCallback(() => {}, [])`
> 
> 첫번째 파라미터는 메모이제이션 할 함수, 두번째는 useEffect 의 의존성 배열과 동일한데, 해당 배열에 있는 값이 변경될 때에만 새로이
> 메모이제이션한다.

```javascript
import React, {useState, useCallback} from 'react';

export default function RefElement2() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [showText, setShowText] = useState(true);
  const setInitialCallback = useCallback(ref => ref && setText(INITIAL_TEXT), []);
  return (
      <>
        {showText &&
        (
            <input type="text"
                   ref={setInitialCallback}
                   value={text}
                   onChange={e => setText(e.target.value)} />
                   )
        }
        <button onClick={() => setShowText(!showText)}>{showText ? '가리기' : '보이기'}</button>
      </>
  );
}

const INITIAL_TEXT = '안녕하세요';
```

위와 같이 구현하면 정상적으로 작동하게 된다.

비슷한 방식으로 이전 데이터와 현재 state 를 비교하는 형식일때도 이용이 가능하다.

```javascript
// ...
const [age, setAge] = useState(20);
const prevAgeRef = useRef(20);
useEffect(() => {
  prevAgeRef.current = age;
}, [age]);
// ...
return (
    <>
      // ...
      <button onClick={() => setAge(/* VALUE */)}>증가</button>
    </>
);
```

이와 같이 구현 할 경우 이전의 age 는 preAgeRef 에, 현재 나이는 age 에 들어가 있게 되고 서로를 비교하는 로직을 완성 할 수 있다.

> 주의해야 할 점
> 
> 1. rendering 이후 ref 활용
> 
> ref 는 대부분이 DOM object 에 접근해서 처리를 하는 경우가 많기 떄문에 Life Cycle 상 렌더링 이후에 실행되는 useEffect 를 이용해서
> 사용하기 편하다.
> 
> 2. 사용 시점
> 
> 위와 동일한 상황의 이야기인데, rendering 이후에 DOM 에서 값(데이터 혹은 event 등)을 가져오기 때문에
> 잘못된 시점에서 호출 시 null exception 이나 기타 원하는 로직으로 실행이 되지 않을 수 있다.