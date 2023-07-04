import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Board, Column, Task } from "../models";

const initialState: Board = {
	id: "",
	title: "",
	columns: [
		{ title: "TO DO", color: "#FF0000" },
		{ title: "DOING", color: "#FF0000" },
		{ title: "DONE", color: "#FF0000" },
	],
	tasks: [],
	isSelected: false,
};

export const boardSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		changeTitle: (state, action: PayloadAction<string>) => {
			state.title = action.payload;
		},

		deleteColumn: (state, action: PayloadAction<string>) => {
			const newColumns = state.columns.filter(
				(column) => column.title !== action.payload
			);
			state.columns = newColumns;
		},

		addColumn: (state, action: PayloadAction<Column>) => {
			state.columns = [...state.columns, action.payload];
		},

		addTask: (state, action: PayloadAction<Task>) => {
			state.tasks = [...state.tasks, action.payload];
		},

		resetBoard: (state) => {
			state.columns = initialState.columns;
			state.title = initialState.title;
			state.id = initialState.id;
			state.isSelected = initialState.isSelected;
		},
	},
});

// Action creators are generated for each case reducer function
export const { changeTitle, deleteColumn, addColumn, addTask, resetBoard } =
	boardSlice.actions;

export default boardSlice.reducer;
