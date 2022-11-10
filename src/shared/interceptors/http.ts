import fetchIntercept from 'fetch-intercept';

export const AuthInterceptor = () => {
  fetchIntercept.register({
    request: function (url, config) {
      debugger;
      if(config)
      {
        const cUser = localStorage.getItem('user');
        let parsedUser = cUser ? JSON.parse(cUser) : '';

        if(parsedUser && parsedUser.token)
          config.headers.authorization = `Bearer ${parsedUser.token}`;
        console.log(config);
      }
      return [url, config];
    },
  });
};