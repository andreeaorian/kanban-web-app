import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { SubTaskStatus, Task } from "../../../models";
import DropDownMenu from "../../drop-down-menu/drop-down-menu";
import {
	changeSubtaskStatus,
	changeTaskMenuVisibility,
	changeTaskStatus,
} from "../../../redux/appReducer";

import "../form-content.scss";
import "./view-task.scss";

export default function ViewTask({ task }: { task: Task }) {
	const [taskState, setTaskState] = useState<Task>();
	const selectedBoard = useSelector((state: RootState) =>
		state.app.boards.find((x) => x.isSelected)
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!!task) {
			setTaskState(task);
		}
	}, [task]);

	const changeStatusValue = (e: React.ChangeEvent<HTMLSelectElement>) =>
		dispatch(changeTaskStatus({ ...taskState!, status: e.target.value }));

	const changeSubtaskStatusValue = (
		e: React.ChangeEvent<HTMLInputElement>,
		title: string,
		id: string
	) => {
		dispatch(
			changeSubtaskStatus({
				taskId: taskState?.id!,
				subtask: { title, id, status: Number(e.target.checked) },
			})
		);
	};

	const openMenu = () => {
		dispatch(changeTaskMenuVisibility());
	};

	return (
		<>
			<div className="title">
				<h2 className="heading">{taskState?.title}</h2>
				<FontAwesomeIcon
					icon={faEllipsisVertical}
					size="lg"
					onClick={openMenu}
				/>
			</div>
			<DropDownMenu
				clickOutsideHandler={() => dispatch(changeTaskMenuVisibility())}
				editHandler={() => console.log("task")}
				deleteHandler={() => console.log("task")}
			/>
			<div className="form">
				<div className="form-list-item description">
					{taskState?.description}
				</div>

				{taskState?.subtasks?.length! > 0 && (
					<div className="form-list-item">
						<div>
							Subtasks (
							{`${
								taskState?.subtasks.filter(
									(x) => x.status === SubTaskStatus.Done
								).length
							} of ${taskState?.subtasks.length}`}
							)
						</div>

						{taskState?.subtasks.map(({ title, id, status }) => (
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
							value={taskState?.status}
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
		</>
	);
}
