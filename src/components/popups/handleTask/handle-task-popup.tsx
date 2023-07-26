import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useReducer,
	Reducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addTaskToBoard, editTask } from "../../../redux/appReducer";
import { SubTask, SubTaskStatus, Task } from "../../../models";
import { generateId } from "../../../utils/id-generator";
import useTaskValidation from "../../../hooks/use-task-validator";
import ActionableInput from "../components/actionable-input";
import PopupListActionableValue from "../components/popup-list-actionable-value";

import "../form-content.scss";

const initialTask: Task = {
	id: "",
	title: "",
	description: "",
	subtasks: [],
	status: "",
	boardId: "",
};

enum TaskActionTypes {
	SET_TASK = "SET_TASK",
	SET_BOARD_ID = "SET_BOARD_ID",
	CHANGE_TITLE = "CHANGE_TITLE",
	CHANGE_DESCRIPTION = "CHANGE_DESCRIPTION",
	CHANGE_STATUS = "CHANGE_STATUS",
	ADD_SUBTASK = "ADD_SUBTASK",
	EDIT_SUBTASK = "EDIT_SUBTASK",
	DELETE_SUBTASK = "DELETE_SUBTASK",
}

interface TaskAction {
	type: TaskActionTypes;
	payload: string | SubTask | Task;
}

interface TaskState {
	task: Task;
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
	const { type, payload } = action;
	switch (type) {
		case TaskActionTypes.SET_TASK:
			return { ...state, task: payload as Task };
		case TaskActionTypes.SET_BOARD_ID:
			return {
				...state,
				task: { ...state.task, boardId: payload as string },
			};
		case TaskActionTypes.CHANGE_TITLE:
			return {
				...state,
				task: { ...state.task, title: payload as string },
			};
		case TaskActionTypes.CHANGE_DESCRIPTION:
			return {
				...state,
				task: { ...state.task, description: payload as string },
			};
		case TaskActionTypes.CHANGE_STATUS:
			return {
				...state,
				task: { ...state.task, status: payload as string },
			};
		case TaskActionTypes.DELETE_SUBTASK:
			return {
				...state,
				task: {
					...state.task,
					subtasks: state.task.subtasks.filter((x) => x.id !== payload),
				},
			};
		case TaskActionTypes.ADD_SUBTASK:
			return {
				...state,
				task: {
					...state.task,
					subtasks: [...state.task.subtasks, payload as SubTask],
				},
			};
		case TaskActionTypes.EDIT_SUBTASK: {
			const modifiedSubtasks: SubTask[] = state.task.subtasks.map((subtask) => {
				const payloadSubtask = payload as SubTask;
				return subtask.id === payloadSubtask.id ? payloadSubtask : subtask;
			});

			return {
				...state,
				task: {
					...state.task,
					subtasks: [...modifiedSubtasks],
				},
			};
		}
		default:
			return state;
	}
}

