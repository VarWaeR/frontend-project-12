const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  signUpPath: () => [apiPath, 'signup'].join('/'),
  main: () => '/',
  login: () => 'login',
  error: () => '*',
  signup: () => 'signup',
};

export default routes;