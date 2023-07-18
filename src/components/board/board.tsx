import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { RootState } from "../../redux/store";
import BoardColumn from "./components/board-column";
import Header from "../header/header";

import "./board.scss";
import { useTouchDevice } from "../../hooks/use-touch-device";

export default function Board() {
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);
	const isTouchDevice = useTouchDevice();
	const backendForDndProvider = isTouchDevice ? TouchBackend : HTML5Backend;

	return (
		<DndProvider backend={backendForDndProvider}>
			<div className="board">
				<Header />
				<div className="board-content">
					{selectedBoard?.columns.map((column) => {
						return (
							<BoardColumn
								columnName={column.title}
								color={column.color}
								key={column.title}
								tasks={selectedBoard.tasks.filter(
									(t) => t.status === column.title
								)}
							/>
						);
					})}
				</div>
			</div>
		</DndProvider>
	);
}
