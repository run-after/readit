const postFactory = (user, title, content, group) => {
  const time = new Date().getTime();
  return (
    {
      content: content,
      group: group,
      likes: 0,
      timestamp: time,
      title: title,
      user: user
    }
  )

};

export default postFactory;