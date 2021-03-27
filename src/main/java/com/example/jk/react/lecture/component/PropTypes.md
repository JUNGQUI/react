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

이와 같이 선언해주고 실제 컴포넌트를 사용하는 부분에서 사용 시

```javascript
// ...
<User male={/**/} /*...*/ >
</User>
// ...
```

이와 같이 사용 시 컴포넌트에 대응되는 값을 넣어주면 된다.

사실 컴포넌트와 최초 선언 시 값을 입력해주면 오히려 더 편한게, 어차피 컴포넌트 선언 시 필요한 파라미터는 받는 쪽에 정의를 해줘야 하기에
propTypes 를 초반에 정의 하는게 더 귀찮을 수 있다. 하지만 두가지 장점때문에 많이 쓰이는데

1. 필수 값 및 값 타입 제어
   
javascript 특성상 값의 정확한 타입 체크가 불편한 점이 있는데, propTypes 를 정의 하면 이런 부분에 대해 validation 이 가능하다.

추가적으로 필수값에 대한 제어도 가능하기에 훌륭한 parameter level validation 역할을 수행한다.

2. 훌륭한 스펙문서

컴포넌트의 특성상 모듈단위로 쪼개져있을 경우가 많은데 이럴 경우 많은 양의 컴포넌트 사용 및 개발 시 해당 컴포넌트에서 파라미터가 어떤 역할을 하는지
모호해질 경우가 왕왕 있다.

이때 propTypes 를 통해 필요한 파라미터를 정의하고 주석등을 이용해 부연설명을 추가한다면 이 자체로 훌륭한 spec doc 이 된다.