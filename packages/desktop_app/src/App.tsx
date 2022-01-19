import { dialog, fs } from "@tauri-apps/api"
import './App.css'
import logo from './logo.svg'
import tauriCircles from './tauri.svg'
import tauriWord from './wordmark.svg'

function App() {
  async function select_file() {
    const file = await dialog.open();
    const content = await fs.readTextFile(file as string)
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="inline-logo">
          <img src={tauriCircles} className="App-logo rotate" alt="logo" />
          <img src={tauriWord} className="App-logo smaller" alt="logo" />
        </div>
        <a
          className="App-link"
          href="https://tauri.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Tauri
        </a>
        <img src={logo} className="App-logo rotate" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p onClick={select_file}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
