import { useState } from 'react';
import FlipbookViewer from './FlipbookViewer';

function App() {
  const [view, setView] = useState('viewer'); // 'viewer' atau 'admin'
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih file dulu!");
    
    const formData = new FormData();
    formData.append('fileBuku', file);

    setStatus('Sedang mengunggah dan memproses...');

    try {
      const response = await fetch('https://swifter-capillary-vacant.ngrok-free.dev/api/upload', {
        method: 'POST',
        body: formData,
    });
      const data = await response.json();
      setStatus(data.pesan);
    } catch (error) {
      setStatus('Gagal mengunggah file.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tombol Navigasi */}
      <nav className="p-4 bg-white shadow-md flex gap-4">
        <button 
          onClick={() => setView('viewer')}
          className={`px-4 py-2 rounded ${view === 'viewer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Lihat Flipbook
        </button>
        <button 
          onClick={() => setView('admin')}
          className={`px-4 py-2 rounded ${view === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Admin Upload
        </button>
      </nav>

      {/* Konten Halaman */}
      <main>
        {view === 'viewer' ? (
          <FlipbookViewer />
        ) : (
          <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Admin Upload Flipbook</h1>
            <form onSubmit={handleUpload} className="space-y-4">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="block w-full text-sm text-slate-500"
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Unggah & Proses
              </button>
            </form>
            {status && <p className="mt-4 font-semibold text-gray-700">{status}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;