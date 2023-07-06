import { useSelector } from "react-redux";
import { Board } from "../../models";
import { RootState } from "../../redux/store";
import { isEmpty } from "../utils";
type Error = Record<string, string>;

export default function useBoardValidation() {
	const allBoards = useSelector((state: RootState) => state.app.boards);

	const validateBoard = (board: Board) => {
		let errors: Error = {};

		if (isEmpty(board.title)) {
			errors.boardName = "Name is required";
		} else {
			const boardNames = allBoards.map((x) => x.title);

			if (boardNames.includes(board.title)) {
				errors.boardName = "The name should be unique";
			}
		}

		if (board.columns.length === 0) {
			errors.columns = "At least one column is required";
		}

		return errors;
	};

	return { validateBoard };
}
