import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

import { RootState } from "../../../redux/store";
import { changeTheme } from "../../../redux/appReducer";

import "./theme-changer.scss";

export default function ThemeChanger() {
	const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
	const dispatch = useDispatch();

	const changeThemeHandler = () => dispatch(changeTheme());

	return (
		<div className="theme-changer">
			<label htmlFor="themeToggle" className="theme-toggle">
				<FontAwesomeIcon icon={faSun} className="theme-day" size="lg" />
				<input
					className="theme-toggle-input"
					type="checkbox"
					id="themeToggle"
					checked={isDarkTheme}
					onChange={changeThemeHandler}
				/>
				<span className="theme-toggle-handler" />
				<FontAwesomeIcon icon={faMoon} className="theme-night" size="lg" />
			</label>
		</div>
	);
}
