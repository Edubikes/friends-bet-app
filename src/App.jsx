import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Feed } from './views/Feed'
import { Ranking } from './views/Ranking'
import { CreateBet } from './views/CreateBet'
import { Login } from './views/Login'
import { useBets } from './lib/BetContext'

function App() {
  const { state } = useBets();
  const [activeTab, setActiveTab] = useState('feed')

  if (!state.currentUser) {
    return <Login />;
  }

  return (
    <>
      <main className="main-content">
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'rankings' && <Ranking />}
        {activeTab === 'create' && <CreateBet onComplete={() => setActiveTab('feed')} />}
      </main>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
