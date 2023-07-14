import Column from "./column";
import Task from "./task";

export default interface Board {
	id: string;
	title: string;
	columns: Column[];
	tasks: Task[];
	isSelected: boolean;
}
