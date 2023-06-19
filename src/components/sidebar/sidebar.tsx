import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import SidebarBoardCard from "./components/sidebar-board";

import "./sidebar.scss";

export default function Sidebar() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
	const boards = useSelector((state: RootState) => state.app.boards);

	return (
		<div className={`sidebar ${isDarkTheme ? "dark" : "light"}`}>
			<div className="sidebar-kanban">
				<FontAwesomeIcon icon={faBars} flip="vertical" size="lg" />
				<h2>Kanban</h2>
			</div>
			<div className="sidebar-boards">
				<span className="sidebar-boards-all">All boards ({boards.length})</span>
				{boards.map((board) => {
					return <SidebarBoardCard boardName={board.title} key={board.title} />;
				})}
			</div>
		</div>
	);
}
