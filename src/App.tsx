import "./App.scss";
import { Sidebar, Header, Board } from "./components";

function App() {
	return (
		<div className="App">
			<Header />
			<Sidebar />
			<Board />
		</div>
	);
}

export default App;
