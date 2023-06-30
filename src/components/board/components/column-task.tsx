type ColumnTaskProps = {
	title: string;
	subtasksNo: number;
	doneSubtasks: number;
};
export default function ColumnTask({
	title,
	subtasksNo,
	doneSubtasks,
}: ColumnTaskProps) {
	return (
		<div className="column-task">
			<div className="column-task-title">{title}</div>
			<div className="column-task-info">{`${doneSubtasks} of ${subtasksNo} subtasks`}</div>
		</div>
	);
}
