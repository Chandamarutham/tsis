import TopBar from '@components/TopBar';
import MainMenu from '@components/MainMenu';
import ActivePage from '@components/ActivePage';

import '@styles/App.css'

function App() {

  return (
    <>
    <header>
      <TopBar />
      <MainMenu />
    </header>
    <main>
      <ActivePage />
    </main>
    <footer>

    </footer>
    </>
  )
}

export default App
