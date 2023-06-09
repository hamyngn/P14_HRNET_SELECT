import SelectCustom from "./components/SelectCustom"
import states from './data'
import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState("")
  useEffect(() => {
    console.log(state)
  }, [state])
  return (
    <div>
      <SelectCustom id="state" label="State" disabled={["CA", "AZ"]} hidden={["AL", "CT", "WY"]} data={states} value="abbreviation" text="name" onChange={(value) => setState(value)}/>
    </div>
  );
}

export default App;
