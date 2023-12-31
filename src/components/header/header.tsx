import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faBars,
	faEllipsisVertical,
	faEye,
	faAngleDown,
	faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";
import PopupWrapper from "../popups/popup-wrapper";
import HandleTaskPopup from "../popups/handleTask/handle-task-popup";
import {
	changeSidebarVisibility,
	deleteBoard,
	setBoardEditMode,
	setBoardPopupVisibility,
	setTaskEditMode,
	setTaskPopupVisibility,
} from "../../redux/appReducer";
import DropDownMenu from "../drop-down-menu/drop-down-menu";
import useConfirm from "../../hooks/use-confirm";
import useDisplaySize from "../../hooks/use-display-size";

import "./header.scss";

export default function Header() {
	const [isBoardMenuVisible, setIsBoardMenuVisible] = useState(false);
	const board = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);
	const isSidebarVisible = useSelector(
		(state: RootState) => state.app.showSidebar
	);
	const isNewTaskPopupVisible = useSelector(
		(state: RootState) => state.app.isTaskPopupVisible
	);

	const dispatch = useDispatch();
	const [CustomConfirmDialog, confirm] = useConfirm(
		"Delete confirmation",
		`Are you sure you want to delete board ${board?.title} and all its content?`
	);
	const isDesktop = useDisplaySize();

	const openNewTaskPopup = () => {
		dispatch(setTaskPopupVisibility(true));
	};

	const closeTaskPopup = () => {
		dispatch(setTaskPopupVisibility(false));
		dispatch(setTaskEditMode(false));
	};

	const openMenu = () => {
		setIsBoardMenuVisible(true);
	};

	const closeMenu = () => {
		setIsBoardMenuVisible(false);
	};

	const handleDelete = async () => {
		closeMenu();
		const ans = await confirm();
		if (ans) {
			dispatch(deleteBoard(board?.id!));
		}
	};

	const changeVisibilityOfSidebar = () => {
		dispatch(changeSidebarVisibility());
	};

	const handleEdit = () => {
		dispatch(setBoardPopupVisibility(true));
		dispatch(setBoardEditMode(true));
		closeMenu();
	};

	const displaySidebarButtons = () => {
		if (isDesktop && !isSidebarVisible) {
			return (
				<div
					className="header-show-sidebar-button"
					onClick={changeVisibilityOfSidebar}>
					<FontAwesomeIcon icon={faEye} />
					<span>Show Sidebar</span>
				</div>
			);
		}
		if (!isDesktop) {
			return isSidebarVisible ? (
				<div className="header-arrow-buttons">
					<FontAwesomeIcon
						icon={faAngleUp}
						size="lg"
						onClick={changeVisibilityOfSidebar}
					/>
				</div>
			) : (
				<div className="header-arrow-buttons">
					<FontAwesomeIcon
						icon={faAngleDown}
						size="lg"
						onClick={changeVisibilityOfSidebar}
					/>
				</div>
			);
		}
	};

	return (
		<>
			<header className="header">
				<h2 className="heading header-board-title">
					{(!isSidebarVisible || !isDesktop) && (
						<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
					)}
					<span>{board?.title}</span>
				</h2>
				{displaySidebarButtons()}
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

				<DropDownMenu
					isVisible={isBoardMenuVisible}
					clickOutsideHandler={closeMenu}
					buttons={[
						{ text: "Edit board", onClickHandler: handleEdit },
						{ text: "Delete board", onClickHandler: handleDelete },
					]}
				/>

				<CustomConfirmDialog />
			</header>
			<PopupWrapper
				isVisible={isNewTaskPopupVisible}
				closePopup={closeTaskPopup}>
				<HandleTaskPopup close={closeTaskPopup} />
			</PopupWrapper>
		</>
	);
}
