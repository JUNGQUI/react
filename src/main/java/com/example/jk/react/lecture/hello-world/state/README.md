### state

상태라는 명칭에 걸맞게 현재 리액트 컴포넌트에서 props 의 상태 '값' 을 의미한다.

이 상태값의 변경에 따라 리액트는 새로 렌더링을 할지, 어떤 값을 할지, 그 값이 변경되었는지 확인하고 렌더링 유무를 판단한다.
또한 컴포넌트 안에 하위 컴포넌트가 있을 경우 별 이상이 없으면 전체가 같이 렌더링 된다.

- React.memo

최적화를 위한 react method 인데, 실제로 해당하는 컴포넌트가 렌더링이 되지 않으면 하위 컴포넌트 렌더링을 하지 않는다.

예를 들어보자면

```javascript
import React, {useState} from 'react';

function Title({title}) {
  return <p>{title}</p>;
}
```

```javascript
import React, {useState} from 'react';
import Title from './Title';

export default function Counter() {
  const [count, setCount] = useState(0);
  function onClick() {
    setCount(count + 1);
  }

  return (
      <div>
        <Title title={'현재 카운트 : ' + count}/>
        <butto onClick={onClick}>증가</butto>
      </div>
  );
}
```

```javascript
import React, {useState} from 'react';
import Counter from './Counter';

export default function App() {
  const [color, setColor] = useState('red');
  function onClick() {
    setColor('blue');
  }

  return (
      <div>
        <Counter />
        <button style={{backgroundColor: color}} onClick={onClick}>
          버튼
        </button>
      </div>
  )
}
```

이런식으로 렌더링이 되는 컴포넌트가 있다고 가정을 하자.

현재 App 컴포넌트에서 Counter 컴포넌트를 호출하고 Counter 는 다시 하위에 Title 컴포넌트를 호출한다.

이와 같은 구조일 때 Counter 에 값 변화가 생긴다면 Title 컴포넌트도 하위 컴포넌트이기에 변화 될 떄 마다 렌더링이 진행되는데,
사실 로직상에서 보면 타이틀 컴포넌트는 값 변화가 없기때문에 렌더링이 될 필요가 없다.

이러한 부분이 불필요한 렌더링인데 이 부분을 보완하기 위해 React.memo 가 필요하다.

```javascript
import React, {useState} from 'react';

function Title({title}) {
  return <p>{title}</p>;
}

export default React.memo(Title);
```
이렇게 React.memo 로 감싸서 전달하면 실제 title 이 변경이 될때만 렌더링이 된다. 즉, 하위 컴포넌트라 하더라도 렌더링이 필요하지 않다면
렌더링을 진행하지 않는 것이다.