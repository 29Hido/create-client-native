import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Book from '../types/Book';
import { HydraView } from '../types/HydraView';
import { Log, NewLog } from '../types/Logs';

interface BookSliceState {
    page: number;
    data: Book[];
    currentData?: Book;
    modalState: ModalState;
    view: HydraView;
    logs: Log;
}

interface ModalState {
    open: boolean;
    edit: boolean;
}

const initialState: BookSliceState = {
    page: 1,
    data: [],
    currentData: null,
    modalState: {
        open: false,
        edit: false,
    },
    view: {},
    logs: {
        errors: [],
        successes: [],
    }
}

export const bookSlice = createSlice({
    name: 'bookSlice',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setData: (state, action: PayloadAction<Book[]>) => {
            state.data = action.payload;
        },
        setView: (state, action: PayloadAction<HydraView>) => {
            state.view = action.payload;
        },
        setCurrentData: (state, action: PayloadAction<Book>) => {
            state.currentData = action.payload;
        },
        setModalIsVisible: (state, action: PayloadAction<boolean>) => {
            state.modalState.open = action.payload;
        },
        setModalIsEdit: (state, action: PayloadAction<boolean>) => {
            state.modalState.edit = action.payload;
        },
        addLog: (state, action: PayloadAction<NewLog>) => {
            state.logs[action.payload.type] = [...state.logs[action.payload.type], action.payload.message];
        },
        cleanLogs: (state, action: PayloadAction<keyof Log>) => {
            state.logs[action.payload] = [];
        },
    }
})

export const { setPage, setData, setView, setCurrentData, setModalIsEdit, setModalIsVisible, addLog, cleanLogs } = bookSlice.actions;

export default bookSlice.reducer;