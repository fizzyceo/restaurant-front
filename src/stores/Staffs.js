import { create } from "zustand";
import { axiosHelper, tokenHelper } from "./helpers";
// import { filterNonFalseValues } from "./helpers/Utlis";

export const useStaffStore = create((set, get) => ({
  staffs: [],
  users: [],
  isLoading: false,
  isError: false,
  error: undefined,
  filters: null,
  // Methods
  getStaffs: async () => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters))
    const body = {
      // search: filterNonFalseValues(filters)?.search,
      // sortDirection: "desc",
      // sortField: "createdAt",
      // dateFrom: "",
      // dateTo: "",
      // page: filters?.page || 1,
      // limit: filters?.limit || 10,
    };

    try {
      set({ isLoading: true });
      let response = await axiosHelper.post(
        "/system/manage-staff/get/staffs",
        body
      );

      if (!response.result) {
        return;
      }
      // console.log(response.data);

      set({ staffs: response.data, isLoading: false });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllUsers: async () => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.get("/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({ users: response });
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (userId, body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();
      console.log(accessToken);

      // Post the site creation request
      const response = await axiosHelper.patch(`/user/update/${userId}`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);
      get().getAllUsers();

      // set({ users: response });
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  addUser: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();
      console.log(accessToken);

      // Post the site creation request
      const response = await axiosHelper.post(`/user/create`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);
      get().getAllUsers();

      // set({ users: response });
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (userId) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.delete(`/user/delete/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      get().getAllUsers();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
