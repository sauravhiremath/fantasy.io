import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "quickdraw-component/quickdraw-component";
import DoodlePad from "./DoodlePad";
import Landing from "./Landing";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <DoodlePad />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
