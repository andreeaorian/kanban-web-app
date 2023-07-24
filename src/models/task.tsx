export enum SubTaskStatus {
	Todo,
	Done,
}

export interface SubTask {
	id: string;
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
