import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useSpaceStore = create((set, get) => ({
  spaces: [],
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
  createSpace: async (siteID, body, kitchenID, menuID) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();
      console.log(siteID, body);

      // Post the site creation request
      const response = await axiosHelper.post(`/site/${siteID}/spaces`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      //linken the space to the kitchen
      const response2 = await axiosHelper.post(
        `/kitchen/${kitchenID}/link-space/${response.space_id}`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const response3 = await axiosHelper.patch(
        `/menu/${menuID}/link-space/${response.space_id}`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log(response);

      // Refresh the list of spaces
      await get().getSpaces(siteID);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getSpaces: async (siteID) => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters));
    // const filtering = {
    //   // search: filterNonFalseValues(filters) || "",
    //   ...filters,

    // };
    try {
      set({ isLoading: true });

      if (!siteID) {
        set({ spaces: [], isLoading: false });
        return;
      }
      const accessToken = await tokenHelper.getToken();
      let response = await axiosHelper.get(`/site/${siteID}/spaces`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      set({ spaces: response, isLoading: false });
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
      get().getspaces();
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteSpace: async (space_id) => {
    try {
      set({ isLoading: true });
      let response = await axiosHelper.delete(`/space/${space_id}`);

      // console.log(response.data);
      get().getspaces();
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
