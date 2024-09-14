export const tokenHelper = {
  setToken: (accessToken) => {
    localStorage.setItem("AccessToken", accessToken);
  },
  getToken: () => {
    const x = localStorage.getItem("AccessToken");
    
    return localStorage.getItem("AccessToken");
  },

  removeToken: (key) => {
    return localStorage.removeItem("AccessToken");
  },
  setUser: (user) => {
    let test = {
      email:"email",
      password:"password"
    }
    localStorage.setItem("user", JSON.stringify(test));
  },
  getUser: () => {
    let test = {
      email:"email",
      password:"password"
    }
return test
    // return JSON.parse(localStorage.getItem("user") || "{}") ;
  },

  removeUser: (key) => {
    return localStorage.removeItem("user");
  },
};
