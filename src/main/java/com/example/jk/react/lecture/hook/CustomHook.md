### Custom Hook

Hook 은 어떻게 보면 일종의 함수이기 때문에 물론 사용자가 만들 수 있다.

이렇게 만들어서 사용 할때의 장점은 사용자가 로직을 조립해서 모듈처럼 분리하고, 이를 통해 가독성과 결합력을 떨어뜨릴 수 있고
재사용 또한 가능하다는 장점이 있다. (굉장히 낮은 수준의 모듈로 구성을 하게 되기 때문)

```javascript
import {useState, useEffect} from 'react';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    console.log('did mount');
    return () => {
      console.log('unmount');
      window.removeEventListener('resize', onResize)
    };
  }, []);

  return width;
}
```

위의 function 들을 살펴보면 전부 Hook 으로 이루어져 있는데, Hook 내부에선 어떠한 JSX 라던지 렌더링 자체에 대한 값이 있는게 아니라
어떠한 값을 계산해주고, set 해주고, 일종의 비즈니스 로직을 수행해주는 부분인데, 이 부분들이 컴포넌트 안에 붙어 있지 않고
별도로 떨어지면서 가독성과 로직이 분리되어 이해하기 편한 구조가 되었다.

추가적으로 `해당 화면의 width 를 가져오는 부분` 은 모듈처럼 별도로 분리되었기에 useState 를 단독으로 사용하듯이 다른 컴포넌트에서도
해당 모듈을 import 하여 간단히 사용 할 수 있다.

#### 대규칙

1. 하나의 컴포넌트에서 훅 호출의 순서는 항상 같아야 한다.
2. 훅은 함수형 컴포넌트 혹은 커스텀 훅 안에서만 호출되어야 한다.

2번의 경우 사실 class 컴포넌트를 대체하기 위해 만들어졌기에 이견이 없는데, 1번의 경우는 애매하기에 예시를 들어보자.

```javascript
import {useState} from 'react';

function MyComponent() {
  const [value, setValue] = useState(0);
  
  if (value === 0) {
    const[v1, setV1] = useState(0);
  } else {
    const[v1, setV1] = useState(0);
    const[v2, setV2] = useState(0);
  }
  
  for (let i = 0; i < 5; i++) {
    const[num, setNum] = useState(0);
  }
  
  function func1() {
    const[num, setNum] = useState(0);
  }
}
```

위 상황은 모두 그릇된 상황에서 사용된 훅이다.

1. if condition

if 절에서의 훅 사용은 안된다. 그 이유는 이 훅이 어떠한 상황에서만 쓰이고 어떠한 상황에서는 쓰이지 않을 때가 발생하게 된다.

2. for loop

for 문에서도 마찬가지인데, 여긴 비슷하면서도 다르다.

우선 hook 을 수도코드로 살펴보면 

```javascript
let hooks = null;

export function useHook() {
  // ...
  hooks.push(hooksData);
}

function process_a_component_rendering(component) {
  hooks = [];
  component();
  let hooksForThisComponent = hooks;
  hooks = null;
}
```

이와 같이 진행이 되는데, 내부에서 hook 을 배열 형식으로 hooks 라는 변수에 쌓아두고 이를 사용하기에 react 가 순서에 따라 실행이 되는 것을 알 수 있다.

```javascript
function Form() {
  // 1. name이라는 state 변수를 사용하세요.
  const [name, setName] = useState('Mary');

  // 2. Effect를 사용해 폼 데이터를 저장하세요.
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. surname이라는 state 변수를 사용하세요.
  const [surname, setSurname] = useState('Poppins');

  // 4. Effect를 사용해서 제목을 업데이트합니다.
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

따라서 이와 같이 사용이 될 경우에도 마지막 useEffect updateTitle 이 실행이 되더라도 기존에 state 에 name, surname 이 있음을
보장해주고 이를 버그 없이 사용이 가능하다는 것이다.

__결과론적으로,__ 리액트는 state 를 통해 렌더링부터 값 변화까지 다양하게 이루어지는데 이 state 를 직간접적으로 변경시키는
hook 은 state 가 항상 올바르게 유제됨을 보장해야 하기에 `순서` 가 중요하다.

그리고 hook 이 호출되는 순서를 제어하기 위해서 가장 좋은 점은 최상위 level 에서만 호출을 하게 하면 제어가 되기에 규칙으로써 지정이 된 것이다.

> ESLint?
> 
> javascript code 분석 도구로써 위에서 언급했던 훅 규칙을 포함해서 잘못된 import 등 다양한 error, warning 에 대해
> 알려준다. 서버사이드로 보면 일종의 컴파일러라고도 볼 수 있다.