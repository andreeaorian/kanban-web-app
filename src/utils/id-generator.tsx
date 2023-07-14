function generateId(): string {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let randomString = "";

	for (let i = 0; i < 10; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		randomString += charset[randomIndex];
	}

	return randomString;
}

export { generateId };
