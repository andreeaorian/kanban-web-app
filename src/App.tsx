import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { RootState } from "./redux/store";
import { Sidebar, Board } from "./components";
import { useTouchDevice } from "./hooks/use-touch-device";

import "./App.scss";

function App() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
	const isTouchDevice = useTouchDevice();
	const backendForDndProvider = isTouchDevice ? TouchBackend : HTML5Backend;

	return (
		<DndProvider backend={backendForDndProvider}>
			<div className={`App ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
				<Sidebar />
				<Board />
			</div>
		</DndProvider>
	);
}

export default App;
