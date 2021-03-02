const commentFactory = (user, content, post) => {
  const time = new Date().getTime();
  return (
    {
      content: content,
      likes: 0,
      timestamp: time,
      user: user,
      post: post
    }
  )

};

export default commentFactory;