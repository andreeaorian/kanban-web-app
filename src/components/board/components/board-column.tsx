import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Task, { SubTaskStatus } from "../../../models/task";
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
				{tasks.map((task) => {
					return (
						<ColumnTask
							title={task.title}
							subtasksNo={task.subtasks.length}
							doneSubtasks={
								task.subtasks.filter((x) => x.status === SubTaskStatus.Done)
									.length
							}
							key={task.title}
						/>
					);
				})}
			</div>
		</div>
	);
}
