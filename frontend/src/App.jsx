import { Sidebar } from './Pages/Home/Sidebar/Sidebar.jsx'
import './App.css'
import { Header } from './Pages/Home/Header/Header'
import { PageContent } from './Pages/Videoplay/ContentPage.jsx'

function App() {

  return (
    <>
     <div className='max-h-screen flex flex-col'>
      <Header />
      <Sidebar />
      

      <main className="pt-10 md:pl-10">
        <PageContent />
      </main>
     </div>
    </>
  )
}

export default App
