### State 끌어올리기

공통의 data 를 통해 컴포넌트에 대해 일괄적으로 update 하는 기능을 의미 한다.

온도 측정 계산기 컴포넌트를 만들텐데, input 온도는 섭씨든, 화씨든 하나의 값이 되고 output 은 두 가지 모두 반영이 된다 할 때,
입력받은 온도를 분석하여 두가지 온도로 반영하기 위해서 `1개의 데이터로 일괄적으로 컴포넌트 업데이트` 가 진행되어야 한다.

```javascript
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

일단, 변환하는 함수를 제공한다.

```javascript
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

그리고 각 상황에 맞게 값을 만드는 계산기를 제공한다. 여기서 convert 는 위에서 제공했던 섭->화 / 화->섭 이다.

```javascript
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

이 부분에서 주목해야 할 점은 render 내의 onChange 와 거기에 mapping 되는 handleChange 이다.

handleChange 를 보면 props 내에 onTemperatureChange 에 value 를 전달해준다.

이전 Props 설명을 할 당시에 props 는 읽기 전용이라는 설명을 한적이 있다. 이러한 특징을 이용해서 하나의 값을 불변하게 여러 컴포넌트에
뿌려줄 수 있다.

위에서 `뭔진 모르겠지만 onTemperatureChange() 를 호출` 함으로써 동일한 값을 각 컴포넌트에 줄 수 있다.

이제 상위 컴포넌트를 한번 살펴보자.

```javascript
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

TemperatureInput 컴포넌트 내에 onTemperatureChange props 를 추가하여 함수를 여기에서 mapping 해준다.

이렇게 함으로써

1. 하위 컴포넌트 (TemperatureInput) 에서 onChange 가 발생할 경우 해당 컴포넌트의 `handleChange` 이벤트를 호출하고
2. 이렇게 호출된 `handleChange` 이벤트는 props 로 받은 onTemperatureChange 함수에 전달받은 값을 전달한다
3. 상위 컴포넌트 (Calculator) 에서 onTemperatureChange 에 mapping 된 이벤트인 

- handleCelsiusChange
- handleFahrenheitChange

이벤트를 호출하게 되고, 결과적으로 각 컴포넌트에 하나의 state 를 통해 전파가 가능해진다.

이 부분이 바로 `상위 컴포넌트내 props 를 통해 하위 여러 컴포넌트에 값을 부여` 할 수 있게 된다고 할 수 있다.

### 마무리

state 때도 느꼈겠지만 데이터는 일원화된 상태에서 하나의 방향성을 가지고 관리가 되어야 하며, react 에서는 하향식 데이터 관리를 추구한다.

만약 state 를 통해서 계산을 하고 다른 값을 도출하는 상황이 발견된다면 아마도 해당 값은 state 가 아니고 계산된 결과를 state 로 지정해야 할 것이다.

이처럼 일원화하여 react 내에서 값을 제어하는 것을 추구한다.