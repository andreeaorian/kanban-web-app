import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Task {
	title: string;
	description: string;
	subtasks: Task[];
	status: Column;
}

export interface Column {
	title: string;
	color: string;
}

export interface Board {
	title: string;
	columns: Column[];
	tasks: Task[];
}

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
