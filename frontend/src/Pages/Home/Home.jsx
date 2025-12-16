import React, { useEffect } from 'react'
import { ContentPage } from '../../Components/ContentPage.jsx'
import { Header } from '../../Components/Header.jsx'
import { Sidebar } from '../../Components/Sidebar.jsx'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'

function Home() {
    return (
        <>
            <div className='max-h-screen flex flex-col'>
                <Header />
                <Sidebar />
                <main className="pt-10 md:pl-10">
                <ContentPage />
                </main>

            </div>
            <ToastContainer />
        </>
    )
}

export default Home