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