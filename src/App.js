import SelectCustom from "./components/SelectCustom"
import states from './data'
import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState("")
  useEffect(() => {
  }, [state])
  return (
    <div>
      <SelectCustom id="state" label="State" disabled={["AZ"]} hidden={["CA"]} data={states} value="abbreviation" text="name" onChange={(value) => setState(value)} width="400px"/>
    </div>
  );
}

export default App;
