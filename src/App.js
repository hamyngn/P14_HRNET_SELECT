import SelectCustom from "./components/SelectCustom"
import './App.css';
import states from './data'
import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState("")
  useEffect(() => {
    console.log(state)
  }, [state])
  return (
    <div className="App">
      <SelectCustom id="state" label="State" data={states} value="abbreviation" text="name" onChange={(value) => setState(value)}/>
    </div>
  );
}

export default App;
