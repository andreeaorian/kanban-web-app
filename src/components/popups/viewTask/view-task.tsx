import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { SubTaskStatus } from "../../../models";
import DropDownMenu from "../../drop-down-menu/drop-down-menu";
import {
	changeSubtaskStatus,
	changeTaskStatus,
	deleteTask,
	setTaskPopupVisibility,
	setTaskEditMode,
	setTaskViewMode,
} from "../../../redux/appReducer";
import useConfirm from "../../../hooks/use-confirm";

import "../form-content.scss";
import "./view-task.scss";

export default function ViewTask() {
	const [isTaskMenuVisible, setIsTaskMenuVisible] = useState(false);
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
	const selectedTask = useSelector(
		(state: RootState) => state.app.selectedTask
	);
	const dispatch = useDispatch();
	const [CustomConfirmDialog, confirm] = useConfirm(
		"Delete confirmation",
		`Are you sure you want to delete task ${selectedTask?.title} and all its subtasks?`
	);

	const changeStatusValue = (e: React.ChangeEvent<HTMLSelectElement>) =>
		dispatch(changeTaskStatus({ ...selectedTask!, status: e.target.value }));

	const changeSubtaskStatusValue = (
		e: React.ChangeEvent<HTMLInputElement>,
		title: string,
		id: string
	) => {
		dispatch(
			changeSubtaskStatus({
				taskId: selectedTask?.id!,
				subtask: { title, id, status: Number(e.target.checked) },
			})
		);
	};

	const openMenu = () => {
		setIsTaskMenuVisible(true);
	};

	const closeMenu = () => {
		setIsTaskMenuVisible(false);
	};

	const handleDelete = async () => {
		closeMenu();
		const ans = await confirm();
		if (ans) {
			dispatch(deleteTask(selectedTask!));
			dispatch(setTaskViewMode(false));
		}
	};

	const handleEdit = () => {
		dispatch(setTaskPopupVisibility(true));
		dispatch(setTaskEditMode(true));
		dispatch(setTaskViewMode(false));
	};

	return (
		<>
			<div className="title">
				<h2 className="heading">{selectedTask?.title}</h2>
				<FontAwesomeIcon
					icon={faEllipsisVertical}
					size="lg"
					onClick={openMenu}
				/>
			</div>

			<div className="form">
				<div className="form-list-item description">
					{selectedTask?.description}
				</div>

				{!!selectedTask?.subtasks && selectedTask.subtasks.length > 0 && (
					<div className="form-list-item">
						<div>
							Subtasks (
							{`${
								selectedTask?.subtasks.filter(
									(x) => x.status === SubTaskStatus.Done
								).length
							} of ${selectedTask?.subtasks.length}`}
							)
						</div>

						{selectedTask?.subtasks.map(({ title, id, status }) => (
							<div
								key={id}
								className={`subtask ${
									status === SubTaskStatus.Done ? "done" : ""
								}`}>
								<input
									className="subtask-checkbox"
									type="checkbox"
									checked={!!status}
									onChange={(e) => changeSubtaskStatusValue(e, title, id)}
								/>
								{title}
							</div>
						))}
					</div>
				)}

				<div className="form-simple-item">
					<label htmlFor="status">Status</label>
					<div className="select">
						<select
							name="status"
							id="status"
							value={selectedTask?.status}
							onChange={changeStatusValue}>
							{selectedBoard?.columns?.map(({ title }) => (
								<option key={title} value={title}>
									{title}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			<DropDownMenu
				isVisible={isTaskMenuVisible}
				clickOutsideHandler={closeMenu}
				buttons={[
					{ text: "Edit task", onClickHandler: handleEdit },
					{ text: "Delete task", onClickHandler: handleDelete },
				]}
			/>
			<CustomConfirmDialog />
		</>
	);
}
