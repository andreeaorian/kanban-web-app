import React, { useState } from "react";
import { ConfirmationDialog } from "../components";

const useConfirm = (
	title: string,
	message: string
): [React.FC, () => Promise<boolean>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = (): Promise<boolean> =>
		new Promise((resolve, _) => {
			setPromise({ resolve });
		});

	const handleClose = (): void => {
		setPromise(null);
	};

	const handleConfirm = (): void => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = (): void => {
		promise?.resolve(false);
		handleClose();
	};

	const CustomConfirmationDialog: React.FC = () => (
		<ConfirmationDialog
			open={promise !== null}
			title={title}
			message={message}
			onConfirm={handleConfirm}
			onCancel={handleCancel}
		/>
	);

	return [CustomConfirmationDialog, confirm];
};

export default useConfirm;
