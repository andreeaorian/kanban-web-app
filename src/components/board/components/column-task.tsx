import { useDrag, DragSourceMonitor } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { SubTaskStatus, Task } from "../../../models";
import { changeTaskStatus, setTaskViewMode } from "../../../redux/appReducer";
import { RootState } from "../../../redux/store";
import { DraggableItemTypes } from "../../../utils/draggable-constants";
import PopupWrapper from "../../popups/popup-wrapper";
import ViewTask from "../../popups/viewTask/view-task";

export default function ColumnTask(task: Task) {
	const isTaskViewModeOpen = useSelector(
		(state: RootState) => state.app.isTaskViewModeOpen
	);
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
	};

	const closeTaskViewMode = () => dispatch(setTaskViewMode(false));

	return (
		<>
			<div ref={drag} className="column-task" style={{ opacity }}>
				<div className="column-task-title" onClick={viewTask}>
					{task.title}
				</div>
				<div className="column-task-info">{`${doneSubtasks} of ${task.subtasks.length} subtasks`}</div>
			</div>
			<PopupWrapper
				isVisible={isTaskViewModeOpen}
				closePopup={closeTaskViewMode}>
				<ViewTask task={task} />
			</PopupWrapper>
		</>
	);
}
