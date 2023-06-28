import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Board } from "../models";

const initialState: Board = {
	title: "First board",
	columns: [],
	tasks: [],
};

export const boardSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		changeTitle: (state, action: PayloadAction<string>) => {
			state.title = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { changeTitle } = boardSlice.actions;

export default boardSlice.reducer;
