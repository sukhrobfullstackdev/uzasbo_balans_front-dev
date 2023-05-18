import { createSlice } from "@reduxjs/toolkit";

import config from './../config';

const initialState = {
  isOpen: [], //for active default menu
  isTrigger: [], //for active default menu, set blank for horizontal
  ...config,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState: initialState,
  reducers: {
    collapseMenu: (state) => {
      state.collapseMenu = !state.collapseMenu;
    },
    collapseToggle: (state, action) => {
      let trigger = [];
      let open = [];
      if (action.payload.menu.type === 'sub') {
        open = state.isOpen;
        trigger = state.isTrigger;

        const triggerIndex = trigger.indexOf(action.payload.menu.id);
        if (triggerIndex > -1) {
          open = open.filter(item => item !== action.payload.menu.id);
          trigger = trigger.filter(item => item !== action.payload.menu.id);
        }

        if (triggerIndex === -1) {
          open = [...open, action.payload.menu.id];
          trigger = [...trigger, action.payload.menu.id];
        }
      } else {
        open = state.isOpen;
        const triggerIndex = (state.isTrigger).indexOf(action.payload.menu.id);
        trigger = (triggerIndex === -1) ? [action.payload.menu.id] : [];
        open = (triggerIndex === -1) ? [action.payload.menu.id] : [];
      }

      state.isOpen = open;
      state.isTrigger = trigger;
      // return state = {
      //   isOpen: open,
      //   isTrigger: trigger
      // }
    },
    navContentLeave: (state) => {
      let trigger = [];
      let open = [];
      state.isOpen = open;
      state.isTrigger = trigger;
      // return state = {
      //   isOpen: open,
      //   isTrigger: trigger
      // }
    },
    navCollapseLeave: (state, action) => {
      let trigger = [];
      let open = [];

      if (action.payload.menu.type === 'sub') {
        open = state.isOpen;
        trigger = state.isTrigger;

        const triggerIndex = trigger.indexOf(action.payload.menu.id);
        if (triggerIndex > -1) {
          open = open.filter(item => item !== action.payload.menu.id);
          trigger = trigger.filter(item => item !== action.payload.menu.id);
        }
        state.isOpen = open;
        state.isTrigger = trigger;
        return;
        // return state = {
        //   isOpen: open,
        //   isTrigger: trigger
        // };
      }
      return state;
    },
    changeLayout: (state, action) => {
      state.layout = action.payload.layout;
    },
  },
});

// Action creators are generated for each case reducer function
export const { collapseMenu, collapseToggle, navContentLeave, navCollapseLeave, changeLayout } = navigationSlice.actions;

export default navigationSlice.reducer;
