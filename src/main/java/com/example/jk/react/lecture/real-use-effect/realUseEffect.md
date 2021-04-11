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
5. useEffect 내에서 변경하는 state 에 대해 읮ㄴ성 배열에 명시하지 않음

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

