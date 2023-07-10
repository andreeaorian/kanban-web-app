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
import useTaskValidation from "../../../utils/validators/task-validator";
import { isEmpty } from "../../../utils/utils";

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
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();
	const dispatch = useDispatch();
	const { validateTask } = useTaskValidation();

	const addNewSubtask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsNewSubtaskInputVisible(true);
	};

	const isNewSubtaskValid = (): boolean => {
		if (isEmpty(newSubtask)) {
			setValidationResult((prevState) => {
				return {
					...prevState,
					...{ newSubtask: "Subtask title is Required" },
				};
			});

			return false;
		}

		const allSubtasksTitles = newTask.subtasks.map((x) => x.title);
		if (allSubtasksTitles.includes(newSubtask)) {
			setValidationResult((prevState) => {
				return {
					...prevState,
					...{ newSubtask: "Subtask title should be unique" },
				};
			});

			return false;
		}

		return true;
	};

	const saveSubtask = () => {
		if (isNewSubtaskValid()) {
			dispatch(addSubtask({ title: newSubtask, status: SubTaskStatus.Todo }));
			setIsNewSubtaskInputVisible(false);
			setValidationResult((prevState) => {
				const filteredValidations: Record<string, string> = {};
				for (let key in prevState) {
					if (key !== "newSubtask") {
						filteredValidations[key] = prevState[key];
					}
				}

				return filteredValidations;
			});
		}
	};

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

	const createNewSubtask = (e: React.ChangeEvent<HTMLInputElement>): void =>
		setNewSubtask(e.target.value);

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
						<div className="task-new-subtask-with-errors">
							{!!validationResult && !!validationResult["newSubtask"] && (
								<span className="error">{validationResult["newSubtask"]}</span>
							)}
							<div className="task-new-subtask">
								<input
									className={
										!!validationResult && !!validationResult["newSubtask"]
											? "error"
											: ""
									}
									type="text"
									placeholder="e.g. Make coffee"
									onChange={createNewSubtask}
								/>
								<FontAwesomeIcon
									icon={faCheck}
									size="lg"
									onClick={saveSubtask}
								/>
								<FontAwesomeIcon
									icon={faXmark}
									size="lg"
									onClick={revertCreatingSubtask}
								/>
							</div>
						</div>
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
