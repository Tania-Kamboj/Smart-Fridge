import { createSlice, createSelector } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const items = localStorage.getItem('fridgeItems');
    return items ? JSON.parse(items) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadFromStorage(),
  filter: 'all',
  searchQuery: '',
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        id: Date.now().toString(),
        ...action.payload,
        addedDate: new Date().toISOString(),
      });
      localStorage.setItem('fridgeItems', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('fridgeItems', JSON.stringify(state.items));
    },
    useItem: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity = Math.max(0, item.quantity - 1);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
        localStorage.setItem('fridgeItems', JSON.stringify(state.items));
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addItem, removeItem, useItem, setFilter, setSearchQuery } = inventorySlice.actions;

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const selectFilteredItems = createSelector(
  [(state) => state.inventory.items, (state) => state.inventory.filter, (state) => state.inventory.searchQuery],
  (items, filter, searchQuery) => {
    let filteredItems = [...items];
    
    if (searchQuery) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const today = normalizeDate(new Date());
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    switch (filter) {
      case 'fresh':
        return filteredItems.filter(item => normalizeDate(item.expiryDate) > threeDaysLater);
      case 'expiring':
        return filteredItems.filter(item => {
          const expiry = normalizeDate(item.expiryDate);
          return expiry <= threeDaysLater && expiry > today;
        });
      case 'expired':
        return filteredItems.filter(item => normalizeDate(item.expiryDate) <= today);
      default:
        return filteredItems;
    }
  }
);

export const selectStats = createSelector(
  [(state) => state.inventory.items],
  (items) => {
    const today = normalizeDate(new Date());
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return {
      total: items.length,
      fresh: items.filter(item => normalizeDate(item.expiryDate) > threeDaysLater).length,
      expiring: items.filter(item => {
        const expiry = normalizeDate(item.expiryDate);
        return expiry <= threeDaysLater && expiry > today;
      }).length,
      expired: items.filter(item => normalizeDate(item.expiryDate) <= today).length,
    };
  }
);

export const selectExpiringItems = createSelector(
  [(state) => state.inventory.items],
  (items) => {
    const today = normalizeDate(new Date());
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return items.filter(item => {
      const expiry = normalizeDate(item.expiryDate);
      return expiry <= threeDaysLater && expiry >= today;
    });
  }
);

export default inventorySlice.reducer;