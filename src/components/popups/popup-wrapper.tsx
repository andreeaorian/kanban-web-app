import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
	return isVisible ? (
		<div className="popup-box">
			<div className="box">
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
