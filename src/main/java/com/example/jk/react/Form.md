### 폼

기본적으로 HTML DOM 에서 <form> 의 경우 입력받은 사용자의 정보에 따라 자신만의 state 를 가지게 된다.

예컨데 이름을 입력받아 저장하는 form 이 아래와 같다면

```javascript
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

name 을 받아서 submit 할 경우 form 에 명시된, 혹은 외부에 event listener 를 통해 지정된 uri 로 'name' 이라는 프로퍼티를 가진
데이터가 전달되게 되고 이 때 사용자 기반의 정보 (입력받은 name)가 이 form 에서의 '상태' 가 된다.

하지만 react 의 경우 props 산하 state 를 통해 상태를 일괄적으로 관리한다. 이번에 소개하는 것은
이를 하나로 단일화 하여 관리의 용이성을 가져가는 것을 설명한다.

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

위 컴포넌트를 보면 일단 handleChange, handleSubmit 두 이벤트가 bind 되었으며 input text 에는 handleChange, form에 submit 에는
handleSubmit 을 mapping 하였다.

handleChange 의 경우 입력받는 값을 state.value 에 setting 해주고 있고 handleSubmit 의 경우 submit 될 경우 state.value 를 alert 으로 띄워주고
이후 데이터 전달을 방지하여 더 이상 event 가 진행되는 것을 막았다.

원래 value 의 경우 입력받은 값을 form tag 가 자체적으로 가지고 제어를 하였으나 항상 state.value 를 전달해주면서 자연스럽게
state 를 통해 값에 대한 관리 포인트를 일원화 할 수 있게 되었다.

form tag 와 마찬가지로 다른 것들도 동일하게 적용이 가능하다.

- textarea
- input
- select

등 다양한 input 형식의 tag 에 state 를 통해 값 제어를 react state 로 관리가 가능하다.