import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.themealdb.com/api/json/v1/1' }),
  endpoints: (builder) => ({
    getRandomRecipes: builder.query({
      query: () => 'random.php',
      transformResponse: (response) => response.meals || [],
    }),
    
    searchRecipes: builder.query({
      query: (ingredients) => {
        const mainIngredient = ingredients[0] || 'chicken';
        return `filter.php?i=${encodeURIComponent(mainIngredient)}`;
      },
      transformResponse: (response) => response.meals || [],
    }),
  }),
});

export const { useGetRandomRecipesQuery, useSearchRecipesQuery } = recipesApi;