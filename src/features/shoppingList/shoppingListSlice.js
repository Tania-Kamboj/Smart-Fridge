import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const list = localStorage.getItem('shoppingList');
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
};

const initialState = loadFromStorage();

export const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addToShoppingList: (state, action) => {
      const exists = state.find(item => item.name === action.payload.name);
      if (!exists) {
        state.push({
          id: Date.now().toString(),
          ...action.payload,
          checked: false,
          autoAdded: true, 
        });
        localStorage.setItem('shoppingList', JSON.stringify(state));
      }
    },
    addExpiringItemsToShoppingList: (state, action) => {
      const expiringItems = action.payload;
      expiringItems.forEach(item => {
        const exists = state.find(i => i.name === item.name);
        if (!exists) {
          state.push({
            id: `auto-${item.id}`,
            name: item.name,
            category: item.category,
            checked: false,
            autoAdded: true,
          });
        }
      });
      localStorage.setItem('shoppingList', JSON.stringify(state));
    },
    removeFromShoppingList: (state, action) => {
      const filtered = state.filter(item => item.id !== action.payload);
      localStorage.setItem('shoppingList', JSON.stringify(filtered));
      return filtered;
    },
    toggleCheck: (state, action) => {
      const item = state.find(item => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
        localStorage.setItem('shoppingList', JSON.stringify(state));
      }
    },
    clearChecked: (state) => {
      const filtered = state.filter(item => !item.checked);
      localStorage.setItem('shoppingList', JSON.stringify(filtered));
      return filtered;
    },
    clearAutoAdded: (state) => {
      const filtered = state.filter(item => !item.autoAdded);
      localStorage.setItem('shoppingList', JSON.stringify(filtered));
      return filtered;
    },
  },
});

export const { 
  addToShoppingList, 
  addExpiringItemsToShoppingList,
  removeFromShoppingList, 
  toggleCheck, 
  clearChecked,
  clearAutoAdded 
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;