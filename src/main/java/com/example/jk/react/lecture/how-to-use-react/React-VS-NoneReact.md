### 리액트와 일반 코드의 차이

일반적인 DOM API 를 이용해서 구축 시 html 과 javascript 부분을 분리해서 사용하기 마련이다.

```html
<div class="todo">
  <h3>할 일 목록</h3>
  <ul class="list"></ul>
  <input type="text" class="desc" />
  <button onclick="onAdd()">추가</button>
  <button onclick="onSaveToServer()">서버 전송</button>
</div>
```

```javascript
let currentId = 1;
const todoList = [];

function onAdd() {
  const descEl = document.querySelector('.todo .desc');
  const todo = { id: currentId++, desc: descEl.value };
  todoList.push(todo);
  const listEl = document.querySelector('.todo .list');
  const todoEl = makeTodoElement(todo);
  listEl.appendChild(todoEl);
}

function makeTodoElement(todo) {
  const todoEl = document.createElement('li');
  const spanEl = document.createElement('span');
  const buttonEl = document.createElement('button');

  spanEl.innerHTML = todo.desc;
  buttonEl.innerHTML = '삭제';
  buttonEl.dataset.id = todo.id;
  buttonEl.onclick = onDelete;

  todoEl.appendChild(spanEl);
  todoEl.appendChild(buttonEl);
  return todoEl;
}

function onDelete(e) {
  const id = Number(e.target.dataset.id);
  const index = todoList.findIndex(item => item.id === id);

  if (index >= 0) {
    todoList.splice(index, 1);
    const listEl = document.querySelector('.todo .list');
    const todoEl = e.target.parentNode;
    listEl.removeChild(todoEl);
  }
}

function onSaveToServer() {
  console.log('서버로 전송');
}
```

이와 같이 순수 DOM API 로만 구현을 할 경우 rendering 대상이 되는 오브젝트를 실제로 구현을 해야하며, 이를 통해서 구현할 경우
오브젝트가 변해야 할 경우 script 자체도 수정을 해야 하는 단점이 있다.

즉, 화면부분과 로직부분이 동시에 공존하게 되며 이렇게 될 경우 관리하기에 어려움이 발생한다.
이는 사실 DOM API 뿐 아니라 jQuery 를 사용해서 append 로 조립을 할 때도 마찬가지로 발생하는 문제다.

그와 반면 리액트는 아래와 같이 구성이 가능하다.

```javascript
import React, {useState} from 'react';

export default function App() {
  const [todoList, setTodoList] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [desc, setDesc] = useState('');
  const [showOdd, setShowOdd] = useState(false);

  function onAdd() {
    const todo = {id: currentId, desc };
    setCurrentId(currentId+1);
    setTodoList([...todoList, todo]);
  }

  function onDelete(e) {
    const id = Number(e.target.dataset.id);
    const newTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(newTodoList);
  }

  function onSaveToServer() {
    console.log('서버에 저장되었습니다.');
  }

  return (
      <div>
        <h3>할 일 목록</h3>
        <ul>
          {todoList.filter(todo => showOdd ? Number(todo.id)%2 !== 0 : true).map(todo => (
              <li key={todo.id}>
                <span>{todo.desc}</span>
                <button data-id={todo.id} onClick={onDelete}>
                  삭제
                </button>
              </li>
          ))}
        </ul>
        <input type="text" value={desc} onChange={e => setDesc(e.target.value)} />
        <button onClick={onAdd}>추가</button>
        <button onClick={() => {setShowOdd(!showOdd)}}>홀수 아이템 on/off</button>
        <button onClick={onSaveToServer}>서버 저장</button>
      </div>
  );
}
```

리액트 코드를 살펴보면 렌더링이 되는 부분이 별도로 있고, 변경이 되는 로직의 경우 state 를 통해 관리를 한다.

state 가 변경되면 렌더링이 자동으로 이루어지기에 변경이 되는 로직에서는 화면의 변화에 대해 일절 관심이 없고 실제로 값의 변화에만 집중하기에
관리 입장에서 아주 용이하고 변경 시에도 우아하게 반영이 가능하다.

단적인 예로 DOM API 에서 새로운 span 을 한줄 더 추가한다고 가정한다면

```javascript
function makeTodoElement(todo) {
  const todoEl = document.createElement('li');
  const spanEl = document.createElement('span');
  const buttonEl = document.createElement('button');

  const spanEl2 = document.createElement('span');
  
  spanEl.innerHTML = todo.desc;
  spanEl2.innerHTML = '추가됨 : ' + todo.desc;
  buttonEl.innerHTML = '삭제';
  buttonEl.dataset.id = todo.id;
  buttonEl.onclick = onDelete;

  todoEl.appendChild(spanEl);
  todoEl.appendChild(spanEl2);
  todoEl.appendChild(buttonEl);
  return todoEl;
}
```

이렇게 데이터 셋 부분에 HTML Element 생성 부분도 추가해줘야 하지만

```javascript
export default function App() {
  const [todoList, setTodoList] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [desc, setDesc] = useState('');
  const [showOdd, setShowOdd] = useState(false);
  
  const [addedDesc, setAddedDesc] = useState('추가됨');

  function onAdd() {
    const todo = {id: currentId, desc: desc, addedDesc: addedDesc}; // 추가된 '값 변경 로직'
    setCurrentId(currentId + 1);
    setTodoList([...todoList, todo]);
  }

  function onDelete(e) {
    const id = Number(e.target.dataset.id);
    const newTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(newTodoList);
  }

  function onSaveToServer() {
    console.log('서버에 저장되었습니다.');
  }

  return (
      <div>
        <h3>할 일 목록</h3>
        <ul>
          {todoList.filter(todo => showOdd ? Number(todo.id)%2 !== 0 : true).map(todo => (
              <li key={todo.id}>
                <span>{todo.desc}</span>
                <span>{todo.addedDesc}</span> // 추가된 '렌더링'
                <button data-id={todo.id} onClick={onDelete}>
                  삭제
                </button>
              </li>
          ))}
        </ul>
        <input type="text" value={desc} onChange={e => {
          setDesc(e.target.value);
          setAddedDesc(e.target.value); // 추가된 값 '변경 반영'
        }} />
        <button onClick={onAdd}>추가</button>
        <button onClick={() => {setShowOdd(!showOdd)}}>홀수 아이템 on/off</button>
        <button onClick={onSaveToServer}>서버 저장</button>
      </div>
  );
}
}
```

이와 같이 state 에 새로운 desc 만 값으로 정의해주고 set, 사용하는 부분만 정의하면 나머지는 화면 내에서 렌더링 된다.

로직 자체를 분리할 수 있는 점에서 관리의 용이성과 변경에 대한 유연성도 이점으로 가져갈 수 있다.