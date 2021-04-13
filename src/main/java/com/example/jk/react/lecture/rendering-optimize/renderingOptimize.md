### 렌더링 최적화

리액트 환경에서 가장 많은 resource 가 소요되는 부분이 바로 렌더링이다. 그리고 이러한 렌더링을 최적화하기 위한 도구로 여럿이 있다.

#### memo

[memo](../state/State1.md) 를 이용하면, 단순히 조건부 형식의 렌더링이 아니라 memoization 기능으로 렌더링 이후
변화가 없을 경우 이전의 렌더링 유무를 판단한다.

> 성능 vs 생산성
> 
> 최근 들어서 대부분의 웹 페이지의 경우 브라우저 엔진의 발전과 인터넷 속도 상승으로 인해 성능상 이슈가 나올 일이 별로 없어졌다.
> 
> 따라서 둘 중 하나를 골라야 한다면 단연코, 생산성을 즉, 성능을 고려하지 말고 개발을 하도록 하자.

아래 케이스를 살펴보자.

```javascript
function MyComponent() {
  // ...
}

function isEqual(prevProp, nextProp) {
  // true or false
}

React.memo(MyComponent, isEqual);
```

`memo` 에서 첫 파라미터만 적용 할 경우 해당 파라미터로 전달된 컴포넌트의 변화 유무를, 두번째 파라미터를 전달 할 경우 해당 파라미터의
리턴값을 가지고 렌더링 유무를 판가름한다.

#### 불변객체 관리

리액트에서 상태값을 하나의 값이 아닌 객체 형식으로 관리하고 있을 때 해당 객체의 비교는 어떻게 할까?

가장 간단한 방법은 객체의 모든 요소를 비교하는 것이다. 하지만 이렇게 하면 딱 봐도 효율이 떨어질것 같은데 이 때 효율을 위해 객체를 불변객체로써
관리하게 되면 간단한 `===` 연산으로도 값의 비교가 가능하다.

```javascript
const prevNumbers = [1, 2, 3];
const nextNumbers = [1, 2, 3];
// 일반적인 방법
nextNumbers.push(4);
prevNumbers.length === nextNumbers.length;
prevNumbers[0] === nextNumbers[0];
// ...



// 불변객체로 관리하는 방법
const nextNumbersImutable = [...numbers, 4];
prevNumbers === nextNumbers;
```

리액트는 `얕은 비교` 를 사용하는데 아래의 코드를 보자.

```javascript
const prev = {
  name : [
    {title : '', content : ''},
    {title : '', content : ''},
    // ...  
  ],
  explain : ''
}

const next = {
  name : [
    {title : '', content : ''},
    {title : '', content : ''},
    // ...  
  ],
  explain : ''
}
```

이렇게 두 가지가 있을 경우 

`prev.name === next.name && prev.explain === next.explain` 와 같은 형식으로 비교를 하는 즉, 객체 안의 하나의 
속성값을 모두 비교를 하는 형식이다.

> 얕은 비교?
> 
> 안에 있는 모든 속성값의 값을 끝이 어딘지 모르는 depth 까지 파고 들어가는 건 몹시 비효율적이다. 따라서 리액트는 얕은 비교를 수행하는데
> 1depth 까지의 값을 비교하는걸 얕은 비교라고 한다.

#### useMemo, useCallback

렌더링 당시 판단을 하는 요소는 의존성 배열과 컴포넌트에 주어지는 상태값의 변경이 가장 대표적이다.

```javascript
function MyComponent({someState}) {
  //...
}

function MainComponent() {
  const [someState, setSomeState] = useState('SOMETHING');
  
  // ...
  <MyComponent someState={someState}/>
  // ...
}
```

위와 같은 구조는 크게 이상한점이 보이지 않고, 렌더링 시점에서도 이상이 없어 보인다.

```javascript
function MyComponent({someState, changeSomeState}) {
  //...
}

function MainComponent() {
  const [someState, setSomeState] = useState('SOMETHING');
  
  // ...
  <MyComponent someState={someState} changeSomeState={v => setSomeState(v)}/>
  // ...
}
```

위 코드는 변경된 부분이 `changeSomeState` 라는 함수가 파라미터로 추가되었다. 겉으로 보기에는 별다를것이 없어보이나, 함수 자체를 전달한게 아닌
`새로운 함수를 생성하여 전달` 하였기 때문에 항상 새로운 상태값이 부여된 것으로 판단하고 실제로 변경이 없음에도 해당 요소로 인해
다시 렌더링이 된다.

이를 방지하기 위해서 useCallback 을 사용한다.

```javascript
function MyComponent({someState, changeSomeState}) {
  //...
}

function MainComponent() {
  const [someState, setSomeState] = useState('SOMETHING');
  const callbackSetSomeState = useCallback(v => setSomeState(v), []);
  
  // ...
  <MyComponent someState={someState} changeSomeState={callbackSetSomeState}/>
  // ...
}
```

이렇게 사용하면 useCallback 의 의존성 배열에는 아무런 값이 있지 않으므로 초기 렌더링 시 생성이 될것이며 함수를 전달하는 부분도
새로운 값이 아니라 이미 useCallback 을 통해 '이미 생성된 변화가 없는 함수' 를 전달하기때문에 렌더링 시 마다 다시 렌더링 될 일도 없어진다.

새로운 함수가 아니라 상태값에서도 동일하게 사용이 가능하다.

```javascript
function MyComponent() {
  //...
  
}

const FRUIT = [
  {name : 'apple', price : 1000},
  {name : 'pineapple', price : 2000},
  {name : 'watermelon', price : 5000}
]
```