import { useOutsideClick } from "../../hooks/use-outside-click";

import "./drop-down-menu.scss";

type DropDownMenuProps = {
	isVisible: boolean;
	clickOutsideHandler: () => void;
	buttons: {
		text: string;
		onClickHandler: () => void;
	}[];
};

export default function DropDownMenu({
	isVisible,
	clickOutsideHandler,
	buttons,
}: DropDownMenuProps) {
	const ref = useOutsideClick(clickOutsideHandler);

	return (
		<>
			{isVisible && (
				<nav ref={ref} className="dropdown-menu">
					<ul>
						{buttons.map(({ text, onClickHandler }) => (
							<li key={text} onClick={onClickHandler}>
								{text}
							</li>
						))}
					</ul>
				</nav>
			)}
		</>
	);
}
