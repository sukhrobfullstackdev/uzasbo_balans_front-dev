// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   sum: 0,
//   paymentScheduleTableData: []
// };

// const contractsSlice = createSlice({
//   name: "contracts",
//   initialState,
//   reducers: {
//     updateSum: (state, action) => {
//       if (action.payload.oldSum) {
//         state.sum = (state.sum + action.payload.sum) - action.payload.oldSum;
//       } else {
//         state.sum += action.payload.sum;
//       }
//     },
//     setPaymentScheduleTableData: (state, action) => {
//       state.paymentScheduleTableData = action.payload;
//     },
//   }
// });

// // Actions

// export const { updateSum, setPaymentScheduleTableData } = contractsSlice.actions;

// // Reducer
// const paymentRequestListReducer = contractsSlice.reducer;
// export default paymentRequestListReducer;