import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Book from '../types/Book';
import { HydraView } from '../types/HydraView';

interface BookSliceState {
    data?: Book[];
    currentData?: Book;
    editModalVisible: boolean;
    createModalVisible: boolean;
    view: HydraView;
}

const initialState: BookSliceState = {
    data: [],
    currentData: null,
    editModalVisible: false,
    createModalVisible: false,
    view: {},
}

export const bookSlice = createSlice({
    name: 'bookSlice',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Book[]>) => {
            state.data = action.payload;
        },
        setView: (state, action: PayloadAction<HydraView>) => {
            state.view = action.payload;
        },
        setCurrentData: (state, action: PayloadAction<Book>) => {
            state.currentData = action.payload;
        },
        setEditModalVisible: (state, action: PayloadAction<boolean>) => {
            state.editModalVisible = action.payload;
        },
        setCreateModalVisible: (state, action: PayloadAction<boolean>) => {
            state.createModalVisible = action.payload;
        }
    }
})

export const { setData, setView, setCurrentData, setEditModalVisible, setCreateModalVisible } = bookSlice.actions;

export default bookSlice.reducer;