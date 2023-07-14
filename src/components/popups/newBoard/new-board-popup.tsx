import { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import PopupListActionableValue from "../components/popup-list-actionable-value";
import {
	addColumn,
	changeTitle,
	deleteColumn,
} from "../../../redux/boardReducer";
import { addBoard } from "../../../redux/appReducer";
import { generateId } from "../../../utils/id-generator";

import "./new-board-popup.scss";
import useBoardValidation from "../../../hooks/use-board-validator";
import ActionableInput from "../components/actionable-input";

export default function NewBoardPopup({ close }: { close: () => void }) {
	const board = useSelector((state: RootState) => state.board);
	const [isNewColumnInputVisible, setIsNewColumnInputVisible] = useState(false);
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();

	const dispatch = useDispatch();
	const { validateBoard } = useBoardValidation();
	const allColumnNames = useMemo(() => {
		return board.columns.map((x) => x.title);
	}, [board.columns]);

	const addNewColumn = () => {
		setIsNewColumnInputVisible(true);
	};

	const saveColumn = useCallback(
		(title: string, color?: string) => {
			dispatch(addColumn({ title: title, color: color! }));
			setIsNewColumnInputVisible(false);
		},
		[dispatch]
	);

	const saveBoard = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const validationResult = validateBoard(board);
		setValidationResult(validationResult);
		console.log(validationResult);

		if (Object.keys(validationResult).length === 0) {
			const boardId = generateId();
			dispatch(addBoard({ ...board, id: boardId }));
			close();
		}
	};

	const changeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
		dispatch(changeTitle(e.target.value));

	const deleteValue = (title: string) => dispatch(deleteColumn(title));

	const revertAddingNewColumn = () => setIsNewColumnInputVisible(false);

	return (
		<>
			<h2>Add new board</h2>
			<form>
				<div className="board-name">
					<label className="label-error" htmlFor="boardName">
						Board Name
						{!!validationResult && !!validationResult["boardName"] && (
							<span className="error">{validationResult["boardName"]}</span>
						)}
					</label>
					<input
						className={
							!!validationResult && !!validationResult["boardName"]
								? "error"
								: ""
						}
						name="boardName"
						id="boardName"
						placeholder="e.g. First Board"
						onChange={changeBoardTitle}
					/>
				</div>
				<div className="board-column-list">
					<div className="label-error">
						Columns
						{!!validationResult && !!validationResult["columns"] && (
							<span className="error">{validationResult["columns"]}</span>
						)}
					</div>
					{board.columns.map((column) => (
						<PopupListActionableValue
							title={column.title}
							hasColor={true}
							color={column.color}
							key={column.title}
							deleteHandler={deleteValue}
						/>
					))}
					{isNewColumnInputVisible && (
						<ActionableInput
							inputName="newColumn"
							inputPlaceholder="e.g. Testing"
							hasColor={true}
							similarNames={allColumnNames}
							save={saveColumn}
							revertChanges={revertAddingNewColumn}
						/>
					)}
				</div>
				<div className="board-buttons">
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
