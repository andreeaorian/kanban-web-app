import Column from "./column";
import Task from "./task";

export default interface Board {
	title: string;
	columns: Column[];
	tasks: Task[];
}
