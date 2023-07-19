import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useOutsideClick } from "../../../hooks/use-outside-click";

import "./board-drop-down-menu.scss";
import { changeBoardMenuVisibility } from "../../../redux/appReducer";

export function BoardDropDownMenu() {
	const isBoardMenuVisible = useSelector(
		(state: RootState) => state.app.isBoardMenuVisible
	);
	const dispatch = useDispatch();

	const handleClickOutside = () => {
		dispatch(changeBoardMenuVisibility());
	};

	const ref = useOutsideClick(handleClickOutside);

	return isBoardMenuVisible ? (
		<nav ref={ref} className="dropdown-menu">
			<ul>
				<li>Edit board</li>
				<li>Delete board</li>
			</ul>
		</nav>
	) : null;
}
