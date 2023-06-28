import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import PopupStatusColumn from "./popup-status-column";

import "./new-board-popup.scss";

export default function NewBoardPopup() {
	const board = useSelector((state: RootState) => state.board);

	return (
		<>
			<h2>Add new board</h2>
			<div className="board-name">
				<label htmlFor="boardName">Board Name</label>
				<input name="boardName" id="boardName" placeholder="e.g. First Board" />
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
			</div>
		</>
	);
}
