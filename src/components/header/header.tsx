import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faBars,
	faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";
import PopupWrapper from "../popups/popup-wrapper";
import NewTaskPopup from "../popups/newTask/new-task-popup";
import {
	changeBoardMenuVisibility,
	setNewTaskPopupVisibility,
} from "../../redux/appReducer";
import { BoardDropDownMenu } from "./components/board-drop-down-menu";

import "./header.scss";

export default function Header() {
	const board = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);
	const isSidebarVisible = useSelector(
		(state: RootState) => state.app.showSidebar
	);
	const isNewTaskPopupVisible = useSelector(
		(state: RootState) => state.app.isNewTaskPopupVisible
	);
	const dispatch = useDispatch();

	const openNewTaskPopup = () => {
		dispatch(setNewTaskPopupVisibility(true));
	};

	const closeNewTaskPopup = () => {
		dispatch(setNewTaskPopupVisibility(false));
	};

	const openMenu = () => {
		dispatch(changeBoardMenuVisibility());
	};

	return (
		<>
			<header className="header">
				<h2 className="heading header-board-title">
					{!isSidebarVisible && (
						<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
					)}
					<span>{board?.title}</span>
				</h2>
				<div className="header-buttons">
					<button className="header-new-task" onClick={openNewTaskPopup}>
						<FontAwesomeIcon icon={faPlus} />
						<span>Add new task</span>
					</button>

					<FontAwesomeIcon
						icon={faEllipsisVertical}
						size="lg"
						className="header-menu"
						onClick={openMenu}
					/>
				</div>
				<BoardDropDownMenu />
			</header>
			<PopupWrapper
				isVisible={isNewTaskPopupVisible}
				closePopup={closeNewTaskPopup}>
				<NewTaskPopup close={closeNewTaskPopup} />
			</PopupWrapper>
		</>
	);
}
