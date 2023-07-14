import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableList } from "@fortawesome/free-solid-svg-icons";
import { selectBoard } from "../../../redux/appReducer";

import "../sidebar.scss";

export default function SidebarBoardCard({
	boardName,
	isSelected,
}: {
	boardName: string;
	isSelected: boolean;
}) {
	const dispatch = useDispatch();

	const selectABoard = () => dispatch(selectBoard(boardName));

	return (
		<div
			className={`sidebar-board-card ${isSelected ? "selected" : ""}`}
			onClick={selectABoard}
			title={boardName}>
			<FontAwesomeIcon icon={faTableList} flip="both" />
			<span>{boardName}</span>
		</div>
	);
}
