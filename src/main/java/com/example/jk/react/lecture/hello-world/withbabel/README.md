### Babel

문법을 지원하지 않는 브라우저에 대해 react 를 지원하기 위해 존재하는 트랜스파일링 툴이다.

초기에는 6to5 라고 ECMA6 -> ECMA5 로의 변환을 지원해서 이렇게 불리었는데 이제는 ECMA 플랫폼과 JSX -> 순수 리액트
트랜스파일링을 지원하게 되었다.

> 프리셋
> 어떤 문법으로 변환할지를 지정하는 파일이다.
> `babel-preset-es2015` : ES2015(ECMA6) -> ES5
> `babel-preset-es2016` : ES2016 -> ES2015
> 
> 이와 같이 프리셋을 지정함으로써 어떠한 문법에서 어떠한 문법으로 변환할 것인지를 정할 수 있다.

### 바벨 설치

npm init -y : package.json 초기화 

npm install @babel/core @babel/cli @babel/preset-react

- @babel/core           : 코어
- @babel/cli            : 바벨 cli 활성화
- @babel/preset-react   : 바벨을 이용해 변환 시 preset (기준)

npx babel --watch src --out-dir . --presets @babel/preset-react

- --watch : 해당하는 디렉토리를 바라보며 해당 디렉토리 내 소스 변경 시 자동 바벨 실행
- --out-dir : 해당하는 디렉토리로 output 이 생성
- --presets : 어떤 기준으로 바벨을 돌릴 지 결정

이와 같은 방식으로 이 프로젝트에서는

babel -> src read -> package json 및 script 를 통해 react load -> ECMA6 로 적용 

의 방식으로 실행된다.