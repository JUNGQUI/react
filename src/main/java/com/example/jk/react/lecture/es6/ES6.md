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
console.log(`Fifteen is ${a + b} and\nnot ${2 * a + b}.`);
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