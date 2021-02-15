### Component

앞서 말했듯이 마크업과 로직이 합쳐져 컴포넌트로 관리되는게 react 의 핵심이라 할 수 있다.

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
    element,
    document.getElementById('root')
);
```

function 으로써 Welcome 을 정의 하고 마크업을 만들어서 rendering 할 경우 컴포넌트가 
h1 태그로 전달받은 property 에서 name 을 가져와 마크업을 완성시켜 rendering 하게 된다.

> 주의
> 
> 컴포넌트는 대문자로 시작한다. 예를 들어 div 태그는 html 태그이지만, Welcome 태그는 컴포넌트로써 작동한다.

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

컴포넌트를 통해 각 컴포넌트를 합성하여 rendering 이 가능하다.

위 코드를 보면 Welcome 을 통해 컴포넌트 를 다수 만들고 그걸 하나의 div 태그로 만든것을 App 이라는 컴포넌트에서 return 한다.

당연하게도, 이와 같은 특성을 이용해서 추출도 가능하다.

```javascript
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

이와 같은 복잡한 컴포넌트가 있을 때

```javascript
function Avatar(props) {
  return (
      <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
      />
  );
}

function UserInfo(props) {
  return (<div className="UserInfo">
    <Avatar user={props.user}/>
    <div className="UserInfo-name">
      {props.author.name}
    </div>
  </div>);
}

function Comment(props) {
  return (
      <div className="Comment">
        <UserInfo user={props.author}/>
        <div className="Comment-text">
          {props.text}
        </div>
        <div className="Comment-date">
          {formatDate(props.date)}
        </div>
      </div>
  );
}
```

이런식으로 추출하여 사용이 가능하다.

최종적으로는

```javascript
function formatDate(date) {
  return date.toLocaleDateString();
}

function Avatar(props) {
  return (
    <img
      className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}

function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">{props.user.name}</div>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">{props.text}</div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

const comment = {
  date: new Date(),
  text: 'I hope you enjoy learning React!',
  author: {
    name: 'Hello Kitty',
    avatarUrl: 'https://placekitten.com/g/64/64',
  },
};

ReactDOM.render(
  <Comment
    date={comment.date}
    text={comment.text}
    author={comment.author}
  />,
  document.getElementById('root')
);
```

이와 같은 형태를 띄게 된다.