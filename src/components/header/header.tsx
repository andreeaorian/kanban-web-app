import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";
import PopupWrapper from "../popups/popup-wrapper";
import NewTaskPopup from "../popups/newTask/new-task-popup";
import { resetTask } from "../../redux/taskReducer";

import "./header.scss";
import { setNewTaskPopupVisibility } from "../../redux/appReducer";

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
		dispatch(resetTask());
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
				<button className="header-new-task" onClick={openNewTaskPopup}>
					<FontAwesomeIcon icon={faPlus} />
					<span>Add new task</span>
				</button>
			</header>
			<PopupWrapper
				isVisible={isNewTaskPopupVisible}
				closePopup={closeNewTaskPopup}>
				<NewTaskPopup close={closeNewTaskPopup} />
			</PopupWrapper>
		</>
	);
}
