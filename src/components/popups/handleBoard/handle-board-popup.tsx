import { useState, useMemo, useCallback, useReducer } from "react";
import { useDispatch } from "react-redux";
import PopupListActionableValue from "../components/popup-list-actionable-value";
import { addBoard } from "../../../redux/appReducer";
import { generateId } from "../../../utils/id-generator";
import useBoardValidation from "../../../hooks/use-board-validator";
import ActionableInput from "../components/actionable-input";
import { Board } from "../../../models";

import "../form-content.scss";

const initialBoard: Board = {
	id: "",
	title: "",
	columns: [
		{ title: "To do", color: "#FF0000" },
		{ title: "Doing", color: "#3CDFFF" },
		{ title: "Done", color: "#008000" },
	],
	tasks: [],
	isSelected: false,
};

interface BoardState {
	board: Board;
}

enum BoardActionTypes {
	CHANGE_TITLE = "CHANGE_TITLE",
	ADD_COLUMN = "ADD_COLUMN",
	DELETE_COLUMN = "DELETE_COLUMN",
}

interface BoardAction {
	type: BoardActionTypes;
	payload: any;
}

function boardReducer(state: BoardState, action: BoardAction) {
	const { type, payload } = action;
	switch (type) {
		case BoardActionTypes.CHANGE_TITLE:
			return {
				...state,
				board: { ...state.board, title: payload },
			};
		case BoardActionTypes.DELETE_COLUMN:
			return {
				...state,
				board: {
					...state.board,
					columns: state.board.columns.filter((x) => x.title !== payload),
				},
			};
		case BoardActionTypes.ADD_COLUMN:
			return {
				...state,
				board: {
					...state.board,
					columns: [...state.board.columns, payload],
				},
			};
		default:
			return state;
	}
}

export default function HandleBoardPopup({ close }: { close: () => void }) {
	const [boardState, reducerDispatch] = useReducer(boardReducer, {
		board: initialBoard,
	});
	const [isNewColumnInputVisible, setIsNewColumnInputVisible] = useState(false);
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();
	const reduxDispatch = useDispatch();
	const { validateBoard } = useBoardValidation();

	const allColumnNames = useMemo(() => {
		return boardState.board.columns.map((x) => x.title);
	}, [boardState.board.columns]);
	const isBoardNameInvalid = useMemo(
		() => !!validationResult && !!validationResult.boardName,
		[validationResult]
	);
	const areColumnsInvalid = useMemo(
		() => !!validationResult && !!validationResult.columns,
		[validationResult]
	);

	const addNewColumn = () => {
		setIsNewColumnInputVisible(true);
	};

	const saveNewColumn = useCallback((title: string, color?: string) => {
		reducerDispatch({
			type: BoardActionTypes.ADD_COLUMN,
			payload: { title: title, color: color! },
		});
		setIsNewColumnInputVisible(false);
	}, []);

	const saveBoard = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const validationResult = validateBoard(boardState.board);
		setValidationResult(validationResult);

		if (Object.keys(validationResult).length === 0) {
			const boardId = generateId();
			reduxDispatch(addBoard({ ...boardState.board, id: boardId }));
			close();
		}
	};

	const changeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
		reducerDispatch({
			type: BoardActionTypes.CHANGE_TITLE,
			payload: e.target.value,
		});

	const deleteColumn = (title: string) =>
		reducerDispatch({ type: BoardActionTypes.DELETE_COLUMN, payload: title });

	const revertAddingNewColumn = () => setIsNewColumnInputVisible(false);

	return (
		<>
			<h2 className="heading">Add new board</h2>
			<form className="form">
				<div className="form-simple-item">
					<label className="label-error" htmlFor="boardName">
						Board Name
						{isBoardNameInvalid && (
							<span className="error">{validationResult?.boardName}</span>
						)}
					</label>
					<input
						className={isBoardNameInvalid ? "error" : ""}
						name="boardName"
						id="boardName"
						placeholder="e.g. First Board"
						value={boardState.board.title}
						onChange={changeBoardTitle}
					/>
				</div>
				<div className="form-list-item">
					<div className="label-error">
						Columns
						{areColumnsInvalid && (
							<span className="error">{validationResult?.columns}</span>
						)}
					</div>
					{boardState.board.columns.map((column) => (
						<PopupListActionableValue
							title={column.title}
							hasColor={true}
							color={column.color}
							key={column.title}
							deleteHandler={deleteColumn}
						/>
					))}
					{isNewColumnInputVisible && (
						<ActionableInput
							inputName="newColumn"
							inputPlaceholder="e.g. Testing"
							hasColor={true}
							similarNames={allColumnNames}
							save={saveNewColumn}
							revertChanges={revertAddingNewColumn}
						/>
					)}
				</div>
				<div className="form-buttons">
					<button
						className="create-button"
						onClick={addNewColumn}
						disabled={isNewColumnInputVisible}>
						Add new column
					</button>
					<button
						className="submit-button"
						disabled={isNewColumnInputVisible}
						onClick={saveBoard}>
						Create board
					</button>
				</div>
			</form>
		</>
	);
}
