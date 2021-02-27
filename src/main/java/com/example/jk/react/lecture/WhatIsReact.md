### 리액트란 무엇인가

랜더는 순수 함수로
- setState 는 한정된 공간에서 (비즈니스 로직을 수행하는 changeHandler) 에서 사용 

state 는 불변 관리
- constructor 에서만 state 를 초기화, 그 후엔 setState 를 통해 해당 변수에서 계속 사용, property 만 바꾼다.

가상 돔
- ReactDom.render 시의 ReactDom 이 그것
- 이전 상태를 메모리 내에서 유지, 후 렌더 시 변경점만을 반영