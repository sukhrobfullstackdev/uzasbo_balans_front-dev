import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sum: 0,
  initialSum: 0,
  paymentScheduleTableData: []
};

const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    setInitialSum: (state, action) => {
      state.sum = state.initialSum + action.payload;
    },
    addSum: (state, action) => {
      state.sum += action.payload;
    },
    subractSum: (state, action) => {
      state.sum -= action.payload;
    },
    setPaymentScheduleTableData: (state, action) => {
      state.paymentScheduleTableData = action.payload;
    },
  }
});

// Actions
export const { addSum, setPaymentScheduleTableData, subractSum, setInitialSum } = contractsSlice.actions;

// Reducer
const contractsReducer = contractsSlice.reducer;
export default contractsReducer;