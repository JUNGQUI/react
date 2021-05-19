### template literals

ES6 에서 나오게 된 문법이다. 이전의 규격에서는 별도의 프레임워크를 제외한다면 string 안에서 특수한 expression 은 사용 할 수 없다.

대표적인 예로 jsp 가 그 예시인데, java 표현식을 javascript 내에서 특수한 tag 를 (JSTL) 통해 자바 표현식을 사용 할 수 있다.

이제 그러한 특성이 javascript 내 기본 규격으로 지정된게 template literals 이다.

```javascript
let a = 5;
let b = 10;
console.log('Fifteen is ' + (a + b) + ' and\nnot ' + (2 * a + b) + '.');
// "Fifteen is 15 and
// not 20."

let a = 5;
let b = 10;
console.log(`Fifteen is ${a + b} and 
not ${2 * a + b}.`);
// "Fifteen is 15 and
// not 20."
```

두 가지 결과는 모두 동일한데, 한쪽에는 변수를 합쳐서 stringify 를 진행하는 것이고 다른 한쪽은 `template literals` 를 이용해서
구현을 한 string 이다.

```javascript
let classes = 'header';
classes += (isLargeScreen() ?
  '' : item.isCollapsed ?
    ' icon-expander' : ' icon-collapser');

const classes = `header ${ isLargeScreen() ? '' :
    (item.isCollapsed ? 'icon-expander' : 'icon-collapser') }`;

const classes = `header ${ isLargeScreen() ? '' :
    `icon-${item.isCollapsed ? 'expander' : 'collapser'}` }`;
```

또한 expression 이 내에 javascript 로써 구현이 가능한 부분이기에 ${} 안에 condition 에 따라 string 을 반환하는데 그 안에도
다시 템플릿 리터럴로 표현해서 값에 대한 연산을 진행하는 것을 볼 수 있다.

- [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

### generator

ES6 iterator 개념처럼 제너레이터 함수를 구현하고 내부에 yield 를 통해 선언하면 `.next()` 함수를 통해
다음 단계에 접근이 가능하다.

```javascript
function* fn1() {
  console.log('f1');
  yield 10;
  console.log('f2');
  yield 20;
  console.log('f3');
  return 'finished';
}

const gen = fn1();
console.log(gen.next());
// f1
// { value : 10, done : false}
console.log(gen.next());
// f2
// { value : 20, done : false}
console.log(gen.next());
// f3
// { value : 'finished', done : true}
```

위 예시처럼 yield 를 하나의 기준점으로 삼고 자바스크립트 객체를 반환하기에, effects 를 활용해서 액션을 디스패치하고 그 결과를 중간 중간에
사용하여 동기/비동기적으로 main flow 와는 다르게 별도의 flow 로 데이터 처리가 가능하다.

한 가지 중요하게 볼 점은 이터레이터 이자 제어권이 외부에 있기에 (.next() 를 통해 다음 진행) 아래와 같은 코드가 버그가 아니다.

```javascript
function* iteratorWhile() {
  let count = 0;
  while(true) {
    count++;
    yield count;
  }
}
```

얼핏 보기엔 무한루프이기에 에러가 발생할 것으로 보이지만 제너레이터는 1회 수행 후 yield 에서 제어권을 호출한 쪽으로 넘기기에 단계마다 1씩
증가된 카운터를 가져 올 수 있다.

또한 next 를 통해 파라미터를 전달해서 그 값을 그대로 사용 할 수 있다.

```javascript
function* sumGen() {
  let a = yield;
  let b = yield;
  return a + b;
}

const sum = sumGen();
sum.next();   // 생성
sum.next(1);  // a 에 1
sum.next(2);  // b 에 2, return 3
sum.next();   // { value : undefiend, done : true }
```

> 참고
> 
> next 에 파라미터는 1개만 입력이 가능하며, 추가로 더 입력하더라도 가장 처음 전달된 파라미터가 다음 yield 에 할당된다.