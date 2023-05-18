import { createSlice } from "@reduxjs/toolkit";
import { initialMainTableDate, initialMainTablePagination } from "../../../../../../helpers/helpers";

const initialState = {
  listBegin: true,
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
  filterType: null,
  filterData: {
    ...initialMainTableDate
  },
};

const getListSlice = createSlice({
  name: "OrganizationsSettlementAccount",
  initialState,
  reducers: {
    getListStartAction: () => {
      // state.listBegin = true;
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
  setListPagination, setListFilterType, setFilterData, setListFilter, setTableLoading
} = getListSlice.actions;

// Reducer
const subAccReducer = getListSlice.reducer;
export default subAccReducer;