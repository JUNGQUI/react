### webpack

ESM 형태의 파일들

```javascript
// file1.js
export default function func1() {}
export function func2() {}
export const variable1 = 123;
export let variable2 = 'hello';

// file2.js
import myFunc1, {func2, variable1, variable2} from './file1.js';
// default export 의 경우 기본값이기에 지정 없이 바로 가져와서 별칭 (as) 을 할 수 있다.

// file3.js
import {func2 as myFunc2} from './file1.js';
```

이와 같이 모듈 형식으로 제공을 하는 것을 ESM 이라 볼 수 있다.
문제는 이러한 방식으로 구현 시 어디선가 꼬인다면 문제 발견이 어렵다는 것과 관리가 힘들다는 것이다.

웹팩의 장점으로는

- 코드 분리
  
말 그대로 코드 자체를 분리 시킨다. 위와 같은 ESM 형태를 띄고 있을 경우 필요에 따라 해당 모듈을 로드해서 사용함으로써
단순히 코드만 분리시키는것이 아니라 전체 로직에서도 변화를 줄 수 있다.

- 코드 축소
  
위와 비슷한 맥락인데, 쓸데없이 길어지는 부분을 모듈로 잘게 쪼개기 때문에 커지는 코드가 없어진다.

- 특징 on/off

특정 환경내 테스트 시 해당 기능으로 기능 테스트가 가능하다.  

- HMR
Hot Module Replacement 의 약자로 말 그대로 변경이 감지된 모듈에 대해 즉각적인 대체가 이루어진다.

#### 로더

웹팩에는 로더 라는 기능이 있는데, 빌드 과정에서 코드 컴파일을 처리하는 기능이다. 이 기능이 대표적인 웹팩의 기능 중 하나인
`번들링` 이라고 볼 수 있다.

예를 들자면 webpack.config.js 내에 babel-loader 를 포함시키면 바벨을 사용 할 수 있다.
또한 css-loader 를 사용하면 scss 확장자의 파일들을 적당한 css 파일로 컴파일해준다. 가장 대표적인 웹팩 기능으로 js 들 
또한 main.js 로 하나의 js 로 만들어서 제공해주는 기능이다.

- npm install webpack webpack-cli react react-dom : 필요 모듈 설치
- npx webpack : 웹팩 실행
- 웹팩을 통해 실행 시 react 가 들어있기에 별도 실행 불필요