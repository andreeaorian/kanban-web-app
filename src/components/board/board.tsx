import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Header from "../header/header";
import "./board.scss";

export default function Board() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

	return (
		<div className={`board ${isDarkTheme ? "dark" : "light"}`}>
			<Header />
			<div>THis is the board</div>
		</div>
	);
}
