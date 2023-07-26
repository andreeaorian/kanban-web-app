import { useDrag, DragSourceMonitor } from "react-dnd";
import { useDispatch } from "react-redux";
import { SubTaskStatus, Task } from "../../../models";
import {
	changeTaskStatus,
	setSelectedTask,
	setTaskViewMode,
} from "../../../redux/appReducer";
import { DraggableItemTypes } from "../../../utils/draggable-constants";

export default function ColumnTask(task: Task) {
	const dispatch = useDispatch();
	const [{ isDragging }, drag] = useDrag({
		type: DraggableItemTypes.TASK,
		item: { name: task.title, type: DraggableItemTypes.TASK },
		end: (_, monitor: DragSourceMonitor) => {
			const dropResult = monitor.getDropResult() as { name: string };
			if (dropResult) {
				dispatch(changeTaskStatus({ ...task, status: dropResult.name }));
			}
		},
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	const opacity = isDragging ? 0 : 1;
	const doneSubtasks = task.subtasks.filter(
		(x) => x.status === SubTaskStatus.Done
	).length;

	const viewTask = () => {
		dispatch(setTaskViewMode(true));
		dispatch(setSelectedTask(task));
	};

	return (
		<>
			<div ref={drag} className="column-task" style={{ opacity }}>
				<div className="column-task-title" onClick={viewTask}>
					{task.title}
				</div>
				<div className="column-task-info">{`${doneSubtasks} of ${task.subtasks.length} subtasks`}</div>
			</div>
		</>
	);
}
