import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../models";

export interface App {
	isDarkTheme: boolean;
	boards: Board[];
}

const initialState: App = {
	isDarkTheme: true,
	boards: [],
};

export const appSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		changeTheme: (state, action: PayloadAction<boolean>) => {
			state.isDarkTheme = action.payload;
		},
		addBoard: (state, action: PayloadAction<Board>) => {
			state.boards.push(action.payload);
		},
	},
});

// Action creators are generated for each case reducer function
export const { changeTheme, addBoard } = appSlice.actions;

export default appSlice.reducer;
