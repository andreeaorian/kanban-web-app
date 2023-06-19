import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableList } from "@fortawesome/free-solid-svg-icons";

import "../sidebar.scss";
import { useState } from "react";

export default function SidebarBoardCard({
	boardName,
	key,
}: {
	boardName: string;
	key: string;
}) {
	const [isSelected, setIsSelected] = useState(false);
	return (
		<div
			key={key}
			className={`sidebar-board-card ${isSelected ? "selected" : ""}`}
			onClick={() => setIsSelected(true)}>
			<FontAwesomeIcon icon={faTableList} flip="both" size="lg" />
			<span>{boardName}</span>
		</div>
	);
}
