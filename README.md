# react

react 연습 project

## setting

- brew install node(npm 같이 진행)
- brew install yarn --ignore-dependencies (node를 설치했기에 yarn 진행 시 옵션을 통해 제외)

big sur 내에서 권한 이슈로 인해 node link 가 안될 경우가 있다.

- sudo chown -R `whoami`:admin /usr/local/include/node
- sudo chown -R `whoami`:admin /usr/local/bin
- sudo chown -R `whoami`:admin /usr/local/share
- sudo chown -R `whoami`:admin /usr/local/lib/dtrace

이후에

- brew link --overwrite node

실행 시 node 인식 정상적으로 된다.

### npm

Node Package Management 약어로, 노드 패키지들을 관리해주는 모듈이다.
쉽게 maven repository 와 같다고 생각하면 편하다.

### yarn

2016년 페이스북, 구글 등이 만든 npm 의 일종이다. 속도는 빠르고 보안적인 이슈도 npm 에 비해 적다고 한다.

---
### 함수형 프로그래밍

변수를 함수처럼 사용해서 변수로 값을 변형하거나 해당 함수가 변수화 되었기에 다른 함수에 값을 전달해 내부에서 해당 함수 기능을 사용하는 식의 사용이 가능하다.

javascript 내 함수는 자체가 함수형으로 사용이 가능한데, ECMA6 부터 화살표 함수 (arrow function), 프라미스(promise) 가 추가되었다.

### ECMA6

- const

변형이 불가능한 ECMA6 에서 나온 새로운 변수 타입이다. Immutable 하기에 기존의 js 에서 변형의 위험이 있었다면 이를 통해 사용이 가능하다.

또한 함수형인 js 특성상 var 로 function 선언 시 위험한 부분을 제어가 가능하다.

- let

const 와 반대로 변형이 가능한 타입이다.

- arrow function
  
```javascript
const basicFunction = function (a = 'default') {
  console.log(a);
};

const arrowFunction = (a = 'default') => {
  console.log(a);
}
```

화살표를 이용해서 기존의 function 을 대체할 수 있다. 위와 같이 간단한 경우 큰 이점이 없어 보이지만

```javascript
function sum(){
  var arr = Array.prototype.slice.call(arguments);
  return arr.reduce(function(pre, cur){
    return pre + cur;
  });
}

console.log(sum(1,2,3,4));
 
// ES6
const sum1 = (...args) => {
  return args.reduce((pre, cur) => pre + cur);
}

console.log(sum1(1,2,3,4));
```

같은 결과이지만 이와 같이 다르게 표현이 가능해진다.

- promise

```javascript

promise = new Promise(function(resolve, reject) {
    console.log("Promise");
    resolve();
});
promise.then(function() {
    console.log("Resolved.");
});

console.log("Hi!");
```

> Promise
> Hi!
> Resolved.

```javascript
let promise = Promise.resolve(42);

promise.then(function(value) {
  console.log(value);
});
```

promise 로 사용 할 시 이와 같이 먼저 값을 전달하고 함수를 추후에 정의하여 해당 로직을 나중에 돌리는 식으로 제어가 가능하다.
(자세한걸 나중에 정의 필요)
