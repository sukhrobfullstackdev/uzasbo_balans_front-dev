import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  id: null,
  tableId: null,
  inputName: ''
};

export const historyModalSlice = createSlice({
  name: "historyModal",
  initialState: initialState,
  reducers: {
    openModal: (state, action) => {
      state.visible = true; 
      state.id = action.payload.id
      state.tableId = action.payload.tableId
      state.inputName = action.payload.inputName
    },
    closeModal: (state, action) => {
      state.visible = false;
      state.id = null
      state.tableId = null
      state.inputName = ''
    },
  }
});

export const { openModal, closeModal } = historyModalSlice.actions;

export default historyModalSlice.reducer;
