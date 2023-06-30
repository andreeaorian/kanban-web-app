import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Header from "../header/header";
import "./board.scss";
import BoardColumn from "./components/board-column";

export default function Board() {
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((b) => b.isSelected)
	);

	return (
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
	);
}
