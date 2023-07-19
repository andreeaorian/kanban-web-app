import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useOutsideClick } from "../../../hooks/use-outside-click";
import useConfirm from "../../../hooks/use-confirm";
import {
	changeBoardMenuVisibility,
	deleteBoard,
} from "../../../redux/appReducer";

import "./board-drop-down-menu.scss";

export function BoardDropDownMenu() {
	const isBoardMenuVisible = useSelector(
		(state: RootState) => state.app.isBoardMenuVisible
	);
	const selectedBoad = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
	const dispatch = useDispatch();
	const [CustomConfirmDialog, confirm] = useConfirm(
		"Delete confirmation",
		`Are you sure you want to delete board ${selectedBoad?.title} and all its content?`
	);

	const handleClickOutside = () => {
		dispatch(changeBoardMenuVisibility());
	};

	const ref = useOutsideClick(handleClickOutside);

	const handleDelete = async () => {
		dispatch(changeBoardMenuVisibility());
		const ans = await confirm();
		if (ans) {
			dispatch(deleteBoard(selectedBoad?.id!));
		}
	};

	return (
		<>
			{isBoardMenuVisible && (
				<nav ref={ref} className="dropdown-menu">
					<ul>
						<li>Edit board</li>
						<li onClick={handleDelete}>Delete board</li>
					</ul>
				</nav>
			)}
			<CustomConfirmDialog />
		</>
	);
}
