### 재사용성을 고려한 컴포넌트 작성

컴포넌트를 생성할 때는 모듈 이라는 특성에 맞게 작성을 해야 한다. 

```javascript
function makeDoneList({todos}) {
  const [doneList, setDoneList] = useState(todos.filter(item => item.done));
  function onChangeList(key, name) {
    setDoneList(
        doneList.map(item => (item.key == key ? {...item, name} : item))
    );
    // ...
  }
  // ...
}
```

위와 같은 컴포넌트는 전체 `todoList` 에서 done 인 것을 가져와서 `doneList` 를 수정하는 이벤트를 지정하고 있다.
그러나 이와 같이 수정 할 경우 코드상에서는 문제가 없어 보이지만 실제 app 에서는 버그로 인식 될 수 있다.

예를 들어, doneList 와 별도로 운영되지만 실제로 todoList 와 대입하면서 비교하는 로직이 쓰인다면 doneList 는 수정이 되었지만 (이름 변경으로 인해)
todoList 는 이전의 데이터를 가지고 있기에 둘 사이의 비교를 진행 할 경우 데이터 정합성이 어긋나게 된다.

이와 같이 컴포넌트를 구성 할 때 내부에서만 사용하는 것이 아닌 외부에서도 사용하는 상태값을 수정하는 등 작업을 진행하면 데이터가 꼬이게 되므로
컴포넌트는 내부 상태값 혹은 UI와 관련된 상태값만 내부에서 사용하고 외부에서 쓰지 않게 하는 것이 좋다.