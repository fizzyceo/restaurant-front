import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useKitchenStore = create((set, get) => ({
  kitchens: [],
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
  createKitchen: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the kitchen creation request
      const response = await axiosHelper.post("/kitchen/create", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response);

      // Link the kitchen to the user
      // const resp2 = await axiosHelper.post(
      //   `/kitchen/auth`,
      //   { token: response?.token },
      //   { headers: { Authorization: `Bearer ${accessToken}` } }
      // );

      // console.log(resp2);

      // Refresh the list of Kitchens
      await get().getKitchens();

      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getKitchens: async (siteId) => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters));
    // const filtering = {
    //   // search: filterNonFalseValues(filters) || "",
    //   ...filters,

    // };
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });
      let response = await axiosHelper.get("/kitchen", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      set({ kitchens: response, isLoading: false });
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateKitchen: async (id, info) => {
    try {
      console.log("id: ", id, " info: ", info);

      set({ isLoading: true });
      let response = await axiosHelper.patch(`/kitchen/update/${id}`, info);
      console.log(response);

      // console.log(response.data);
      get().getKitchens();
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteKitchen: async (kitchen_id) => {
    try {
      set({ isLoading: true });
      const accessToken = await tokenHelper.getToken();

      let response = await axiosHelper.delete(`/kitchen/${kitchen_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      get().getKitchens();
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
