import SelectCustom from "./components/SelectCustom"
import './App.css';
import states from './data'

function App() {
  return (
    <div className="App">
      <SelectCustom id="state" label="State" data={states} value="abbreviation" text="name"/>
    </div>
  );
}

export default App;
