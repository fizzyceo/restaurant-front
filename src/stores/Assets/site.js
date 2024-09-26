import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useSiteStore = create((set, get) => ({
  sites: [],
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
  createSite: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.post("/site/create", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response);

      // Link the site to the user
      await axiosHelper.patch(
        `/user/link-site?siteId=${response.site_id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Refresh the list of sites
      await get().getSites();
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  getSites: async (filters) => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters));
    // const filtering = {
    //   // search: filterNonFalseValues(filters) || "",
    //   ...filters,

    // };
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });
      let response = await axiosHelper.get("/user/sites", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      set({ sites: response, isLoading: false });
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateSite: async (id, info) => {
    try {
      console.log("id: ", id, " info: ", info);

      set({ isLoading: true });
      let response = await axiosHelper.patch(`/site/${id}`, info);
      console.log(response);

      // console.log(response.data);
      get().getSites();
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteSite: async (site_id) => {
    try {
      set({ isLoading: true });
      let response = await axiosHelper.delete(`/site/${site_id}`);

      // console.log(response.data);
      get().getSites();
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
