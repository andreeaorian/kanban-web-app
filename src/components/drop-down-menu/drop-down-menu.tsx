import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useOutsideClick } from "../../hooks/use-outside-click";

import "./drop-down-menu.scss";

export default function DropDownMenu({
	editHandler,
	deleteHandler,
	clickOutsideHandler,
}: {
	editHandler: () => void;
	deleteHandler: () => void;
	clickOutsideHandler: () => void;
}) {
	const isBoardMenuVisible = useSelector(
		(state: RootState) => state.app.isBoardMenuVisible
	);
	const isTaskMenuVisible = useSelector(
		(state: RootState) => state.app.isTaskMenuVisible
	);
	const ref = useOutsideClick(clickOutsideHandler);
	const entity = isBoardMenuVisible ? "board" : "task";

	return (
		<>
			{(isBoardMenuVisible || isTaskMenuVisible) && (
				<nav ref={ref} className="dropdown-menu">
					<ul>
						<li onClick={editHandler}>{`Edit ${entity}`}</li>
						<li onClick={deleteHandler}>{`Delete ${entity}`}</li>
					</ul>
				</nav>
			)}
		</>
	);
}
