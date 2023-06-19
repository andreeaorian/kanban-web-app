import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

import "./header.scss";

export default function Header() {
	const boardName = useSelector((state: RootState) => state.board.title);

	return <div className="header">{`This is board ${boardName}`}</div>;
}
