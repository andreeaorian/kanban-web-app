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
import {
	changeSidebarVisibility,
	setBoardEditMode,
	setBoardPopupVisibility,
} from "../../redux/appReducer";
import ThemeChanger from "./components/theme-changer";

import "./sidebar.scss";
import useDisplaySize from "../../hooks/use-display-size";

export default function Sidebar() {
	const boards = useSelector((state: RootState) => state.app.boards);
	const isSidebarVisible = useSelector(
		(state: RootState) => state.app.showSidebar
	);
	const isNewBoardPopupVisible = useSelector(
		(state: RootState) => state.app.isBoardPopupVisible
	);
	const dispatch = useDispatch();
	const isDesktop = useDisplaySize();

	const addNewBoad = () => {
		dispatch(setBoardPopupVisibility(true));
	};

	const handleClosePopup = () => {
		dispatch(setBoardPopupVisibility(false));
		dispatch(setBoardEditMode(false));
	};

	const changeVisibility = () => dispatch(changeSidebarVisibility());

	return (
		<>
			<div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
				{isDesktop && (
					<div className="sidebar-kanban">
						<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
						<h2 className="heading">Kanban</h2>
					</div>
				)}
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
					{isDesktop && (
						<div className="sidebar-hide-button" onClick={changeVisibility}>
							<FontAwesomeIcon icon={faEyeSlash} />
							<span>Hide Sidebar</span>
						</div>
					)}
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