export default function HandleTaskPopup({ close }: { close: () => void }) {
	const [taskState, reducerDispatch] = useReducer<
		Reducer<TaskState, TaskAction>
	>(taskReducer, {
		task: initialTask,
	});
	const isTaskInEdit = useSelector(
		(state: RootState) => state.app.isTaskInEdit
	);
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
	const selectedTask = useSelector(
		(state: RootState) => state.app.selectedTask
	);
	const [isNewSubtaskInputVisible, setIsNewSubtaskInputVisible] =
		useState(false);
	const [editingSubtaskId, setEditingSubtaskId] = useState("");
	const [validationResult, setValidationResult] =
		useState<Record<string, string>>();
	const { validateTask } = useTaskValidation();
	const reduxDispatch = useDispatch();

	const allSubtasksTitles = useMemo(
		() => taskState.task.subtasks.map((x) => x.title),
		[taskState]
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
		if (isTaskInEdit) {
			reducerDispatch({
				type: TaskActionTypes.SET_TASK,
				payload: { ...(selectedTask as Task) },
			});
		} else if (!!selectedBoard) {
			reducerDispatch({
				type: TaskActionTypes.CHANGE_STATUS,
				payload: selectedBoard?.columns[0].title,
			});
			reducerDispatch({
				type: TaskActionTypes.SET_BOARD_ID,
				payload: selectedBoard?.id,
			});
		}
	}, [isTaskInEdit, selectedTask, selectedBoard]);

	const addNewSubtask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsNewSubtaskInputVisible(true);
	};

	const editSubtaskHandler = (id: string) => {
		setEditingSubtaskId(id);
	};

	const saveEditSubtask = useCallback(
		(title: string, id?: string) => {
			const subtask = taskState?.task?.subtasks?.find((x) => x.id === id);
			reducerDispatch({
				type: TaskActionTypes.EDIT_SUBTASK,
				payload: { id: id!, title: title, status: subtask?.status! },
			});
			setEditingSubtaskId("");
		},
		[taskState.task.subtasks]
	);

	const saveSubtask = useCallback(
		(name: string) => {
			const id = generateId();
			reducerDispatch({
				type: TaskActionTypes.ADD_SUBTASK,
				payload: { id: id, title: name, status: SubTaskStatus.Todo },
			});
			setIsNewSubtaskInputVisible(false);
		},
		[reducerDispatch]
	);

	const saveTask = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const validationResult = validateTask(taskState.task);
		setValidationResult(validationResult);

		if (Object.keys(validationResult).length === 0) {
			if (isTaskInEdit) {
				reduxDispatch(editTask({ ...taskState.task }));
			} else {
				const taskId = generateId();
				reduxDispatch(
					addTaskToBoard({
						...taskState.task,
						id: taskId,
					})
				);
			}
			close();
		}
	};

	const changeDescriptionHandler = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) =>
		reducerDispatch({
			type: TaskActionTypes.CHANGE_DESCRIPTION,
			payload: e.target.value,
		});

	const revertChanges = () => {
		setIsNewSubtaskInputVisible(false);
		setEditingSubtaskId("");
	};

	const changeStatusValue = (e: React.ChangeEvent<HTMLSelectElement>) =>
		reducerDispatch({
			type: TaskActionTypes.CHANGE_STATUS,
			payload: e.target.value,
		});

	const deleteSubtaskHandler = (id: string) =>
		reducerDispatch({ type: TaskActionTypes.DELETE_SUBTASK, payload: id });

	const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
		reducerDispatch({
			type: TaskActionTypes.CHANGE_TITLE,
			payload: e.target.value,
		});

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
						value={taskState.task.title}
						onChange={changeTitleHandler}
					/>
				</div>

				<div className="form-simple-item">
					<label className="label-error" htmlFor="taskDescription">
						Description
						{isDescriptionInvalid && (
							<span className="error">{validationResult?.taskDescription}</span>
						)}
					</label>
					<textarea
						className={isDescriptionInvalid ? "error" : ""}
						name="taskDescription"
						id="taskDescription"
						value={taskState.task.description}
						placeholder="e.g. It's always good to take a break. This 15 break will recharge your batteries a little"
						onChange={changeDescriptionHandler}
					/>
				</div>

				<div className="form-list-item">
					<div>Subtasks</div>
					{taskState.task.subtasks.length > 0 &&
						taskState.task.subtasks.map((subtask: SubTask) => {
							return editingSubtaskId === subtask.id ? (
								<ActionableInput
									id={editingSubtaskId}
									inputNameValue={subtask.title}
									inputName="newColumn"
									inputPlaceholder="e.g. Testing"
									hasColor={false}
									similarNames={allSubtasksTitles}
									save={saveEditSubtask}
									revertChanges={revertChanges}
									key={subtask.id}
								/>
							) : (
								<PopupListActionableValue
									id={subtask.id}
									title={subtask.title}
									hasColor={false}
									key={subtask.id}
									editHandler={editSubtaskHandler}
									deleteHandler={deleteSubtaskHandler}
								/>
							);
						})}
					{isNewSubtaskInputVisible && (
						<ActionableInput
							inputName="newSubtask"
							inputPlaceholder="e.g. Make coffee"
							hasColor={false}
							similarNames={allSubtasksTitles}
							save={saveSubtask}
							revertChanges={revertChanges}
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
							value={taskState.task.status}
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
						{isTaskInEdit ? "Save" : "Create task"}
					</button>
				</div>
			</form>
		</>
	);
}
