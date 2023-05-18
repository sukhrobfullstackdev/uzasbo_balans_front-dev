import { createSlice } from "@reduxjs/toolkit";
import { initialMainTableDate, initialMainTablePagination } from "../../../../../helpers/helpers";

const initialState = {
  listBegin: false,
  listSuccess: false,
  listSuccessData: {},
  listFailData: {},
  listFail: false,
  paginationData: {
    ...initialMainTablePagination,
    OrderType: null,
    SortColumn: null,
    ...initialMainTableDate
  },
  filterData: {
    ...initialMainTableDate
  },
};

const getListSlice = createSlice({
  name: "inventoryHoldingCardGetList",
  initialState,
  reducers: {
    getListStartAction: () => { },
    setLoading: (state, action) => {
      state.listBegin = action.payload;
    },
    getListSuccess: (state, action) => {
      state.listBegin = false;
      state.listSuccess = true;
      state.listSuccessData = action.payload;
      state.listFail = false;
    },
    setListPagination: (state, action) => {
      state.listBegin = true;
      state.paginationData = {
        ...state.paginationData,
        PageNumber: action.payload?.PageNumber ? action.payload.PageNumber : initialState.paginationData.PageNumber,
        PageLimit: action.payload?.PageLimit ? action.payload.PageLimit : initialState.paginationData.PageLimit,
        OrderType: action.payload?.OrderType,
        SortColumn: action.payload?.SortColumn,
      }
    },
    setListFilter: (state, action) => {
      state.listBegin = true;
      state.filterData = action.payload
      state.paginationData = initialMainTablePagination
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    getListFail: (state, action) => {
      state.listBegin = false;
      state.listSuccess = false;
      state.listSuccessData = [];
      state.listFailData = action.payload;
      state.listFail = true;
    }
  }
});

// Actions
export const {
  getListStartAction, getListSuccess, getListFail,
  setListPagination, setFilterData, setListFilter, setLoading
} = getListSlice.actions;

// Reducer
const inventoryHoldingCardGetListReducer = getListSlice.reducer;
export default inventoryHoldingCardGetListReducer;