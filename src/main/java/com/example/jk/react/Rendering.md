### Rendering

아래와 같은 html 이 있다고 가정할 때 

```html
<header>
<!-- ... -->
</header>

<body>
<div id="root">
  
</div>
</body>
```

```javascript
const element = <h1>Hello, world</h1>;
// 옵션
const callBackFunction = () => {console.log('J Tag');}
ReactDOM.render(element, document.getElementById('root'), callBackFunction());
```

이와 같은 구조를 통해 화면 반영 즉, rendering 이 가능하다.

React Element 는 불변객체이기에 만약 변경 사항이 생길 경우 변경된 부분을 모두 새로 만들어줘야 한다.
이 문구만 본다면 당연히 너무 비효율적이고 비용이 비싸다고 생각 할 수 있는데, React Render 는 이를 '변경된 부분' 만 새로 생성하여 반영하기에 오히려 기존 대비 저렴한 비용으로
변경 사항을 반영 할 수 있다.

```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```

위 코드를 보면 tick function 은 현재 시각을 보여주고 있고 1초마다 반복된다.

단순히 '전부 재구성'을 한다면 div, h1 의 Hello, world! 까지 새로 그려줘야 하지만 ReactDom.render 를 통해
rendering 할 경우 변경되는 부분 즉, h2 의 시간 부분만 1초마다 바뀌기에 해당 부분만 반영이 된다.

[여기](https://ko.reactjs.org/redirect-to-codepen/rendering-elements/update-rendered-element) 에서 개발자 도구를 통해 확인해보면
모든 요소가 그대로이되, 1초마다 new Date 부분만 바뀌어지는 것을 확인 할 수 있다.

이러한 '마법' 이 통하는 이유는 React element 의 props, state 와 react life cycle 덕분인데, 다음 장에서 다룬다.