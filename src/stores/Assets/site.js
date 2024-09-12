import { create } from "zustand";
import { axiosHelper } from "../helpers";
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
  createSite: async (body)=>{

    try {
      set({ isLoading: true });
      let response = await axiosHelper.post("/site/create",body);
      console.log(response);
      if (response.status !== 200) {
        return;
      }
      // console.log(response.data);
      console.log(response.data);
      set({ sites: response.data, isLoading: false });
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
      set({ isLoading: true });
      let response = await axiosHelper.get("/site");
      console.log(response);
      if (response.status !== 200) {
        return;
      }
      // console.log(response.data);
      console.log(response.data);
      set({ sites: response.data, isLoading: false });
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  EditSite: async (id, info) => {
    set({ isLoading: true });
    let response = await axiosHelper.post("/system/company/get", {
      id: id,
      info: info,
    });
    console.log(response);
    if (!response.result) {
      return;
    }
    // console.log(response.data);
    get().getSites();

    set({ isLoading: false });
  },

  setFilters: (filters) => {
    set({ filters: filterNonFalseValues(filters) });
  },
}));
