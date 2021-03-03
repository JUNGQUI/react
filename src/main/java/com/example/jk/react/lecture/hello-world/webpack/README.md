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

- npm install webpack webpack-cli react react-dom : 필요 모듈 설치
- npx webpack : 웹팩 실행
- 웹팩을 통해 실행 시 react 가 들어있기에 별도 실행 불필요