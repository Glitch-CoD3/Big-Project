import { Sidebar } from './Components/Sidebar.jsx'
import './App.css'
import { Header } from './Components/Header.jsx'
import { ContentPage } from './Pages/Home/ContentPage.jsx'

function App() {

  return (
    <>
     <div className='max-h-screen flex flex-col'>
      <Header />
      <Sidebar />
      

      <main className="pt-10 md:pl-10">
        <ContentPage />
      </main>
     </div>
    </>
  )
}

export default App
