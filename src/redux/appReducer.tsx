import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Board, Task, SubTaskStatus } from "../models";

export interface App {
	isDarkTheme: boolean;
	isNewBoardPopupVisible: boolean;
	isNewTaskPopupVisible: boolean;
	isBoardMenuVisible: boolean;
	showSidebar: boolean;
	boards: Board[];
}

const initialState: App = {
	isDarkTheme: true,
	showSidebar: true,
	isNewBoardPopupVisible: false,
	isNewTaskPopupVisible: false,
	isBoardMenuVisible: false,
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
			state.boards.forEach((board) => {
				if (board.title === action.payload) {
					board.isSelected = true;
				} else {
					board.isSelected = false;
				}
			});
		},
		deleteBoard: (state, action: PayloadAction<string>) => {
			state.boards = state.boards.filter((b) => b.id !== action.payload);
			state.boards[0].isSelected = true;
		},
		addTaskToBoard: (state, action: PayloadAction<Task>) => {
			state.boards.forEach((board) => {
				if (board.id === action.payload.boardId) {
					board.tasks = board.tasks?.concat(action.payload);
				}
			});
		},
		changeTaskStatus: (state, action: PayloadAction<Task>) => {
			state.boards.forEach((board) => {
				if (board.id === action.payload.boardId) {
					board.tasks.forEach((task) => {
						if (task.title === action.payload.title) {
							task.status = action.payload.status;
						}
					});
				}
			});
		},
		changeSidebarVisibility: (state) => {
			state.showSidebar = !state.showSidebar;
		},
		changeBoardMenuVisibility: (state) => {
			state.isBoardMenuVisible = !state.isBoardMenuVisible;
		},
		setNewBoardPopupVisibility: (state, action: PayloadAction<boolean>) => {
			state.isNewBoardPopupVisible = action.payload;
		},
		setNewTaskPopupVisibility: (state, action: PayloadAction<boolean>) => {
			state.isNewTaskPopupVisible = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	changeTheme,
	addBoard,
	selectBoard,
	addTaskToBoard,
	deleteBoard,
	changeTaskStatus,
	changeSidebarVisibility,
	changeBoardMenuVisibility,
	setNewBoardPopupVisibility,
	setNewTaskPopupVisibility,
} = appSlice.actions;

export default appSlice.reducer;
