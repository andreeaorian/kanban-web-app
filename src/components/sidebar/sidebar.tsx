import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

import "./sidebar.scss";

export default function Sidebar() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

	return (
		<div className={`sidebar ${isDarkTheme ? "dark" : "light"}`}>Sidebar</div>
	);
}
