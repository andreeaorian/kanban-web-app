import "./App.scss";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { Sidebar, Board } from "./components";

function App() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

	return (
		<div className={`App ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
			<Sidebar />
			<Board />
		</div>
	);
}

export default App;
