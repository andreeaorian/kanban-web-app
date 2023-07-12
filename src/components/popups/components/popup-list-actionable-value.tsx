import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircle,
	faPenToSquare,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function PopupListActionableValue({
	title,
	hasColor,
	deleteHandler,
	color,
}: {
	title: string;
	hasColor: boolean;
	deleteHandler: (title: string) => void;
	color?: string;
}) {
	const handleDelete = () => {
		deleteHandler(title);
	};

	return (
		<div className="actionable-value">
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
