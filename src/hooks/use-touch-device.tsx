import { useState, useEffect } from "react";

export function useTouchDevice() {
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		const checkTouchDevice = () => {
			setIsTouchDevice(
				"ontouchstart" in window || navigator.maxTouchPoints > 0
			);
		};

		checkTouchDevice();

		window.addEventListener("touchstart", checkTouchDevice);

		return () => {
			window.removeEventListener("touchstart", checkTouchDevice);
		};
	}, []);

	return isTouchDevice;
}
