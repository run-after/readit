const postFactory = (user, title, content, group, image) => {
  const time = new Date().getTime();
  return (
    {
      content: content,
      group: group,
      likes: 0,
      timestamp: time,
      title: title,
      user: user,
      image: image
    }
  )

};

export default postFactory;