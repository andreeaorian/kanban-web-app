import { useSelector } from "react-redux";
import { Task } from "../models";
import { RootState } from "../redux/store";
import { Board } from "../models";
import { isEmpty } from "../utils/utils";
type Error = Record<string, string>;

export default function useTaskValidation() {
	const allTaskFromBoard = useSelector(
		(state: RootState) =>
			state.app.boards.find((x: Board) => x.isSelected)?.tasks
	);

	const validateTask = (task: Task) => {
		let errors: Error = {};

		if (isEmpty(task.title)) {
			errors.taskTitle = "Title is required";
		} else {
			const taskWithSameName = allTaskFromBoard!.find(
				(x) => x.title === task.title
			);

			if (!!taskWithSameName && taskWithSameName.id !== task.id) {
				errors.taskTitle = "The title should be unique";
			}
		}

		if (isEmpty(task.description)) {
			errors.taskDescription = "Description is required";
		}

		return errors;
	};

	return { validateTask };
}
