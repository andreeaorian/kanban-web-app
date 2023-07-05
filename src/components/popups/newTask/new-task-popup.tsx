import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	faXmark,
	faCheck,
	faTrash,
	faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../../../redux/store";
import {
	changeTitle,
	changeDescription,
	addSubtask,
	deleteSubtask,
	resetTask,
} from "../../../redux/taskReducer";
import { addTaskToBoard } from "../../../redux/appReducer";
import { SubTaskStatus } from "../../../models";
import { generateId } from "../../../utils/id-generator";

import "./new-task-popup.scss";

export default function NewTaskPopup({ close }: { close: () => void }) {
	const newTask = useSelector((state: RootState) => state.task);
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
	const [isNewSubtaskInputVisible, setIsNewSubtaskInputVisible] =
		useState(false);
	const [selectedStatus, setSelectedStatus] = useState(
		selectedBoard?.columns[0].title
	);
	const [newSubtask, setNewSubtask] = useState("");
	const dispatch = useDispatch();

	const addNewSubtask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsNewSubtaskInputVisible(true);
	};

	const saveSubtask = () => {
		dispatch(addSubtask({ title: newSubtask, status: SubTaskStatus.Todo }));
		setIsNewSubtaskInputVisible(false);
	};

	const saveTask = () => {
		const taskId = generateId();
		dispatch(
			addTaskToBoard({
				...newTask,
				status: selectedStatus!,
				boardId: selectedBoard?.id!,
				id: taskId,
			})
		);
		dispatch(resetTask());
		close();
	};

	return (
		<>
			<h2>Add new task</h2>
			<form className="task-form">
				<div className="task-title">
					<label htmlFor="taskTitle">Title</label>
					<input
						name="taskTitle"
						id="taskTitle"
						placeholder="e.g. Take coffee break"
						onChange={({ target }) => dispatch(changeTitle(target.value))}
					/>
				</div>

				<div className="task-description">
					<label htmlFor="taskDescription">Description</label>
					<textarea
						name="taskDescription"
						id="taskDescription"
						placeholder="e.g. It's always good to take a break. This 15 break will recharge your batteries a little"
						onChange={({ target }) => dispatch(changeDescription(target.value))}
					/>
				</div>

				<div className="task-subtasks">
					<div>Subtasks</div>
					{newTask.subtasks.length > 0 && (
						<div className="subtasks-list">
							{newTask.subtasks.map((s) => {
								return (
									<div className="subtask" key={s.title}>
										<div className="subtask-title">{s.title}</div>
										<div className="subtask-icons">
											<FontAwesomeIcon icon={faPenToSquare} />
											<FontAwesomeIcon
												icon={faTrash}
												onClick={() => dispatch(deleteSubtask(s.title))}
											/>
										</div>
									</div>
								);
							})}
						</div>
					)}
					{isNewSubtaskInputVisible && (
						<div className="task-new-subtask">
							<input
								type="text"
								placeholder="e.g. Make coffee"
								onChange={({ target }) => setNewSubtask(target.value)}
							/>
							<FontAwesomeIcon icon={faCheck} size="lg" onClick={saveSubtask} />
							<FontAwesomeIcon
								icon={faXmark}
								size="lg"
								onClick={() => setIsNewSubtaskInputVisible(false)}
							/>
						</div>
					)}

					<button className="new-task-button" onClick={addNewSubtask}>
						Add new subtask
					</button>
				</div>

				<div className="task-status">
					<label htmlFor="status">Status</label>
					<div className="select">
						<select
							name="status"
							id="status"
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}>
							{selectedBoard?.columns?.map((c) => {
								return (
									<option key={c.title} value={c.title}>
										{c.title}
									</option>
								);
							})}
						</select>
					</div>
				</div>
			</form>
			<button className="task-button" onClick={saveTask}>
				Create task
			</button>
		</>
	);
}