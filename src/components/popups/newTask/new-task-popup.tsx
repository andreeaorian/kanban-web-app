import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
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
import useTaskValidation from "../../../utils/validators/task-validator";
import ActionableInput from "../components/actionable-input";

import "./new-task-popup.scss";

export default function NewTaskPopup({ close }: { close: () => void }) {
	const newTask = useSelector((state: RootState) => state.task);
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
	const [isNewSubtaskInputVisible, setIsNewSubtaskInputVisible] =
		useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();
	const dispatch = useDispatch();
	const { validateTask } = useTaskValidation();
	const allSubtasksTitles = useMemo(() => {
		return newTask.subtasks.map((x) => x.title);
	}, [newTask]);

	useEffect(() => {
		setSelectedStatus(selectedBoard?.columns[0].title!);
	}, [selectedBoard]);

	const addNewSubtask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsNewSubtaskInputVisible(true);
	};

	const saveSubtask = useCallback(
		(name: string) => {
			dispatch(addSubtask({ title: name, status: SubTaskStatus.Todo }));
			setIsNewSubtaskInputVisible(false);
		},
		[dispatch]
	);

	const saveTask = () => {
		const validationResult = validateTask(newTask);
		setValidationResult(validationResult);
		console.log(validationResult);

		if (Object.keys(validationResult).length === 0) {
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
		}
	};

	const changeDescriptionHandler = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => dispatch(changeDescription(e.target.value));

	const revertCreatingSubtask = () => setIsNewSubtaskInputVisible(false);

	const changeStatusValue = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setSelectedStatus(e.target.value);

	return (
		<>
			<h2>Add new task</h2>
			<form className="task-form">
				<div className="task-title">
					<label className="label-error" htmlFor="taskTitle">
						Title
						{!!validationResult && !!validationResult["taskTitle"] && (
							<span className="error">{validationResult["taskTitle"]}</span>
						)}
					</label>
					<input
						className={
							!!validationResult && !!validationResult["taskTitle"]
								? "error"
								: ""
						}
						name="taskTitle"
						id="taskTitle"
						placeholder="e.g. Take coffee break"
						onChange={({ target }) => dispatch(changeTitle(target.value))}
					/>
				</div>

				<div className="task-description">
					<label className="label-error" htmlFor="taskDescription">
						Title
						{!!validationResult && !!validationResult["taskDescription"] && (
							<span className="error">
								{validationResult["taskDescription"]}
							</span>
						)}
					</label>
					<textarea
						className={
							!!validationResult && !!validationResult["taskDescription"]
								? "error"
								: ""
						}
						name="taskDescription"
						id="taskDescription"
						placeholder="e.g. It's always good to take a break. This 15 break will recharge your batteries a little"
						onChange={changeDescriptionHandler}
					/>
				</div>

				<div className="task-subtasks">
					<div>Subtasks</div>
					{newTask.subtasks.length > 0 && (
						<div className="subtasks-list">
							{newTask.subtasks.map((s) => {
								const deleteSubTask = () => dispatch(deleteSubtask(s.title));

								return (
									<div className="subtask" key={s.title}>
										<div className="subtask-title">{s.title}</div>
										<div className="subtask-icons">
											<FontAwesomeIcon icon={faPenToSquare} />
											<FontAwesomeIcon icon={faTrash} onClick={deleteSubTask} />
										</div>
									</div>
								);
							})}
						</div>
					)}
					{isNewSubtaskInputVisible && (
						<ActionableInput
							inputName="newSubtask"
							inputPlaceholder="e.g. Make coffee"
							hasColor={false}
							similarNames={allSubtasksTitles}
							save={saveSubtask}
							revertChanges={revertCreatingSubtask}
						/>
					)}

					<button
						className="new-task-button"
						hidden={isNewSubtaskInputVisible}
						onClick={addNewSubtask}>
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
							onChange={changeStatusValue}>
							{selectedBoard?.columns?.map(({ title }) => (
								<option key={title} value={title}>
									{title}
								</option>
							))}
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
