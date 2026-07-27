import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  activeTab: 'inventory', 
  notification: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type, 
      };
      setTimeout(() => {
        state.notification = null;
      }, 3000);
    },
  },
});

export const { openModal, closeModal, setActiveTab, showNotification } = uiSlice.actions;
export default uiSlice.reducer;