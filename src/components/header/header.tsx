import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";

import "./header.scss";

export default function Header() {
	const board = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);
	const isSidebarVisible = useSelector(
		(state: RootState) => state.app.showSidebar
	);

	return (
		<header className="header">
			<h2 className="header-board-title">
				{!isSidebarVisible && (
					<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
				)}
				<span>{board?.title}</span>
			</h2>
			<button className="header-new-task">
				<FontAwesomeIcon icon={faPlus} />
				<span>Add new task</span>
			</button>
		</header>
	);
}
