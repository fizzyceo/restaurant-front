import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useLinksStore = create((set, get) => ({
  links: [],
  isLoading: false,
  isError: false,
  error: undefined,
  filters: {
    code: "",
    DestProv: "",
    dateFrom: "",
    dateTo: "",
    access: "",
    driverId: "",
    charger: false,
  },
  // Methods
  createLink: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.post("/user/link-space2", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response);
      await get().getLinks();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  removeLink: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.post("/user/unlink-space2", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response);
      await get().getLinks();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getLinks: async (filters) => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters));
    // const filtering = {
    //   // search: filterNonFalseValues(filters) || "",
    //   ...filters,

    // };
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });
      let response = await axiosHelper.get("/user/get-all-space-links", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      set({ links: response, isLoading: false });
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters: filterNonFalseValues(filters) });
  },
}));
