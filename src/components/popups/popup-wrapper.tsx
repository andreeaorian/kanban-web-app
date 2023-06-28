import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../../redux/store";

import "./popup.scss";

type PopupProps = {
	isVisible: boolean;
	closePopup: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
	content: JSX.Element;
};

export default function PopupWrapper({
	isVisible,
	closePopup,
	content,
}: PopupProps) {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

	return isVisible ? (
		<div className="popup-box">
			<div className={`box  ${isDarkTheme ? "dark" : "light"}`}>
				<FontAwesomeIcon
					className="close"
					icon={faXmark}
					onClick={closePopup}
					size="lg"
				/>
				<div className="box-content">{content}</div>
			</div>
		</div>
	) : (
		<></>
	);
}
