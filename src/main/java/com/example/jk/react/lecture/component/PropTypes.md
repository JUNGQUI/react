### PropTypes?

[앞서](ComponentKnowHow.md) 언급했던 첫번째 규칙의 속성 값이 바로 이 값이 되겠다.

속성값?

컴포넌트 내부에서 쓰는 속성값을 의미하는데, 위의 1번 요소처럼 문서 초기에 작성에서 컴포넌트에서 실제로 쓰이는 변수를 선언해준다고 생각하면 된다.

```javascript
User.propTypes = {
  male: PropTypes.bool.isRequired,
  age: PropTypes.number,
  type: PropTypes.oneOf(['gold', 'silver', 'bronze']),
  onChangeName: PropTypes.func,
  onChangeTitle: PropTypes.func.isRequired
}

export default function User({male, age, type, onChangeName, onChangeTitle}) {
  // ...
}
```