import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import EncryptPage from './pages/EncryptPage.jsx'
import DecryptPage from './pages/DecryptPage.jsx'

function App() {
  return (
    <div className="min-h-full">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-base font-semibold text-gray-900">File Encryptor</Link>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'text-indigo-700' : 'text-gray-600 hover:text-gray-900'}>Encrypt</NavLink>
            <NavLink to="/decrypt" className={({ isActive }) => isActive ? 'text-indigo-700' : 'text-gray-600 hover:text-gray-900'}>Decrypt</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl py-8">
        <Routes>
          <Route path="/" element={<EncryptPage />} />
          <Route path="/decrypt" element={<DecryptPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

 
