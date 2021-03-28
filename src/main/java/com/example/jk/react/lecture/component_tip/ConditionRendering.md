### 조건부 렌더링

조건부 렌더링은 [앞서](../../ConditionRendering.md) 이야기 했듯 조건에 따라 다른 화면을 렌더링 하는걸 의미하는데, 
가독성을 높히기 위해 코드가 너무 간략화 되는걸 막고자 아래와 같이 구현하는 것을 추천한다.

```
{CONDITION ? SOME_ELEMENT : NULL}
-> 
{CONDITION && SOME_ELEMENT}
```

또한 렌더링 자체가 조건에 걸리는 것이 아니라 렌더링 될 때 조건에 따라 다른 화면을 출력해야 한다면

```
{CONDITION ? SOME_ELEMENT : OTHER_ELEMENT}
-> 
{CONDITION && SOME_ELEMENT}
{!CONDITION && OTHER_CONDITION && OTHER_ELEMENT}
```

이와 같이 구현을 하는것이 좋다.

분명 불필요하게도 if-else 형식을 취하는게 코드 간략화에 도움이 되겠지만 오히려 컴포넌트 내 여러 jsx element 가 중첩으로 저런 구조를
가지고 있다면 과도한 if-else 는 오히려 가독성을 방해한다.

따라서 최초에 위에서 두번째 jsx element 는 `CONDITION` 을 만족하지 **않으면서** `OTHER_CONDITION` 을 만족하는 형식임을
해당 statement 만을 보고 판단이 가능하게 하는게 좋다.

> jsx 에서 &&, || 연산자
> 
> jsx에서 && 와 || 는 조건에 대한 and, or 이자 값을 반환하는 장치 역할도 수행하고 있다.
> 
> 아래 코드를 보자.
> 
> ```javascript
> const v1 = 'ab' && 0; // 0
> const v2 = 'ab' && 1 && ''; // ''
> const v3 = 'ab' || 0; // 'ab'
> const v4 = '' || 0 || 'cd'; // cd
> ```
> 
> && 연산자는 정확히 이야기 하면 false 를 만날 경우 그 값을 조건이 아닌 값으로 return 을 하게 되고
> 
> || 연산자의 경우 가장 처음의 true 값을 return 하게 된다.
> 
> 그렇기에 {CONDITION && JSX_ELEMENT} 의 경우에 만약 CONDITION 이 false 라면 {false} 와 동일한 효과이고 jsx 에서 false 를
> 렌더링 할 경우 아무 렌더링이 진행되지 않기에
> 
> {CONDITION ? JSX_ELEMENT : null} 과 동일하게 되는 것이다.

조건부 렌더링 시 주의해야 할 점이 하나 있는데, state 의 값을 통해 `값이 있을경우` 를 state 로 보통 사용하는데 
이 때, 해당하는 state 를 명확하게 boolean 으로 명시해주지 않을 경우 값이 렌더링이 될 수 있다.

```javascript
{cash && `이것의 값은 ${cash} 입니다.`}
```

위 코드의 경우 cash 가 값이 0일 경우 false 로 판단해서 출력되기를 바라지만 실제론 `{0}` 과 같은 구조가 될 수 있다.

그리고 당연하게도 jsx 에 0 은 렌더링이 되는 대상이기에 실제 출력 시 출력이 안되는 것이 아니라 0 이 출력 될 수 있다.

이러한 점을 방지하기 위해 확실한 boolean 형으로 정의를 해줘야 한다.

```javascript
{!!cash && `이것의 값은 ${cash} 입니다.`}
```

혹은, 0일 때 0이다 라고 표현을 하고 싶을 때도 있는데 이럴 경우엔

```javascript
{cash !== null && `이것의 값은 ${cash} 입니다.`}
```

와 같이 구현도 가능하다.