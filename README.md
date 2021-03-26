# Readit - A Reddit clone

<img src='https://github.com/run-after/readit/blob/main/src/media/screenshot.png' alt='readit' width='100%' />
  
- **Built with ReactJS**
- **Utilized Firebase Storage for image storage**
- **Utilized Fireauth for log-in with email**
- **Utilized Firebase for storage of posts, comments, users, and groups**
- **Custom CSS**

This app works a lot like Reddit.

A user can sign up with an email. The email and username is checked against the DB. If both are unique, it creates an account.

After signing up, the user can join groups, create their own group, like posts, like comments, upload picture posts, and upload an avatar photo.

Built using React functional components.

Uses React Router Dom for routing.

Deployed on Netlify.

The hardest part of this project was sorting out the DB schema. There are a lot of moving parts... Keeping track of users, users avatars, users posts, users comments, users likes/hates, group subscriptions and then displaying all that data in the right spots and making sure to not use any anti-patterns and not too many calls the the DB was challenging, but a lot of fun.

[View live](https://readitapp.netlify.app/): https://readitapp.netlify.app/
