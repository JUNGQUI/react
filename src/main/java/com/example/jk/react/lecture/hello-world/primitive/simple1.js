function LikeButton() {
  // setSTATE 의 경우 관용적인 표현이다.
  const [liked, yahooLiked] = React.useState(false);
  const text = liked ? '좋아요 취소' : '좋아요';

  return React.createElement(
      'button'
      , {onClick : () => yahooLiked(!liked)}
      , text
  )
}

const domContainer = document.getElementById('root');

// primitive
const primitiveDomContainer1 = document.getElementById('rootPrimitive1');
const primitiveDomContainer2 = document.getElementById('rootPrimitive2');
const primitiveDomContainer3 = document.getElementById('rootPrimitive3');

ReactDOM.render(React.createElement(LikeButton), primitiveDomContainer1);
ReactDOM.render(React.createElement(LikeButton), primitiveDomContainer2);
ReactDOM.render(React.createElement(LikeButton), primitiveDomContainer3);


// reactive
const reactiveDomContainer = document.getElementById('rootReact');

ReactDOM.render(
    React.createElement(
        'div'
        , null
        , React.createElement(LikeButton)
        , React.createElement(LikeButton)
        , React.createElement(LikeButton)
    ), reactiveDomContainer);

ReactDOM.render(React.createElement(LikeButton), domContainer);

/**
 * createElement(생성 할 HTML DOM TAG, appending 할 객체, ...children)
 *
 * <div>
 *   <p>hello</p>
 *   <p>world</p>
 * </div>
 *
 * ->
 *
 * React.createElement('div'
 * , null
 * , React.createElement('p', null, 'hello')
 * , React.createElement('p', null, 'world')
 * )
 */
