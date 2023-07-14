import { SubTaskStatus, Task } from "../../../models";

export default function ColumnTask({ title, subtasks }: Task) {
	const doneSubtasks = subtasks.filter(
		(x) => x.status === SubTaskStatus.Done
	).length;

	return (
		<div className="column-task">
			<div className="column-task-title">{title}</div>
			<div className="column-task-info">{`${doneSubtasks} of ${subtasks.length} subtasks`}</div>
		</div>
	);
}
