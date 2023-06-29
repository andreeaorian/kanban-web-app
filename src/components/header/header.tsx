import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";

import "./header.scss";

export default function Header() {
	const board = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);

	return (
		<header className="header">
			<h2 className="header-board-title">{board?.title}</h2>
			<button className="header-new-task">
				<FontAwesomeIcon icon={faPlus} />
				<span>Add new task</span>
			</button>
		</header>
	);
}
