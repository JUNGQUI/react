### Life Cycle

state 설명 중 언급했듯이 react 생명 주기는 [여기](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) 를 보면 잘 알 수 있다.

생성될 당시엔

1. constructor
2. 변화 감지 함수(비주류)
3. render
4. componentDidmount

업데이트 당시엔

1. 변화 감지 함수(비주류)
2. render
3. componentWillUpdate

해제 당시엔

1. componentWillUnmount


#### 생성

1. constructor
   - 최초 mount 후 props, state 를 주입해주기 위함
2. 변화 감지 함수(비주류)
   - 변화 감지 후 이후 method 에 true or Value 를 주어 변화 유도
3. render
   - 변화된 JSX 를 virtual DOM 인 reactDom 에 rendering
4. componentDidmount
   - 해당 컴포넌트에 이벤트 등록

#### 업데이트

1. 변화 감지 함수(비주류)
   - 상동
2. render
   - 상동
3. componentWillUpdate
   - 상동

#### 해제

1. componentWillUnmount
   - 해제 시 수행할 로직 수행