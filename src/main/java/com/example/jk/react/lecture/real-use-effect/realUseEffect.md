### useEffect 실전

#### 의존성 배열을 조정하자.

```javascript
// ...
useEffect(() => {
  // ... SOME LOGIC
}, []);
// ...
```

useEffect 의 경우 파라미터가 두 개가 있는데, 하나는 실제로 실행될 callback 형식, 하나는 변화를 감지할 state 값이다.

이 때, 보통 의존성 배열 관련된 이슈가 가장 많은데

1. 아예 빈 상태로 생성
2. 빈 배열로 생성
3. 추가된 state 기입하지 않음
4. 의도되지 않은 값 추가로 인한 렌더링
5. useEffect 내에서 변경하는 state 에 대해 의존성 배열에 명시하지 않음

과 같은 이슈가 생길 수 있다.

위와 같은 상황을 대비하여 react team 에서는 eslint 라는 rule 을 만들어서 해당 하는 경고가 발생할 경우
console 을 통해서 log 로 알려주게 했다.

해당 내역은 create-react-app 을 통해서 자동으로 사용이 가능하다.

#### 1회성 Hook 은 커스텀으로 만들자

의존성 배열에 아무런 값을 (혹은 빈 배열을) 주지 않고 1회성 으로만 사용되는 hook 이 있다면 커스텀 훅으로 생성해서 사용할 수 있다.

```javascript
export default function useOnMounted(effect) {
  useEffect(effect, []);
}
```

이와 같이 사용하면 가독성 측면과 모듈을 나눠 사용하는 것에 유의미한데, 빈 배열을 넘겨서 사용하기보다 effect 자체를 넘겨받아 실행하게끔
사용한다면 모듈로 별도로 분리해서 만드는 셈이기에 재사용성 측면에서도 유리하다.

#### 실행 컨텍스트

```javascript
// ...
const [value1, setValue1] = useState(0);
const [value2, setValue2] = useState(0);

useEffect(() => {
  console.log(value1 + ' ' + value2);
}, [value1]);
// ...
```

위 와 같이 적용한다면 겉으로 보기엔 문제가 없어보인다. 다만 value2 가 바뀌었을때도 값이 반영될까?

답은 `아니다` 인데, useEffect 가 처음 생겨났을 때, value1, value2 는 모두 초기값 0 으로 지정이 되어 있는데, useEffect 의
의존성 배열은 value1 만 가지고 있으므로 useEffect 가 바라보는 value2 의 경우 초기값 0 으로 아무리 변경되어도 변경된 값이
반영되지 않는다.

이러한 value2 의 값이 변하지 않는 부분은 실행 컨텍스트와 스코프, 클로져와 연관이 있다.

> 실행 컨텍스트?
> 
> 일단 기본적으로 스코프를 알아야 한다. 말 그대로 스코프는 '범위' 라는 뜻으로 javascript 에서 local function 의 경우
> local function 내에서 선언된 변수등은 local function 내에서만 사용되며, 같은 이름으로 전역이 있더라도 로컬에선 해당 값으로 적용되는 것을 의미한다.
> 
> ```javascript
> var name = 'jk';
> function printName() {
>   var name = 'function jk';
>   console.log(name); // -> function jk 출력
> }
> console.log(name); // -> jk 출력
> ```
> 
> 실행 컨텍스트는 이러한 부분을 의미하는데 `pringName` 함수의 경우 scope 가 함수 내로 지정되었으며 실행 컨텍스트의 경우
> 로컬 함수에서 선언된 'function jk' 라는 값을 바라보게 된다.
> 
> 이후 함수가 끝난 뒤 전체에서 console 을 찍으면 다시 전역에서 실행 컨텍스트가 초기 선언된 'jk' 라는 값을 기억하고 찾아서 실행해준다.

다시 본론으로 돌아가서, 이처럼 실행 컨텍스트가 기억하고 있는 value2 의 경우 초기 함수 생성 시의 초기값 '0' 이며, 의존성 배열에
value2 가 지정되지 않았기 때문에 변경되는 내역이 실행 컨텍스트에 영향을 주지 못하고 결과적으로 값이 변경되어도 항상 '0' 을 사용하게 된다.


#### async, await

useEffect 는 항상 함수 타입을 반환해야 하는데 async, await 의 경우 promise 객체를 반환하기 때문에 async, await 을 사용하면 문제가 발생한다.

```javascript
// ...
useEffect(() => {
  async function fetchSome() {
    console.log('SOMETHING');
  }
  fetchSome();
}, []);
// ...
```

그래서, 바로 useEffect 내에서 async 를 사용하는게 아니라 위와 같이 async 로 함수를 선언한 뒤 그 함수를 useEffect 에서 사용하듯이 사용을 해야 한다.

밖에서도 해당 함수를 사용하고자 한다면, 당연하게도 밖에서 호출해서 사용해야 한다.

