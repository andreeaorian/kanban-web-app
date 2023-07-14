import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "../../../utils/utils";

type ActionableInputProps = {
	inputName: string;
	inputPlaceholder: string;
	similarNames: string[];
	hasColor: boolean;
	save: (name: string, color?: string) => void;
	revertChanges: () => void;
};
export default function ActionableInput({
	inputName,
	inputPlaceholder,
	hasColor,
	similarNames,
	save,
	revertChanges,
}: ActionableInputProps) {
	const [name, setName] = useState("");
	const [color, setColor] = useState("#000");
	const [error, setError] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		if (isSubmitted && isEmpty(error)) {
			save(name, color);
		}
	}, [isSubmitted, error, name, color, save]);

	const changeColor = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setColor(e.target.value);
		setIsSubmitted(false);
	};

	const changeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setName(e.target.value);
		setIsSubmitted(false);
	};

	const saveValues = (): void => {
		validate();
		setIsSubmitted(true);
	};

	const validate = (): void => {
		if (isEmpty(name)) {
			setError("Name is required");
			return;
		}

		if (similarNames.includes(name)) {
			setError("Name should be unique");
			return;
		}

		setError("");
	};

	return (
		<div className="inputs-with-errors">
			{!!error && <span className="error">{error}</span>}
			<div className="new-inputs">
				<div className={`inputs ${!!error ? "error" : ""}`}>
					<input
						name={inputName}
						type="text"
						placeholder={inputPlaceholder}
						onChange={changeName}
					/>
					{hasColor && (
						<input type="color" value={color} onChange={changeColor} />
					)}
				</div>
				<FontAwesomeIcon icon={faCheck} size="lg" onClick={saveValues} />
				<FontAwesomeIcon icon={faXmark} size="lg" onClick={revertChanges} />
			</div>
		</div>
	);
}
