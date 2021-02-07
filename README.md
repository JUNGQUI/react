# react

react 연습 project

## setting

- brew install node(npm 같이 진행)
- brew install yarn --ignore-dependencies (node를 설치했기에 yarn 진행 시 옵션을 통해 제외)

big sur 내에서 권한 이슈로 인해 node link 가 안될 경우가 있다.

- sudo chown -R `whoami`:admin /usr/local/include/node
- sudo chown -R `whoami`:admin /usr/local/bin
- sudo chown -R `whoami`:admin /usr/local/share
- sudo chown -R `whoami`:admin /usr/local/lib/dtrace

이후에

- brew link --overwrite node

실행 시 node 인식 정상적으로 된다.

### npm

Node Package Management 약어로, 노드 패키지들을 관리해주는 모듈이다.
쉽게 maven repository 와 같다고 생각하면 편하다.

### yarn

2016년 페이스북, 구글 등이 만든 npm 의 일종이다. 속도는 빠르고 보안적인 이슈도 npm 에 비해 적다고 한다.

---
# TODO

### ECMA6

- const
- let

### start

- create-react-app