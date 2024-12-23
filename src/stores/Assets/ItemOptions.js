import { create } from "zustand";
import { axiosHelper, tokenHelper } from "../helpers";
import { filterNonFalseValues } from "../helpers/Utlis";

export const useOptionStore = create((set, get) => ({
  options: [],
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
  createOption: async (id, body) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();
      console.log(body);

      // Post the site creation request
      const response = await axiosHelper.post(
        `/menu-item/${id}/options`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(response);

      await get().getOptions(id);
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  updateOption: async (id, body, idoption) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();
      console.log(body);

      // Post the site creation request
      const response = await axiosHelper.put(
        `/menu-item/${id}/options/${idoption}`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(response);

      await get().getOptions(id);
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteOption: async (id, idoption) => {
    set({ isLoading: true });

    try {
      // Get the access token
      const accessToken = await tokenHelper.getToken();
      // Post the site creation request
      const response = await axiosHelper.delete(
        `/menu-item/${id}/options/${idoption}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log(response);

      await get().getOptions(id);
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },

  getOptions: async (id) => {
    try {
      const accessToken = await tokenHelper.getToken();
      set({ isLoading: true });

      let response = await axiosHelper.get(`/menu-item/${id}/options`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);

      // console.log(response.data);
      set({ options: response, isLoading: false });
    } catch (e) {
      console.log(e);
    } finally {
      set({ isLoading: false });
    }
  },
  //   updateItem: async (id, info) => {
  //    try{
  //     const accessToken = await tokenHelper.getToken();

  //     console.log("id: ",id, " info: ", info );

  //     set({ isLoading: true });
  //     let response = await axiosHelper.patch(`/menu-item/${id}`, info, { headers: { Authorization: `Bearer ${accessToken}` } });
  //     console.log(response);

  //     // console.log(response.data);
  //     get().getOptions();

  //    }catch(e){
  //     console.log(e);

  //     }finally{

  //     set({ isLoading: false });
  //   }
  //   },
  //   deleteItem:async (id)=>{
  //    try{
  //       const accessToken = await tokenHelper.getToken();

  //     set({isLoading:true})
  //     let response = await axiosHelper.delete(`/menu-item/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } });

  //     // console.log(response.data);
  //     get().getItems();

  //    }catch(e){
  //       console.log(e);

  //     }finally{
  //       set({ isLoading: false });

  //     }
  //   },
  setFilters: (filters) => {
    set({ filters: filterNonFalseValues(filters) });
  },
}));
