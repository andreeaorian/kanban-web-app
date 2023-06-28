import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircle,
	faPenToSquare,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Column } from "../../../models";
import { deleteColumn } from "../../../redux/boardReducer";

export default function PopupStatusColumn({ title, color }: Column) {
	const dispatch = useDispatch();

	return (
		<div className="status-column">
			<div className="status-details">
				<FontAwesomeIcon icon={faCircle} color={color} />
				<span>{title}</span>
			</div>
			<div className="status-icons">
				<FontAwesomeIcon icon={faPenToSquare} />
				<FontAwesomeIcon
					icon={faTrash}
					onClick={() => dispatch(deleteColumn(title))}
				/>
			</div>
		</div>
	);
}
