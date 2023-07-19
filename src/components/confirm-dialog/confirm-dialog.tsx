import PopupWrapper from "../popups/popup-wrapper";

import "./confirm-dialog.scss";

interface ConfirmationDialogProps {
	open: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmationDialog = ({
	open,
	title,
	message,
	onConfirm,
	onCancel,
}: ConfirmationDialogProps) => {
	return (
		<PopupWrapper isVisible={open} closePopup={onCancel}>
			<div className="confirmation-dialog">
				<h2>{title}</h2>
				<p>{message}</p>
				<div className="confirmation-dialog-buttons">
					<button className="submit-button" onClick={onConfirm}>
						Yes
					</button>
					<button className="create-button" onClick={onCancel}>
						Cancel
					</button>
				</div>
			</div>
		</PopupWrapper>
	);
};

export default ConfirmationDialog;
