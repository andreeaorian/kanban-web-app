import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../models";

export interface App {
	isDarkTheme: boolean;
	boards: Board[];
}

const initialState: App = {
	isDarkTheme: true,
	boards: [
		{ title: "First board", columns: [], tasks: [], isSelected: true },
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
		changeTheme: (state, action: PayloadAction<boolean>) => {
			state.isDarkTheme = action.payload;
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
	},
});

// Action creators are generated for each case reducer function
export const { changeTheme, addBoard, selectBoard } = appSlice.actions;

export default appSlice.reducer;
