export default interface Task {
	title: string;
	description: string;
	subtasks: Task[];
	status: string;
}
