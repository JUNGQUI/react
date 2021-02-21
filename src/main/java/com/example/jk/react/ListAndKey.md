### List 와 Key

JSX 를 통해서 이와 같이 list 를 구현하는 것 또한 가능하다.

```javascript
// 최초 1~5까지 array 구현
const numbers = [1, 2, 3, 4, 5];

// li tag에 1~5 값을 mapping
const listItems = numbers.map((numbers) =>
  <li>{numbers}</li>
);
// render 시 ul tag 아래 li tag 모음인 ListItems 를 전달
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

이와 같은 형식으로 구현 시 root 아래 

- 1
- 2
- 3
- 4
- 5

이렇게 구성이 된다. 그런데 console 을 보면 warning 이 발생하는데,

> "Warning: Each child in a list should have a unique 'key' prop.%s%s See https://reactjs.org/link/warning-keys for more information.%s" "
> Check the top-level render call using <ul>." "" "
> at li"

이는 react list 를 rendering 할 경우 key 값이 명시되어야 한다는 것이다.

간단하게 말하자면 key 는 React가 어떤 항목을 변경, 추가 또는 삭제할지 식별자 역할을 수행한다. 우리가 단순하게 html 형식으로 여러가지 tag 를 만들 때 각각의 id 와 같은 역할을 하는 것인데
특이한 점은 내부의 Key 가 실제 DOM 에 (ReactDOM 또한) 사용자가 직접적으로 사용하지는 않는다는 점이다.

key 는 String 형식으로 이루어져 있으며 같은 element level 내에서만 unique 하되, 전역적으로 unique 할 필요는 없다.

또한 기본적으로 index 를 이용해서 key 값을 지정할 수 있다. 
```javascript
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

또한 지정 시 유의해야 할 점이 있는데, 하나의 element 에 지정을 해줘야 할 것 같지만 (List 내의 각 element 에 대한 key 이니)
실제론 해당 각 element 가 아닌 전체 list 를 만드는 컴포넌트 내에서 key 를 지정해줘야 하는데, 그 이유는 Key props 자체가 react 내부에서 사용하기 때문이다.

일반적인 DOM 객체가 아닌 react element 에 지정을 해줘야 하기에 컴포넌트를 설정해줄때 지정해줘야 한다.

```javascript
function ListItem(props) {
  // 이곳은 일반적인 DOM 객체이기에 key 라는 값 지정이 불가능하다.
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => 
    // map 으로 loop 를 진행하면서 컴포넌트 내부에서 key 를 지정해준다.
    // key 와 별개로 ListItem 컴포넌트에 value props 가 지정되어 있기에 value 를 넘겨주고, key 는 value 를 string 으로 바꿔서 전달한다.
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```