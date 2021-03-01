### create-react-app

- webpack : library repository
- babel : ECMA6 converter
- jest : test framework
- eslint : coding convention
- polyfill : 바벨이 커버 못하는 부분에 대한 전환
  - Promise, Set, Object.assigin()
- HMR : Hot Module Replacement, 재배포 없이 rendering 을 즉각적으로 처리하기 위함

browserslist : react 관련 설정, 0.2% 이상의 점유율을 가진 브라우저 버전에 대해 대응한다던지 하는 등의 설정이
이곳에 있다.
자세한건 [여기](https://github.com/browserslist/browserslist) 를 통해 확인 가능하다.

- npm start : 개발용 명령어, 최적화를 제외하고 띄우기에 집중
- npm build : 배포용 명령어, 브라우저 최적화까지 감안하고 build
- HTTPS=true npm start : https 를 통해 실행하고자 할때 사용, 뿐만 아니라 여러 옵션을 적용하기 위해서 이 명령어와 같이 사용 가능
- npx server -s build : build directory 를 사용하여 서버처럼 구동

> P.S. 기존 npm install 로 인해 충돌이 발생할 경우
> 
> 1. package-lock.json or yarn.lock 을 삭제
> 2. node-module 삭제 (추가로 안에 dependency 있을 경우 같이 삭제됨)
> 3. npm install or yarn 을 이용해서 package.json 내용 불러오기
> 
> create-react-app 은 로컬에서 설치하여 실행하는 것을 deprecated 시킨다고 한다 따라서 
> npx 를 활용해서 실행해야 하는데 create-react-app 을 기존에 global 로 설치 했을 경우 create-react-app 이 안될 수 있다.
> 
> 이럴 경우 global 로 create-react-app 을 삭제한다.
> 
> 실제 로컬에 떨궈서 실행하는 것이 아닌 저장소에서 데이터를 긁어와서 build 를 하는것 이라고 볼 수 있는데
> 
> - npx create-react-app CRA_PROJECT_NAME
> 
> 이렇게 실행이 가능하다.

### test

- npm test : `*.test.js`, 혹은 `*.spec.js` 혹은 `__tests__` directory 밑에 

### eject

- npm eject : CRA 설정을 파일로 가져와서 CRA 가 아닌 손수 구현을 하고자 할 때 필요 (사실 안쓰임)

### env (환경변수)

서버사이드에서 사용하듯이 환경변수를 설정해서 사용이 가능한데 process.env...으로 접근이 가능하다.

```javascript
console.log(process.env.NODE_ENV);
/**
 * 실행에 따라 process.env.NODE_ENV 의 값 변화
 * npm start : development
 * npm test : test
 * npm run build : production
 **/
```

REACT_APP_... 으로 시작하는 리액트 환경변수에 대해 커스텀으로 활용이 가능하다.

```javascript
console.log(process.env.REACT_APP_CUSTOM_ENV);  // CUSTOM_ENVIRONMENT_DEVELOPMENT
```

위와 같이 접근하려 할 때 환경 변수 파일을 통해 설정이 가능한데

```
// .env.development file 내용
REACT_APP_CUSTOM_ENV=CUSTOM_ENVIRONMENT_DEVELOPMENT
```