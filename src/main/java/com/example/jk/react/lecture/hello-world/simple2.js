function LikeButton() {
  const [liked, setLiked] = React.useState(false);
  const text = liked ? '좋아요 취소' : '좋아요';

  return React.createElement(
      'button'
      , {onClick : () => setLiked(!liked)}
      , text
  )
}

function Container() {
  const [count, setCount] = React.useState(0);


}