import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from '../features/inventory/inventorySlice';
import shoppingListReducer from '../features/shoppingList/shoppingListSlice';
import { recipesApi } from '../features/recipes/recipesAPI';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    shoppingList: shoppingListReducer,
    [recipesApi.reducerPath]: recipesApi.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recipesApi.middleware),
});