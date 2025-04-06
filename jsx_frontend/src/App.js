import './App.css';
import logo from './images/logo.png'
import {SearchBar} from "./components/SearchBar";
import {Slider} from "./components/Slider";

function App() {
  return (
    <div className="App">
      <div className = "main-header">
        <h1>Mainstream Predictor</h1>
        <img src={logo} className="music_logo"/>
      </div>

      

      <header className="body-header">
        <div className = "search-container">
          <SearchBar/>
        </div>

        <div className = "slider-container">
          <Slider/> 
        </div>
      </header>
    </div>
  );



}

export default App;
