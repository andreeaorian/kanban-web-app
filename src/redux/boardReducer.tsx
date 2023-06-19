import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BoardState {
	title: string;
}

const initialState: BoardState = {
	title: "First board",
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
