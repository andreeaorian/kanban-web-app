import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";

import "./header.scss";
import { useState } from "react";
import PopupWrapper from "../popups/popup-wrapper";
import NewTaskPopup from "../popups/newTask/new-task-popup";

export default function Header() {
	const board = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);
	const isSidebarVisible = useSelector(
		(state: RootState) => state.app.showSidebar
	);
	const [isNewTaskPopupVisible, setIsNewTaskPopupVisible] = useState(false);

	const openNewTaskPopup = () => {
		setIsNewTaskPopupVisible(true);
	};

	const closeNewTaskPopup = () => {
		setIsNewTaskPopupVisible(false);
	};

	return (
		<>
			<header className="header">
				<h2 className="header-board-title">
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
				closePopup={closeNewTaskPopup}
				content={<NewTaskPopup close={closeNewTaskPopup} />}
			/>
		</>
	);
}
