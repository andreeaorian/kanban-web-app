import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBars,
	faTableList,
	faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import type { RootState } from "../../redux/store";
import SidebarBoardCard from "./components/sidebar-board";
import PopupWrapper from "../popups/popup-wrapper";
import HandleBoardPopup from "../popups/handleBoard/handle-board-popup";
import { resetBoard } from "../../redux/boardReducer";
import {
	changeSidebarVisibility,
	setNewBoardPopupVisibility,
} from "../../redux/appReducer";
import ThemeChanger from "./components/theme-changer";

import "./sidebar.scss";

export default function Sidebar() {
	const boards = useSelector((state: RootState) => state.app.boards);
	const isSidebarVisible = useSelector(
		(state: RootState) => state.app.showSidebar
	);
	const isNewBoardPopupVisible = useSelector(
		(state: RootState) => state.app.isNewBoardPopupVisible
	);
	const dispatch = useDispatch();

	const addNewBoad = () => {
		dispatch(setNewBoardPopupVisibility(true));
	};

	const handleClosePopup = () => {
		dispatch(setNewBoardPopupVisibility(false));
		dispatch(resetBoard());
	};

	const changeVisibility = () => dispatch(changeSidebarVisibility());

	return (
		<>
			<div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
				<div className="sidebar-kanban">
					<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
					<h2 className="heading">Kanban</h2>
				</div>
				<div className="sidebar-boards">
					<span className="sidebar-boards-all">
						All boards ({boards.length})
					</span>
					{boards.map(({ title, id, isSelected }) => (
						<SidebarBoardCard
							boardName={title}
							key={id}
							isSelected={isSelected}
						/>
					))}
					<div
						className="sidebar-board-card sidebar-new-board"
						onClick={addNewBoad}>
						<FontAwesomeIcon icon={faTableList} flip="both" />
						<span>+ Create Board</span>
					</div>
				</div>
				<div className="sidebar-bottom">
					<ThemeChanger />
					<div className="sidebar-hide-button" onClick={changeVisibility}>
						<FontAwesomeIcon icon={faEyeSlash} />
						<span>Hide Sidebar</span>
					</div>
				</div>
			</div>
			<PopupWrapper
				isVisible={isNewBoardPopupVisible}
				closePopup={handleClosePopup}>
				<HandleBoardPopup close={handleClosePopup} />
			</PopupWrapper>
		</>
	);
}
