import { create } from "zustand";
import { axiosHelper, tokenHelper } from "./helpers";
import { filterNonFalseValues } from "./helpers/Utlis";

export const useOrderStore = create((set, get) => ({
  orders: [],
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
  createOrder: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.post("/order/create", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log(response);

      //   // Link the site to the user
      //   await axiosHelper.patch(
      //     `/user/link-site?siteId=${response.site_id}`,
      //     { },
      //     { headers: { Authorization: `Bearer ${accessToken}` } }
      //   );

      //   // Refresh the list of sites
      await get().getOrders();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getOrders: async (filters) => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters));
    // const filtering = {
    //   // search: filterNonFalseValues(filters) || "",
    //   ...filters,

    // };
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });
      let response = await axiosHelper.get("/order", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      set({ orders: response, isLoading: false });
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateOrder: async (id, info) => {
    try {
      console.log("id: ", id, " info: ", info);
      const accessToken = await tokenHelper.getToken();

      set({ isLoading: true });
      let response = await axiosHelper.patch(`/order/${id}`, info, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);

      // console.log(response.data);
      get().getOrders();
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteOrder: async (menuId) => {
    try {
      set({ isLoading: true });
      const accessToken = await tokenHelper.getToken();

      let response = await axiosHelper.delete(`/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      get().getOrders();
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
