import { createSlice } from "@reduxjs/toolkit";
import { initialMainTablePagination } from "../../../../../../helpers/helpers";

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
  },
  filterType: null,
  filterData: {},
};

const getListSlice = createSlice({
  name: "ConstantValue",
  initialState,
  reducers: {
    getListStartAction: () => { },
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
    setListFilterType: (state, action) => {
      state.filterType = action.payload.filterType
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
    },
    setTableLoading: (state, action) => {
      state.listBegin = action.payload;
    }
  }
});

// Actions
export const {
  getListStartAction, getListSuccess, getListFail,
  setListPagination, setListFilterType, setFilterData, setListFilter, setMainLoader, setTableLoading
} = getListSlice.actions;

// Reducer
const ConstantValueReducer = getListSlice.reducer;
export default ConstantValueReducer;