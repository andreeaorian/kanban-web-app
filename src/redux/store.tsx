import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appReducer";
import boardReducer from "./boardReducer";

export const store = configureStore({
	reducer: {
		app: appReducer,
		board: boardReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
