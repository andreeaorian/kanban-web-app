import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../../redux/store";
import PopupStatusColumn from "./popup-status-column";
import { addColumn, changeTitle } from "../../../redux/boardReducer";
import { addBoard } from "../../../redux/appReducer";
import { generateId } from "../../../utils/id-generator";

import "./new-board-popup.scss";
import useBoardValidation from "../../../utils/validators/board-validator";
import { isEmpty } from "../../../utils/utils";

export default function NewBoardPopup({ close }: { close: () => void }) {
	const board = useSelector((state: RootState) => state.board);
	const [isNewColumnInputVisible, setIsNewColumnInputVisible] = useState(false);
	const [textInputValue, setTextInputValue] = useState<string>("");
	const [colorInputValue, setColorInputValue] = useState<string>("");
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();

	const dispatch = useDispatch();
	const { validateBoard } = useBoardValidation();

	const addNewColumn = () => {
		setIsNewColumnInputVisible(true);
	};

	const isNewColumnValid = (): boolean => {
		if (isEmpty(textInputValue)) {
			setValidationResult((prevState) => {
				return {
					...prevState,
					...{ newColumn: "Column name is Required" },
				};
			});

			return false;
		}

		const allColumnNames = board.columns.map((x) => x.title);
		if (allColumnNames.includes(textInputValue)) {
			setValidationResult((prevState) => {
				return {
					...prevState,
					...{ newColumn: "Column name should be unique" },
				};
			});

			return false;
		}

		return true;
	};

	const saveColumn = () => {
		if (isNewColumnValid()) {
			dispatch(addColumn({ title: textInputValue, color: colorInputValue }));
			setIsNewColumnInputVisible(false);
			setValidationResult((prevState) => {
				const filteredValidations: Record<string, string> = {};
				for (let key in prevState) {
					if (key !== "newColumn") {
						filteredValidations[key] = prevState[key];
					}
				}

				return filteredValidations;
			});
		}
	};

	const saveBoard = () => {
		const validationResult = validateBoard(board);
		setValidationResult(validationResult);
		console.log(validationResult);

		if (Object.keys(validationResult).length === 0) {
			const boardId = generateId();
			dispatch(addBoard({ ...board, id: boardId }));
			close();
		}
	};

	const changeColor = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setColorInputValue(e.target.value);
	};

	const changeColumnName = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setTextInputValue(e.target.value);
	};

	const changeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
		dispatch(changeTitle(e.target.value));

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
						<div className="new-column-with-errors">
							{!!validationResult && !!validationResult["newColumn"] && (
								<span className="error">{validationResult["newColumn"]}</span>
							)}
							<div className="new-column">
								<div
									className={`new-column-inputs ${
										!!validationResult && !!validationResult["newColumn"]
											? "error"
											: ""
									}`}>
									<input
										type="text"
										placeholder="e.g. Testing"
										onChange={changeColumnName}
									/>
									<input type="color" onChange={changeColor} />
								</div>
								<FontAwesomeIcon
									icon={faCheck}
									size="lg"
									onClick={saveColumn}
								/>
								<FontAwesomeIcon
									icon={faXmark}
									size="lg"
									onClick={revertAddingNewColumn}
								/>
							</div>
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
				<button
					className="submit"
					disabled={isNewColumnInputVisible}
					onClick={saveBoard}>
					Create board
				</button>
			</div>
		</>
	);
}
