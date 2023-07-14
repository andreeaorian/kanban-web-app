import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Task } from "../../../models";
import ColumnTask from "./column-task";

type BoardColumnProps = {
	columnName: string;
	color: string;
	tasks: Task[];
};

export default function BoardColumn({
	columnName,
	color,
	tasks,
}: BoardColumnProps) {
	return (
		<div className="board-column">
			<div className="board-column-header">
				<FontAwesomeIcon icon={faCircle} color={color} size="lg" />
				<span>{`${columnName} (${tasks.length})`}</span>
			</div>
			<div className="board-column-content">
				{tasks.map((task) => (
					<ColumnTask {...task} key={task.id} />
				))}
			</div>
		</div>
	);
}
