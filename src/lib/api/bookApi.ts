import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `https://demo.api-platform.com/books`

export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: builder => ({
        getAll: builder.query<any, number>({
            query: (page) => {
                return `?page=${page}`
            }
        }),
    })
});

export const { useLazyGetAllQuery } = bookApi;