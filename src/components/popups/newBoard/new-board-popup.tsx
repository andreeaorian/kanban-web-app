import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../../redux/store";
import PopupStatusColumn from "./popup-status-column";
import { addColumn } from "../../../redux/boardReducer";

import "./new-board-popup.scss";

export default function NewBoardPopup() {
	const board = useSelector((state: RootState) => state.board);
	const [isNewColumnInputVisible, setIsNewColumnInputVisible] = useState(false);
	const [textInputValue, setTextInputValue] = useState<string>("");
	const [colorInputValue, setColorInputValue] = useState<string>("");
	const dispatch = useDispatch();

	const addNewColumn = () => {
		setIsNewColumnInputVisible(true);
	};

	const saveColumn = () => {
		dispatch(addColumn({ title: textInputValue, color: colorInputValue }));
		setIsNewColumnInputVisible(false);
	};

	return (
		<>
			<h2>Add new board</h2>
			<form>
				<div className="board-name">
					<label htmlFor="boardName">Board Name</label>
					<input
						name="boardName"
						id="boardName"
						placeholder="e.g. First Board"
					/>
				</div>
				<div className="board-column-list">
					<div>Columns</div>
					{board.columns.map((column) => {
						return (
							<PopupStatusColumn
								title={column.title}
								color={column.color}
								key={column.title}
							/>
						);
					})}
					{isNewColumnInputVisible && (
						<div className="new-column">
							<div className="new-column-inputs">
								<input
									type="text"
									placeholder="e.g. Testing"
									onChange={({ target }) => {
										setTextInputValue(target.value);
									}}
								/>
								<input
									type="color"
									onChange={({ target }) => {
										setColorInputValue(target.value);
									}}
								/>
							</div>
							<FontAwesomeIcon icon={faCheck} size="lg" onClick={saveColumn} />
							<FontAwesomeIcon
								icon={faXmark}
								size="lg"
								onClick={() => setIsNewColumnInputVisible(false)}
							/>
						</div>
					)}
				</div>
			</form>
			<div className="board-buttons">
				<button
					className="new-column-button"
					onClick={addNewColumn}
					disabled={isNewColumnInputVisible}>
					Add new column
				</button>
				<button className="submit">Create board</button>
			</div>
		</>
	);
}
