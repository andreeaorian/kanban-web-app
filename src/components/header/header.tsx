import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faBars,
	faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";
import PopupWrapper from "../popups/popup-wrapper";
import HandleTaskPopup from "../popups/handleTask/handle-task-popup";
import {
	deleteBoard,
	setBoardEditMode,
	setBoardPopupVisibility,
	setTaskPopupVisibility,
} from "../../redux/appReducer";
import DropDownMenu from "../drop-down-menu/drop-down-menu";
import useConfirm from "../../hooks/use-confirm";

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

	const openNewTaskPopup = () => {
		dispatch(setTaskPopupVisibility(true));
	};

	const closeNewTaskPopup = () => {
		dispatch(setTaskPopupVisibility(false));
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

	const handleEdit = () => {
		dispatch(setBoardPopupVisibility(true));
		dispatch(setBoardEditMode(true));
		closeMenu();
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
				closePopup={closeNewTaskPopup}>
				<HandleTaskPopup close={closeNewTaskPopup} />
			</PopupWrapper>
		</>
	);
}
