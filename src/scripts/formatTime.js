const formatTime = (time) => {

  if (time > 2629800000) {
    return `${Math.floor(time / 2629800000)} months ago`;
  }else if (time > 86400000) {
    return `${Math.floor(time / 86400000)} day(s) ago`
  }else if (time > 3600000) {
    return `${Math.floor(time / 3600000)} hrs ago`
  }else if (time > 60000) {
    return `${Math.floor(time / 60000)} min ago`
  } else {
    return 'Just now'
  }

};

export default formatTime;