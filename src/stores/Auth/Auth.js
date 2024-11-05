import { create } from "zustand";
import { SignJWT, jwtVerify } from "jose";
import { axiosHelper, tokenHelper } from "../helpers";
import { setCookie, getCookie, removeCookie } from "../../helpers/cookies"; // Adjust the path
import { encrypt } from "../../helpers/sessions";

// Secret key and key encoding
const secretKey = "basseer-internship";
const key = new TextEncoder().encode(secretKey);

export const useAuth = create((set) => ({
  user: tokenHelper.getUser(),
  accessToken: tokenHelper.getToken(),
  isLoading: null,
  error: null,
  errorMsg: null,

  login: (data, router) => {
    set({ isLoading: true, errorMsg: null });

    axiosHelper
      .post("/user/auth/login", JSON.stringify(data))
      .then((response) => {
        // Extract the accessToken from the response
        const { accessToken } = response;

        // If the accessToken is missing or invalid, handle it
        if (!accessToken) {
          throw new Error("Invalid response from authentication");
        }

        // Make the second request with the accessToken
        return axiosHelper
          .get("/user/infos", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response2) => {
            // Print the accessToken and response2 for debugging
            if (
              response2.role?.toUpperCase() === "USER" ||
              response2.role?.toUpperCase() === "NORMAL_USER"
            ) {
              set({ errorMsg: "Not Allowed" });
              return;
            }
            // Calculate the expiration date
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            // Encrypt the session data
            return encrypt({
              accessToken: response.accessToken,
              expiresAt,
              user: response2,
            }).then((session) => {
              // Set the token
              tokenHelper.setToken(accessToken);

              // Set the session cookie
              setCookie("session", session, {
                expires: expiresAt,
                secure: true,
                sameSite: "lax",
              });

              // Navigate after login
              navigateAfterLogin(null, router);
            });
          });
      })
      .catch((error) => {
        // Handle any errors that occurred during the requests
        console.log(error.status, error.message);
        set({ errorMsg: "Invalid Credentials" });
      })
      .finally(() => {
        // Update the loading state
        set({ isLoading: false });
      });
  },

  logout: () => {
    removeCookie("session");
    tokenHelper.removeToken();
    tokenHelper.removeUser();
  },

  resetPassword: async (newPassword, router) => {
    try {
      set({ isLoading: true });
      const response = await axiosHelper.put("/auth/system/reset-password", {
        password: newPassword,
      });
      if (response.result) {
        set((state) => ({
          ...state,
          user: { ...state.user, tempPassword: false },
        }));
        router.navigate("/");
      }
    } catch (error) {
      console.log(error);
      // router.navigate("/login");
    } finally {
      set({ isLoading: false });
    }
  },
}));

const navigateAfterLogin = (tempPassword, router) => {
  console.log(router);

  router.navigate("/");
};
