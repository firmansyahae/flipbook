import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import FlipbookViewer from './FlipbookViewer';
import AdminUpload from './AdminUpload'; // Kita akan buat file ini nanti

function HalamanBeranda() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Selamat Datang di Galeri Karya</h1>
      
      <div className="flex gap-8">
        {/* Pilihan 1: Album Foto */}
        <Link to="/buku/foto" className="w-64 h-40 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg transition transform hover:scale-105">
          Pilihan 1 (Album Foto)
        </Link>

        {/* Pilihan 2: Novel */}
        <Link to="/buku/novel" className="w-64 h-40 bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg transition transform hover:scale-105">
          Pilihan 2 (Novel)
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HalamanBeranda />} />
      <Route path="/buku/:kategori" element={<FlipbookViewer />} />
      
      {/* RUTE RAHASIA ADMIN - Hanya Anda yang tahu link-nya (/admin-upload-rahasia) */}
      <Route path="/admin-upload-rahasia" element={<AdminUpload />} />
    </Routes>
  );
}

export default App;