import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import useTaskValidation from "../../../hooks/use-task-validator";
import ActionableInput from "../components/actionable-input";
import PopupListActionableValue from "../components/popup-list-actionable-value";

import "../form-content.scss";

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

	const allSubtasksTitles = useMemo(
		() => newTask.subtasks.map((x) => x.title),
		[newTask]
	);
	const isTitleInvalid = useMemo(
		() => !!validationResult && !!validationResult.taskTitle,
		[validationResult]
	);

	const isDescriptionInvalid = useMemo(
		() => !!validationResult && !!validationResult.taskDescription,
		[validationResult]
	);

	useEffect(() => {
		setSelectedStatus(selectedBoard?.columns[0].title!);
	}, [selectedBoard]);

	const addNewSubtask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsNewSubtaskInputVisible(true);
	};

	const saveSubtask = useCallback(
		(name: string) => {
			const id = generateId();
			dispatch(addSubtask({ id: id, title: name, status: SubTaskStatus.Todo }));
			setIsNewSubtaskInputVisible(false);
		},
		[dispatch]
	);

	const saveTask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const validationResult = validateTask(newTask);
		setValidationResult(validationResult);

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

	const deleteSubtaskHandler = (id: string) => dispatch(deleteSubtask(id));

	return (
		<>
			<h2 className="heading">Add new task</h2>
			<form className="form">
				<div className="form-simple-item">
					<label className="label-error" htmlFor="taskTitle">
						Title
						{isTitleInvalid && (
							<span className="error">{validationResult?.taskTitle}</span>
						)}
					</label>
					<input
						className={isTitleInvalid ? "error" : ""}
						name="taskTitle"
						id="taskTitle"
						placeholder="e.g. Take coffee break"
						onChange={({ target }) => dispatch(changeTitle(target.value))}
					/>
				</div>

				<div className="form-simple-item">
					<label className="label-error" htmlFor="taskDescription">
						Title
						{isDescriptionInvalid && (
							<span className="error">{validationResult?.taskDescription}</span>
						)}
					</label>
					<textarea
						className={isDescriptionInvalid ? "error" : ""}
						name="taskDescription"
						id="taskDescription"
						placeholder="e.g. It's always good to take a break. This 15 break will recharge your batteries a little"
						onChange={changeDescriptionHandler}
					/>
				</div>

				<div className="form-list-item">
					<div>Subtasks</div>
					{newTask.subtasks.length > 0 &&
						newTask.subtasks.map(({ title, id }) => (
							<PopupListActionableValue
								id={id}
								title={title}
								hasColor={false}
								key={id}
								deleteHandler={deleteSubtaskHandler}
							/>
						))}
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
						className="create-button"
						hidden={isNewSubtaskInputVisible}
						onClick={addNewSubtask}>
						Add new subtask
					</button>
				</div>

				<div className="form-simple-item">
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

				<div className="form-buttons">
					<button
						className="submit-button"
						disabled={isNewSubtaskInputVisible}
						onClick={saveTask}>
						Create task
					</button>
				</div>
			</form>
		</>
	);
}
