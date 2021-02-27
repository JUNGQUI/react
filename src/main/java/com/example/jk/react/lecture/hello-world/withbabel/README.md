바벨 설치

npm init -y : package.json 초기화 

npm install @babel/core @babel/cli @babel/preset-react

- @babel/core           : 코어
- @babel/cli            : 바벨 cli 활성화
- @babel/preset-react   : 바벨을 이용해 변환 시 preset (기준)

npx babel --watch src --out-dir . --presets @babel/preset-react

- --watch : 해당하는 디렉토리를 바라보며 해당 디렉토리 내 소스 변경 시 자동 바벨 실행
- --out-dir : 해당하는 디렉토리로 output 이 생성
- --presets : 어떤 기준으로 바벨을 돌릴 지 결정