import { useRef } from "react";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import type { XYCoord } from "dnd-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircle,
	faPenToSquare,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { DraggableItemTypes } from "../../../utils/draggable-constants";

interface PopupListActionableValueProps {
	id: string;
	title: string;
	hasColor: boolean;
	deleteHandler: (title: string) => void;
	color?: string;
	index?: number;
	moveListValueHandler?: (dragIndex: number, hoverIndex: number) => void;
}

export default function PopupListActionableValue({
	id,
	title,
	hasColor,
	deleteHandler,
	index,
	moveListValueHandler,
	color,
}: PopupListActionableValueProps) {
	const ref = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop<{ index: number }, void>({
		accept: DraggableItemTypes.COLUMN,
		hover(item: { index: number }, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index as number;

			if (dragIndex === hoverIndex) {
				return;
			}

			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			const clientOffset = monitor.getClientOffset();

			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			if (moveListValueHandler) {
				moveListValueHandler(dragIndex, hoverIndex);
			}

			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: DraggableItemTypes.COLUMN,
		item: () => {
			return { index };
		},
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const handleDelete = () => {
		deleteHandler(id);
	};

	const opacity = isDragging ? 0 : 1;

	drag(drop(ref));

	return (
		<div ref={ref} style={{ opacity }} className="actionable-value">
			<div className="actionable-value-details">
				{hasColor && <FontAwesomeIcon icon={faCircle} color={color} />}
				<span>{title}</span>
			</div>
			<div className="actionable-value-icons">
				<FontAwesomeIcon icon={faPenToSquare} />
				<FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
			</div>
		</div>
	);
}
