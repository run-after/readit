const userFactory = (displayName, email) => {
  return ({
    displayName: displayName,
    email: email,
    groups: [],
    likes: [],
    hates: []
  });
};

export default userFactory;