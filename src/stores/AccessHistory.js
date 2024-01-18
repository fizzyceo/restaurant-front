import { create } from "zustand";
import { axiosHelper } from "./helpers";
import { filterNonFalseValues } from "./helpers/Utlis";

export const useAccessHistoryStore = create((set, get) => ({
  history: [],
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
  getAccessHistory: async (filters) => {
    set({ filters: filterNonFalseValues(filters) });
    console.log(filterNonFalseValues(filters));
    const body = {
      // search: filterNonFalseValues(filters) || "",
      ...filters,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      sortDirection: "desc",
    };
    console.log(body);
    set({ isLoading: true });
    let response = await axiosHelper.post("/system/accessHistory/get", body);
    console.log(response);
    if (!response.result) {
      return;
    }
    // console.log(response.data);
    console.log(response.data);
    set({ history: response.data, isLoading: false });

    set({ isLoading: false });
    return response.data;
  },
  editHistory: async (id, body) => {
    console.log(body);
    set({ isLoading: true });
    let response = await axiosHelper.put(
      `/system/accessHistory/update/${id}`,
      body
    );
    console.log(response);
    if (!response.result) {
      return;
    }
    get().getAccessHistory();
    // console.log(response.data);
    console.log(response.result);
    set({ isLoading: false });
    return response.result;
  },
  CreateHistory: async (body) => {
    console.log(body);
    set({ isLoading: true });
    let response = await axiosHelper.post(`/system/accessHistory/create`, body);
    console.log(response);
    if (!response.result) {
      return;
    }
    get().getAccessHistory();
    // console.log(response.data);
    console.log(response.data);

    set({ isLoading: false });
    return response.result;
  },
  setFilters: (filters) => {
    set({ filters: filterNonFalseValues(filters) });
  },
  deleteHistory: async (historyId) => {
    set({ isLoading: true });

    let res = await axiosHelper.delete(
      `/system/accessHistory/delete/${historyId}`
    );
    set(
      (state) =>
        (state.history = state.history.filter(
          (history) => history._id !== historyId
        ))
    );
    set({ isLoading: false });
  },
}));
