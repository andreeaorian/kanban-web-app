import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Board, SubTaskStatus } from "../models";

export interface App {
	isDarkTheme: boolean;
	showSidebar: boolean;
	boards: Board[];
}

const initialState: App = {
	isDarkTheme: true,
	showSidebar: true,
	boards: [
		{
			title: "First board",
			columns: [
				{ title: "TO DO", color: "#FF0000" },
				{ title: "DOING", color: "#FF0000" },
				{ title: "DONE", color: "#FF0000" },
			],
			tasks: [
				{
					title: "This is the first task",
					description: "Description of the first task",
					status: "TO DO",
					subtasks: [],
				},
				{
					title:
						"This is the second task with a very very very long task title ",
					description: "Description of the second task",
					status: "TO DO",
					subtasks: [
						{
							title: "This is the first subtask",
							status: SubTaskStatus.Todo,
						},
					],
				},
			],
			isSelected: true,
		},
		{
			title: "Second largest board",
			columns: [],
			tasks: [],
			isSelected: false,
		},
	],
};

export const appSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		changeTheme: (state) => {
			state.isDarkTheme = !state.isDarkTheme;
		},
		addBoard: (state, action: PayloadAction<Board>) => {
			state.boards.push(action.payload);
		},
		selectBoard: (state, action: PayloadAction<string>) => {
			const allBoards = [...state.boards];
			allBoards.forEach((board) => {
				if (board.title === action.payload) {
					board.isSelected = true;
				} else {
					board.isSelected = false;
				}
			});

			state.boards = allBoards;
		},
		changeSidebarVisibility: (state) => {
			state.showSidebar = !state.showSidebar;
		},
	},
});

// Action creators are generated for each case reducer function
export const { changeTheme, addBoard, selectBoard, changeSidebarVisibility } =
	appSlice.actions;

export default appSlice.reducer;
