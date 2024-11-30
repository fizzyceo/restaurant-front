import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useMenuItemsStore = create((set, get) => ({
  items: [],
  isLoading: false,
  isError: false,
  error: undefined,
  currency: "",
  image_url: "",
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
  createItem: async (menuid, body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.post("/menu-item", body, {
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
      await get().getItems(menuid);
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  getItems: async (menuId) => {
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });
      console.log(menuId);

      let response = await axiosHelper.get(`/v2/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({
        currency: response.data.currency,
        image_url: response.data.image_url,
        items: response.data.menu_items,
        isLoading: false,
      });
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateItem: async (menuid, id, info) => {
    try {
      const accessToken = await tokenHelper.getToken();

      set({ isLoading: true });
      let response = await axiosHelper.patch(`/menu-item/${id}`, info, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);

      // console.log(response.data);
      get().getItems(menuid);
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteItem: async (menuid, id) => {
    try {
      const accessToken = await tokenHelper.getToken();
      console.log("menuId:", menuid, "id: ", id);

      set({ isLoading: true });
      let response = await axiosHelper.delete(`/menu-item/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      get().getItems(menuid);
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
