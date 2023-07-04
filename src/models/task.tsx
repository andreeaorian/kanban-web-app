export enum SubTaskStatus {
	Todo,
	Done,
}

interface SubTask {
	title: string;
	status: SubTaskStatus;
}

export default interface Task {
	id: string;
	title: string;
	description: string;
	subtasks: SubTask[];
	status: string;
	boardId: string;
}
