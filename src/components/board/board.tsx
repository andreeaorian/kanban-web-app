import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RootState } from "../../redux/store";
import BoardColumn from "./components/board-column";
import Header from "../header/header";

import "./board.scss";

export default function Board() {
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);

	return (
		<DndProvider backend={HTML5Backend}>
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
