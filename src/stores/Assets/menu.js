import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useMenuStore = create((set, get) => ({
  menus: [],
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
  createMenu: async (body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();

      // Post the site creation request
      const response = await axiosHelper.post("/menu/create", body, {
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
      await get().getMenus();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getMenus: async (filters) => {
    // set({ filters: filterNonFalseValues(filters) });
    // console.log(filterNonFalseValues(filters));
    // const filtering = {
    //   // search: filterNonFalseValues(filters) || "",
    //   ...filters,

    // };
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });
      let response = await axiosHelper.get("/menu/list/a", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      set({ menus: response, isLoading: false });
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateMenu: async (id, info) => {
    try {
      console.log("id: ", id, " info: ", info);
      const accessToken = await tokenHelper.getToken();

      set({ isLoading: true });
      let response = await axiosHelper.patch(`/menu/${id}`, info, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);

      // console.log(response.data);
      get().getMenus();
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteMenu: async (menuId) => {
    try {
      set({ isLoading: true });
      const accessToken = await tokenHelper.getToken();

      let response = await axiosHelper.delete(`/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // console.log(response.data);
      get().getMenus();
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
