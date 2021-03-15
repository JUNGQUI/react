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