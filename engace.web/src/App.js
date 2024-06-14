import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          EngAce: Personalize the way you learn and practice English with AI
        </p>
        <a
          className="App-link"
          href="https://engace.azurewebsites.net/swagger/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          API Documentations of EngAce project
        </a>
      </header>
    </div>
  );
}

export default App;