import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Board, Task, SubTaskStatus, SubTask } from "../models";

export interface App {
	isDarkTheme: boolean;
	isBoardPopupVisible: boolean;
	isBoardInEdit: boolean;
	isTaskInEdit: boolean;
	isTaskPopupVisible: boolean;
	isTaskViewModeOpen: boolean;
	showSidebar: boolean;
	boards: Board[];
	selectedTask: Task | null;
}

const initialState: App = {
	isDarkTheme: true,
	showSidebar: true,
	isBoardPopupVisible: false,
	isBoardInEdit: false,
	isTaskInEdit: false,
	isTaskPopupVisible: false,
	isTaskViewModeOpen: false,
	boards: [
		{
			id: "2sD4f9jKpR",
			title: "First board",
			columns: [
				{ id: "adf4f9jKJR", title: "TO DO", color: "#FF0000" },
				{ id: "45D4f9jKpW", title: "DOING", color: "#FF0000" },
				{ id: "98D4f9jPQZ", title: "DONE", color: "#FF0000" },
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
							id: "6Yp123nLrJ",
							title: "This is the first subtask",
							status: SubTaskStatus.Todo,
						},
						{
							id: "754123nLrJ",
							title: "This is the second very very loooooong subtask - done",
							status: SubTaskStatus.Done,
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
	selectedTask: null,
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
		editBoard: (state, action: PayloadAction<Board>) => {
			state.boards.forEach((board) => {
				if (board.id === action.payload.id) {
					board.title = action.payload.title;
					board.columns = action.payload.columns;
					return;
				}
			});
		},
		editTask: (state, action: PayloadAction<Task>) => {
			state.boards.forEach((board) => {
				if (board.id === action.payload.boardId) {
					board.tasks.forEach((task) => {
						if (task.id === action.payload.id) {
							task.title = action.payload.title;
							task.description = action.payload.description;
							task.status = action.payload.status;
							task.subtasks = [...action.payload.subtasks];
							return;
						}
					});
				}
			});
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
		deleteTask: (state, action: PayloadAction<Task>) => {
			state.boards.forEach((board) => {
				if (board.id === action.payload.boardId) {
					board.tasks = board.tasks?.filter((t) => t.id !== action.payload.id);
				}
			});

			if (state.selectedTask?.id === action.payload.id) {
				state.selectedTask = null;
			}
		},
		changeTaskStatus: (state, action: PayloadAction<Task>) => {
			state.boards.forEach((board) => {
				if (board.id === action.payload.boardId) {
					board.tasks.forEach((task) => {
						if (task.id === action.payload.id) {
							task.status = action.payload.status;

							if (state.selectedTask?.id === task.id) {
								state.selectedTask = task;
							}
						}
					});
				}
			});
		},
		changeSubtaskStatus: (
			state,
			action: PayloadAction<{ taskId: string; subtask: SubTask }>
		) => {
			state.boards.forEach((board) => {
				if (board.isSelected) {
					board.tasks.forEach((task) => {
						if (task.id === action.payload.taskId) {
							task.subtasks.forEach((subtask) => {
								if (subtask.id === action.payload.subtask.id) {
									subtask.status = action.payload.subtask.status;
								}
							});

							if (state.selectedTask?.id === task.id) {
								state.selectedTask = task;
							}
						}
					});
				}
			});
		},
		changeSidebarVisibility: (state) => {
			state.showSidebar = !state.showSidebar;
		},
		setBoardPopupVisibility: (state, action: PayloadAction<boolean>) => {
			state.isBoardPopupVisible = action.payload;
		},
		setBoardEditMode: (state, action: PayloadAction<boolean>) => {
			state.isBoardInEdit = action.payload;
		},
		setTaskEditMode: (state, action: PayloadAction<boolean>) => {
			state.isTaskInEdit = action.payload;
		},
		setTaskPopupVisibility: (state, action: PayloadAction<boolean>) => {
			state.isTaskPopupVisible = action.payload;
		},
		setTaskViewMode: (state, action: PayloadAction<boolean>) => {
			state.isTaskViewModeOpen = action.payload;
		},
		setSelectedTask: (state, action: PayloadAction<Task>) => {
			state.selectedTask = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	changeTheme,
	addBoard,
	editBoard,
	editTask,
	selectBoard,
	addTaskToBoard,
	deleteTask,
	deleteBoard,
	changeTaskStatus,
	changeSubtaskStatus,
	changeSidebarVisibility,
	setBoardPopupVisibility,
	setBoardEditMode,
	setTaskEditMode,
	setTaskPopupVisibility,
	setTaskViewMode,
	setSelectedTask,
} = appSlice.actions;

export default appSlice.reducer;
