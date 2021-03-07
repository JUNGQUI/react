### Fragment

react 에서 여러 요소를 반환할 때는 무조건 div tag 로 감싸서 전달해야 한다.
또한 여러 요소를 배열 형태로 제공 할 경우 key property 가 필요하다.

> key
> 리액트에서 배열로 제공되는 리액트 엘리먼트에 대해 렌더링에 효율을 위해 존재한다.
> 
> - 1
> - 2
> 
> 이러한 렌더링 된 화면이 있다고 하고, 첫줄에 새로운 '3' 이라는 값이 추가되야 한다면 리액트는
> - 1 (제거)
> - 2 (제거)
> - 3 (새로 추가)
> - 1 (이미 있었는데 제거했으니 새로 추가)
> - 2 (이미 있었는데 제거했으니 새로 추가)
>
> 이와 같이 작동하게 되는데 key 가 있다면 해당 값을 통해 key 의 value 가 바뀌었는지를 판단한다. 즉 위와 같은 상황에서
> - 3 (신규 key, 새로 추가)
> - 1 (key 1, 값 변화 없음)
> - 2 (key 2, 값 변화 없음)
> 
> 이렇게 굳이 있는 값을 제거하는게 아닌 요소의 위치를 변경하는 식으로 렌더링이 작동하기에 key 값이 필요하다.
> 
> 추가적으로 배열 형태 제공 시 key 가 없다면 error 을 발생시킨다.
> 
> 자세한건 [여기](../../../ListAndKey.md)를 참조하자.

```javascript
function App() {
  return <div>
    <p key={1}>첫 줄</p>
    <p key={2}>두번째 줄</p>
    </div>;
}
```

그러나 이와 같은 방식으로 구성 할 경우 원하는 스타일로 만들어지지 않을 수 있고 (불필요한 div depth 증가로 인해 style 적용 어려움)
굳이 만들지 않아도 되는 div 가 추가되는 부분이 있다. 이 부분에 편의 제공을 위해 React.Fragment 가 있다.

```javascript
function App() {
  return (
      <React.Fragment>
        <p>첫 줄</p>
        <p>두번째 줄</p>
      </React.Fragment>
  );
}
```

Fragment 를 사용하면 장점이 하나 더 있는데, 바로 key 값의 의무적 명시가 없어진다는 것이다.

렌더링 되는 순서가 일종의 key 역할을 하고, 이것을 Fragment 에서 제어를 하기에 key 가 없어도 된다.
또한 Fragment 를 자주 쓰게 된다면 <> 와 같은 표현으로도 대체가 가능하다.

```javascript
function App() {
  return (
      <>
        <p>첫 줄</p>
        <p>두번째 줄</p>
      </>
  );
}
```

### createPortal

ReactDOM 을 import 해서 사용하는 method 로, 전체 컴포넌트 내에서 (보통 App.js) root 외 다른 요소에 렌더링이 필요할 경우 사용하는
method 이다.

```html
...
<div id="root"></div>
<div id="something"></div>
...
```

```javascript
export default function App() {
  // ...
  return (
      <>
        <Counter />
        <button style={{backgroundColor: color}} onClick={onClick}>
          버튼
        </button>
        {
          ReactDOM.createPortal(
              <div>
                <p>이건</p>
                <p>포탈입니다</p>
              </div>,
              document.getElementById('something')
          )
        }
      </>
  )
}
```

위 스크립트에서처럼 기본적으로 렌더링을 root 에 하지만, something 이라는 id 를 가진 div 에 추가적으로 별도의 리액트 엘리먼트를
렌더링 하고자 할 때, ReactDOM.createPortal 을 이용해서 해당 요소에 별도의 컴포넌트 혹은 리액트 엘리먼트를 렌더링 할 수 있다.

