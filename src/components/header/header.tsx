import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./header.scss";

export default function Header() {
	const board = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

	return (
		<header className={`header ${isDarkTheme ? "dark" : "light"}`}>
			<h2 className="header-board-title">{board?.title}</h2>
			<button className="header-new-task">
				<FontAwesomeIcon icon={faPlus} />
				<span>Add new task</span>
			</button>
		</header>
	);
}
