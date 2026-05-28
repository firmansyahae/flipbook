import React, { useState } from 'react';

function AdminUpload() {
  const [file, setFile] = useState(null);
  const [kategori, setKategori] = useState('foto'); // Default kategori
  const [ngrokUrl, setNgrokUrl] = useState(''); // STATE BARU UNTUK URL NGROK
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!ngrokUrl) return alert("Tolong masukkan link Ngrok yang sedang aktif!");
    if (!file) return alert("Pilih file PDF dulu!");
    
    // Hilangkan tanda garis miring (/) di akhir URL jika user tidak sengaja mengetiknya
    const cleanUrl = ngrokUrl.replace(/\/$/, "");
    
    const formData = new FormData();
    formData.append('fileBuku', file);
    formData.append('kategori', kategori);

    setStatus('Sedang mengunggah dan memproses...');

    try {
      // URL sekarang diambil dari inputan form, bukan diketik mati (hardcoded)
      const response = await fetch(`${cleanUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setStatus(data.pesan);
    } catch (error) {
      setStatus('Gagal mengunggah file. Pastikan Ngrok & backend menyala, dan link sudah benar.');
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Area (Rahasia)</h1>
          <form onSubmit={handleUpload} className="space-y-4">
            
            {/* INPUT BARU UNTUK NGROK URL */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Ngrok Saat Ini:</label>
                <input 
                  type="text" 
                  placeholder="https://xxxx.ngrok-free.app"
                  value={ngrokUrl}
                  onChange={(e) => setNgrokUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Copy dari terminal Ngrok dan paste ke sini</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kategori Buku:</label>
                <select 
                    value={kategori} 
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                >
                    <option value="foto">Album Foto</option>
                    <option value="novel">Novel</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih File PDF:</label>
                <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])} 
                className="block w-full text-sm text-slate-500 border border-gray-300 rounded p-1"
                />
            </div>

            <button 
              type="submit" 
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-bold"
            >
              Unggah ke Server
            </button>
          </form>
          {status && <p className="mt-4 text-center font-semibold text-gray-700">{status}</p>}
      </div>
    </div>
  );
}

export default AdminUpload;