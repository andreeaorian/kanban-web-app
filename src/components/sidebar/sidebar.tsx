import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTableList } from "@fortawesome/free-solid-svg-icons";

import type { RootState } from "../../redux/store";
import SidebarBoardCard from "./components/sidebar-board";
import PopupWrapper from "../popups/popup-wrapper";
import NewBoardPopup from "../popups/newBoard/new-board-popup";

import "./sidebar.scss";
export default function Sidebar() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
	const boards = useSelector((state: RootState) => state.app.boards);
	const [isNewBoardPopupVisible, setIsNewBoardPopupVisible] = useState(false);

	const addNewBoad = () => {
		setIsNewBoardPopupVisible(true);
	};

	const handleClosePopup = () => {
		setIsNewBoardPopupVisible(false);
	};

	return (
		<>
			<div className={`sidebar ${isDarkTheme ? "dark" : "light"}`}>
				<div className="sidebar-kanban">
					<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
					<h2>Kanban</h2>
				</div>
				<div className="sidebar-boards">
					<span className="sidebar-boards-all">
						All boards ({boards.length})
					</span>
					{boards.map((board) => {
						return (
							<SidebarBoardCard
								boardName={board.title}
								key={board.title}
								isSelected={board.isSelected}
							/>
						);
					})}
					<div
						className="sidebar-board-card sidebar-new-board"
						onClick={addNewBoad}>
						<FontAwesomeIcon icon={faTableList} flip="both" />
						<span>+ Create New Board</span>
					</div>
				</div>
			</div>
			<PopupWrapper
				isVisible={isNewBoardPopupVisible}
				closePopup={handleClosePopup}
				content={<NewBoardPopup close={handleClosePopup} />}
			/>
		</>
	);
}
