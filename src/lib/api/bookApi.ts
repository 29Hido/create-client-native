import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `http://localhost:80/books`

export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: builder => ({
        getAll: builder.query<any, number>({
            query: (page) => {
                return `?page=${page}`
            }
        }),
        delete: builder.query<any, number>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    method: 'DELETE'
                }
            }
        }),
    })
});

export const { useLazyGetAllQuery, useLazyDeleteQuery } = bookApi;