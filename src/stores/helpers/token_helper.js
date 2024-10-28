import { getCookie } from "../../helpers/cookies";
import { decrypt } from "../../helpers/sessions";

export const tokenHelper = {
  setToken: (accessToken) => {
    localStorage.setItem("AccessToken", accessToken);
  },
  getToken: async () => {
    const session = getCookie("session");
    const payload = await decrypt(session);

    const x = localStorage.getItem("AccessToken");

    return payload?.accessToken;
  },

  removeToken: (key) => {
    return localStorage.removeItem("AccessToken");
  },
  setUser: (user) => {
    let test = {
      email: "email",
      password: "password",
    };
    localStorage.setItem("user", JSON.stringify(test));
  },
  getUser: async () => {
    const session = getCookie("session");
    const payload = await decrypt(session);

    return payload?.user;
  },

  removeUser: (key) => {
    return localStorage.removeItem("user");
  },
};
