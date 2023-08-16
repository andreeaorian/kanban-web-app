import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Task } from "../../../models";
import ColumnTask from "./column-task";
import { DraggableItemTypes } from "../../../utils/draggable-constants";
import { setTaskViewMode } from "../../../redux/appReducer";
import PopupWrapper from "../../popups/popup-wrapper";
import ViewTask from "../../popups/viewTask/view-task";
import { RootState } from "../../../redux/store";

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
	const isTaskViewModeOpen = useSelector(
		(state: RootState) => state.app.isTaskViewModeOpen
	);
	const [, drop] = useDrop({
		accept: DraggableItemTypes.TASK,
		drop: () => ({ name: columnName }),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});
	const dispatch = useDispatch();

	const closeTaskViewMode = () => dispatch(setTaskViewMode(false));

	return (
		<>
			<div ref={drop} className="board-column">
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
			<PopupWrapper
				isVisible={isTaskViewModeOpen}
				closePopup={closeTaskViewMode}>
				<ViewTask />
			</PopupWrapper>
		</>
	);
}
