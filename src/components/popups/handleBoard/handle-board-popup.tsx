import {
	useState,
	useMemo,
	useCallback,
	useReducer,
	useEffect,
	Reducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupListActionableValue from "../components/popup-list-actionable-value";
import { addBoard, editBoard } from "../../../redux/appReducer";
import { generateId } from "../../../utils/id-generator";
import useBoardValidation from "../../../hooks/use-board-validator";
import ActionableInput from "../components/actionable-input";
import { Board, Column } from "../../../models";

import "../form-content.scss";
import { RootState } from "../../../redux/store";

const initialBoard: Board = {
	id: "",
	title: "",
	columns: [
		{ id: "uer2Z6PfeC", title: "To do", color: "#FF0000" },
		{ id: "ybUYx87rz7", title: "Doing", color: "#3CDFFF" },
		{ id: "prRggt7x55", title: "Done", color: "#008000" },
	],
	tasks: [],
	isSelected: false,
};

enum BoardActionTypes {
	SET_BOARD = "SET_BOARD",
	CHANGE_TITLE = "CHANGE_TITLE",
	ADD_COLUMN = "ADD_COLUMN",
	DELETE_COLUMN = "DELETE_COLUMN",
	MOVE_COLUMN = "MOVE_COLUMN",
}

interface BoardAction {
	type: BoardActionTypes;
	payload: string | Column | Board | Column[];
}

interface BoardState {
	board: Board;
}

function boardReducer(state: BoardState, action: BoardAction): BoardState {
	const { type, payload } = action;
	switch (type) {
		case BoardActionTypes.SET_BOARD:
			return { ...state, board: payload as Board };
		case BoardActionTypes.CHANGE_TITLE:
			return {
				...state,
				board: { ...state.board, title: payload as string },
			};
		case BoardActionTypes.DELETE_COLUMN:
			return {
				...state,
				board: {
					...state.board,
					columns: state.board.columns.filter((x) => x.id !== payload),
				},
			};
		case BoardActionTypes.ADD_COLUMN:
			return {
				...state,
				board: {
					...state.board,
					columns: [...state.board.columns, payload as Column],
				},
			};
		case BoardActionTypes.MOVE_COLUMN:
			return {
				...state,
				board: { ...state.board, columns: [...(payload as Column[])] },
			};
		default:
			return state;
	}
}

export default function HandleBoardPopup({ close }: { close: () => void }) {
	const [boardState, reducerDispatch] = useReducer<
		Reducer<BoardState, BoardAction>
	>(boardReducer, {
		board: initialBoard,
	});
	const [isNewColumnInputVisible, setIsNewColumnInputVisible] = useState(false);
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();
	const isBoardInEdit = useSelector(
		(state: RootState) => state.app.isBoardInEdit
	);
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
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

	useEffect(() => {
		if (isBoardInEdit) {
			reducerDispatch({
				type: BoardActionTypes.SET_BOARD,
				payload: { ...(selectedBoard as Board) },
			});
		}
	}, [isBoardInEdit, selectedBoard]);

	const addNewColumn = () => {
		setIsNewColumnInputVisible(true);
	};

	const saveNewColumn = useCallback((title: string, color?: string) => {
		const columnId = generateId();
		reducerDispatch({
			type: BoardActionTypes.ADD_COLUMN,
			payload: { id: columnId, title: title, color: color! },
		});
		setIsNewColumnInputVisible(false);
	}, []);

	const saveBoard = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const validationResult = validateBoard(boardState.board);
		setValidationResult(validationResult);

		if (Object.keys(validationResult).length === 0) {
			if (isBoardInEdit) {
				reduxDispatch(editBoard({ ...boardState.board }));
			} else {
				const boardId = generateId();
				reduxDispatch(addBoard({ ...boardState.board, id: boardId }));
			}
			close();
		}
	};

	const changeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
		reducerDispatch({
			type: BoardActionTypes.CHANGE_TITLE,
			payload: e.target.value,
		});

	const deleteColumn = (id: string) =>
		reducerDispatch({ type: BoardActionTypes.DELETE_COLUMN, payload: id });

	const revertAddingNewColumn = () => setIsNewColumnInputVisible(false);

	const moveDraggedColumn = (dragIndex: number, hoverIndex: number) => {
		const draggedColumn = boardState.board.columns[dragIndex];

		if (!!draggedColumn) {
			const coppiedColumns = [...boardState.board.columns];
			const prevColumns = coppiedColumns.splice(hoverIndex, 1, draggedColumn);
			coppiedColumns.splice(dragIndex, 1, prevColumns[0]);

			reducerDispatch({
				type: BoardActionTypes.MOVE_COLUMN,
				payload: coppiedColumns,
			});
		}
	};

	return (
		<>
			<h2 className="heading">
				{isBoardInEdit ? "Edit board" : "Add new board"}
			</h2>
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
					{boardState.board.columns.map((column: Column, index: number) => (
						<PopupListActionableValue
							id={column.id}
							title={column.title}
							hasColor={true}
							color={column.color}
							key={column.id}
							index={index}
							moveListValueHandler={moveDraggedColumn}
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
						{isBoardInEdit ? "Save" : "Create board"}
					</button>
				</div>
			</form>
		</>
	);
}
