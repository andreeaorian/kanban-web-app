import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Task, SubTask } from "../models";

const initialState: Task = {
	id: "",
	title: "",
	description: "",
	subtasks: [],
	status: "",
	boardId: "",
};

export const taskSlice = createSlice({
	name: "task",
	initialState,
	reducers: {
		changeTitle: (state, action: PayloadAction<string>) => {
			state.title = action.payload;
		},

		changeDescription: (state, action: PayloadAction<string>) => {
			state.description = action.payload;
		},

		addSubtask: (state, action: PayloadAction<SubTask>) => {
			state.subtasks = [...state.subtasks, action.payload];
		},

		deleteSubtask: (state, action: PayloadAction<string>) => {
			const newSubtasks = state.subtasks.filter(
				(s) => s.title !== action.payload
			);
			state.subtasks = newSubtasks;
		},
		resetTask: (state) => {
			state = { ...initialState };
		},
	},
});

// Action creators are generated for each case reducer function
export const { changeTitle, deleteSubtask, addSubtask, resetTask } =
	taskSlice.actions;

export default taskSlice.reducer;
