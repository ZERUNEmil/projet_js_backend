const createSession = (req, email, token) => {
  req.session.email = email;
  req.session.token = token;
};

module.exports = { createSession };
