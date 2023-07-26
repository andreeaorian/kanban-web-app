import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useOutsideClick } from "../../hooks/use-outside-click";

import "./drop-down-menu.scss";

export default function DropDownMenu({
	isBoardMenu,
	editHandler,
	deleteHandler,
	clickOutsideHandler,
}: {
	isBoardMenu: boolean;
	editHandler: () => void;
	deleteHandler: () => void;
	clickOutsideHandler: () => void;
}) {
	const isBoardMenuVisible = useSelector(
		(state: RootState) => state.app.isBoardMenuVisible
	);

	const ref = useOutsideClick(clickOutsideHandler);

	return (
		<>
			{isBoardMenuVisible && isBoardMenu && (
				<nav ref={ref} className="dropdown-menu">
					<ul>
						<li onClick={editHandler}>Edit board</li>
						<li onClick={deleteHandler}>Delete board</li>
					</ul>
				</nav>
			)}
		</>
	);
}
