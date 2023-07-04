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
			id: "2sD4f9jKpR",
			title: "First board",
			columns: [
				{ title: "TO DO", color: "#FF0000" },
				{ title: "DOING", color: "#FF0000" },
				{ title: "DONE", color: "#FF0000" },
			],
			tasks: [
				{
					id: "xYp1B4nLrJ",
					boardId: "2sD4f9jKpR",
					title: "This is the first task",
					description: "Description of the first task",
					status: "TO DO",
					subtasks: [],
				},
				{
					id: "wT5zA2mDyV",
					boardId: "2sD4f9jKpR",
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
			id: "kD7F3c8uZb",
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