```javascript
// ...
async function fetchSome() {
  console.log('SOMETHING');
}

useEffect(() => {
  fetchSome();
}, [fetchSome]);
// ...
```

그리고 의존성 배열을 통해 해당 함수를 등록해줘야 한다. 그런데 여기서 문제점이 생기는데, 저렇게 할 경우 매 렌더링 시 useEffect 가
실행이 된다.

```javascript
// ...

const fetchSome = useCallback(
    async function () {
      console.log('SOMETHING');
    }, []
);

useEffect(() => {
  fetchSome();
}, [fetchSome]);

// ...
```

그래서 useCallback 을 이용해서 변경이 일어날때만 함수를 생성하게 하고, 그런 함수의 변경을 감지해 useEffect 가 발생하게 해야
useEffect 내 함수를 async 를 이용해서 구현 할 수 있다.

#### 실행 시점

의존성 배열을 과도하게 사용 할 경우 관리에 어려움이 발생하는데, 의존성 배열 대신 useEffect 내에서 state 값에 따라 시점을 지정하게
(전통적인 방식의 if 등) 진행하면 시점 적용하기에도, 사용하기에도 편리한다.

이렇게 관리 할 경우 useCallback 을 사용할 필요도 없고 값의 최신화도 되기 때문에 편리하게 사용이 가능하다.

> useEffect 최신화 값 사용
> 
> 의존성 배열에 '아무런 값도 입력하지 않으면' useEffect 내에서 사용하는 state 의 경우 자동으로 최신화된 값을 사용한다.
> 
> 이를 이용해 위에서처럼 if condition 과 state 로 편리하게 시점 조정이 가능하다.

```javascript
function profile({userId}) {
  const [user, setUser] = useState('');
  useEffect(() => {
    if(!user || user.id !== userId) {
      console.log('function call');
    }
  }); // 의존성 배열이 '아예' 없음
}
```

#### 이전 값 처리

마찬가지로, 의존성 배열을 주지 않고 실행해도 이전의 상태값을 가져 올 수 있다. 사실 앞서 `setState` 를 통해 이미 알고 있는 부분인데,
`setState` 의 파라미터로 값을 주는게 아닌 함수를 제공할 경우 이전의 상태값을 가져와 로직을 진행한다.

```javascript
// ...
const [value, setValue] = useState(0);

useEffect(() => {
  setValue(value => value + 1); // 이전 상태값을 'value' 라는 이름으로 사용, 로직 진행 후 결과 리턴
  // ...
})
// ...
```

#### multiple condition

여러 객체에 대해서도 이와 같이 사용이 가능하다. 크게 두가지 방법이 있는데, useReducer 를 이용하는 것과 해당 다수의 상태값을
하나의 객체로 만들어 useState 를 통해 관리하는 것이다.

useState 로 관리하는것도 방법이긴 하나, 체계적으로 로직에 맞춰 값이 변경되는 부분들을 하나의 객체로 묶어서 사용하기에는 여러모로 부담이
있고 가독성 측면에도 좋지 않아 reducer 를 사용하는게 용이하다.

[useReducer](../hook/UseReducer.md) 는 여기에 설명되어 있다.

#### 함수 제어

```javascript
function SomeComponent({onClick}) {
  useEffect(() => {
    window.addEventListener('click', () => {
      onClick();
    })
  }, [onClick]);
}
```

하위 컴포넌트 내에 위와 같이 상위로부터 받은 function 에 대해 사용을 하게 될 수 있다. 이렇게 사용 할 경우 상위로부터 받는 onClick 함수가
변경될 때 마다 useEffect 가 변경되어야 하므로 의존성 배열에 추가가 필요하고 이는 앞서 우리가 이야기한 부분에 대해 부합되지 않기에 변경이 필요하다.

이럴 때 useRef 를 이용하면 의존성 배열 없이 사용이 가능하다.

```javascript
function SomeComponent({onClick}) {
  const onClickRef = useRef();
  useEffect(() => {
    onClickRef.current = onClick;
  });
  useEffect(() => {
    window.addEventListener('click', () => {
      onClickRef.current();
    });
  });
}
```

이렇게 사용 할 경우 변경이 일어나도 ref 를 통해 접근하기에 최신화된 값을 가져오게 되고 그 이벤트를 사용하게 된다.

주의해야 할 점은 ref 객체를 변경할때도 useEffect 를 사용하는데, 이렇게 변경하는 이유는 렌더링과 연관이 있다.

만약 useEffect 내에서가 아니라 바깥에서 ref 객체를 수정 할 경우 concurrent Mode 에서 렌더링 도중 실패할 경우
렌더링은 실패했지만 ref 는 수정이 되는 데이터가 꼬이는 상황이 발생 할 수 있다.

이러한 부분을 제어하기 위해 리액트 life cycle 에서 렌더링 이후 실행되는 useEffect 를 사용하여 변경을 하는 것이다.