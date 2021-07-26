import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ContextProvider from './Context.js';
import TitleScreen from './Components/TitleScreen.js';
import PlayScreen from './Components/PlayScreen.js';
import ResultsScreen from './Components/ResultsScreen.js';

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={TitleScreen}/>

            <Route exact path='/PlayScreen' component={PlayScreen}/>

            <Route exact path='/ResultsScreen' component={ResultsScreen}/>
          </Switch>
        </BrowserRouter>
      </ContextProvider>
    </div>
  );
}

export default App;