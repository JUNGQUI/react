### Hello React

```javascript
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

가장 간단한 react 구문이다.

- ReactDom : container DOM element 의 react 버전. 해당 DOM 을 통해 rendering 하여 사용 가능하다.
  
```javascript
ReactDOM.render(element, container, [callback]);
```

- render : react 내에서 변형된 것들을 해당 DOM element 에 반영한다. 보통 rendering 한다고 하면 이와 같은 작업을 의미한다. 
  
  callback 을 같이 전달 할 경우 rendering 이후에 실행이 된며 option 으로 제공된다.

### JSX

```javascript
const element = <h1>Hello, world!</h1>;
```

script 가 아닌 것 같은 이 요상한 변수는 JSX 라고 칭하는데, javascript 확장으로써 React 에서 잘 사용하는 특성이다.
React 는 마크업과 로직을 분리하는게 아닌 느슨한 연결체로 component 라는 개념을 사용하는데 JSX 가 이를 가장 잘 표현해준다고 생각 할 수 있다.

```javascript
const name = 'Josh Perez';                // javascript
const element = <h1>Hello, {name}</h1>;   // Mark-up, with JSX

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

이와 같은 구성을 볼 때 `name` 은 우리가 흔히 쓰는 javascript 변수 선언이다. 이름에 'Josh Perez' 를 넣고, 추후 변경이 되지 않는다고 봐서 const 로 선언되었다.

`element` 의 경우 조금 이상하게 느껴진다. 마크업 과 같이 위에서 선언한 변수를 대입했다. 해당 표현이 javascript 내에 아예 없었던건 아니다.
아래의 코드를 보면

```javascript
var name = 'Josh Perez';
var element = '<h1>Hello, ' + name + '<h1>';

$(function () {
  document.getElementById('root').append(element);
});
```

동일하게 선언하여 DOM 내 root ID 를 가진 tag 에 element 를 반영한다. 다만 다른 점은 element 도 마크업이 들어가있긴 하지만 정상적인 마크업이 아닌
마크업 모양의 string 객체 (javascript 에는 없지만) 라는 것과 그 안에 name 을 욱여넣었다는 점이다.

결국 JSX 도 표현식의 일종이기에 다양한 방법으로 포맷에 맞게 적용이 가능하다.

> 포맷
> - ""와 {} 를 동시 사용하면 안된다.
> - camelCase 를 사용한다. tabindex -> tabIndex

또한 아래의 두 가지 코드는 모두 동일하다.

```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```javascript
const element = React.createElement(
  'h1',                     // tag
  {className: 'greeting'},  // tag 의 property, 다수 입력 가능 
  'Hello, world!'           // tag 에 들어갈 내용
);
```

React.createElement 의 경우 React DOM 내에 해당 내역을 생성하는 것인데 이와 같이 정의 후 render 시 해당 값들이 이벤트를 통해 발생하고 rendering 된다.