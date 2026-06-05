import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import HalamanPembuka from './HalamanPembuka';
import HalamanBeranda from './HalamanBeranda';
import FlipbookViewer from './FlipbookViewer';
import AdminUpload from './AdminUpload';

// --- DATABASE PLAYLIST (Dipindah ke luar agar memori lebih stabil) ---
const playlists = {
  foto: Array.from({ length: 10 }, (_, i) => ({
    title: `🎵 Harmoni Kenangan ${i + 1}`,
    src: `/foto${i + 1}.mp3`
  })),
  novel: Array.from({ length: 10 }, (_, i) => ({
    title: `📖 Melodi Cerita ${i + 1}`,
    src: `/novel${i + 1}.mp3`
  }))
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentSong, setCurrentSong] = useState('/music.mp3'); 
  
  const audioRef = useRef(null);
  const location = useLocation();

  const isBukuPage = location.pathname.startsWith('/buku/');
  const kategori = isBukuPage ? location.pathname.split('/')[2] : null;

  // ==============================================================
  // SUTRADARA AUDIO: Mengatur siapa yang bersuara di setiap halaman
  // ==============================================================
  useEffect(() => {
    setShowPlaylist(false); 

    // 1. JIKA DI HALAMAN PEMBUKA: Matikan musik utama! Biarkan mesin tik bersuara.
    if (location.pathname === '/') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return; // Berhenti di sini, jangan putar lagu apa pun
    }

    // 2. JIKA DI HALAMAN BUKU: Putar playlist buku tersebut
    if (isBukuPage && kategori && playlists[kategori]) {
      const isAlreadyPlayingCategory = playlists[kategori].some(song => song.src === currentSong);
      if (!isAlreadyPlayingCategory) {
        setCurrentSong(playlists[kategori][0].src);
        setIsPlaying(true);
        setTimeout(() => {
          if (audioRef.current) audioRef.current.play().catch(err => console.log(err));
        }, 50);
      }
    } 
    // 3. JIKA DI HALAMAN BERANDA: Putar musik utama
    else {
      if (currentSong !== '/music.mp3') {
        setCurrentSong('/music.mp3');
      }
      // Nyalakan musik jika sebelumnya mati
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play().catch(err => console.log(err));
      }, 50);
    }
  }, [location.pathname, isBukuPage, kategori, currentSong]); 

  // ==============================================================
  // LOGIKA AUTO-NEXT JIKA LAGU HABIS
  // ==============================================================
  const handleSongEnd = () => {
    if (isBukuPage && kategori && playlists[kategori]) {
      const currentPlaylist = playlists[kategori];
      const currentIndex = currentPlaylist.findIndex(song => song.src === currentSong);

      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        setCurrentSong(currentPlaylist[nextIndex].src);
        setIsPlaying(true);
        setTimeout(() => {
          if (audioRef.current) audioRef.current.play().catch(err => console.log(err));
        }, 50);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log(err));
      }
    }
  };

  // ==============================================================
  // KONTROL VOLUME AWAL (TANPA AUTOPLAY AGAR TIDAK TABRAKAN)
  // ==============================================================
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      // KITA HAPUS PERINTAH "play()" DI SINI AGAR DIAM SAAT AWAL DIMUAT
    }
  }, []);

  const toggleMusic = (e) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMainButtonClick = () => {
    if (isBukuPage) {
      setShowPlaylist(!showPlaylist); 
    } else {
      toggleMusic(); 
    }
  };

  const playSelectedSong = (src) => {
    setCurrentSong(src);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log(err));
      }
    }, 50);
  };

  // Fungsi yang dipanggil saat tombol "Lanjut" di halaman pembuka diklik
  const startMusicFromIntro = () => {
    setCurrentSong('/music.mp3');
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((err) => console.log("Gagal memutar musik:", err));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={currentSong} onEnded={handleSongEnd} />

      {/* --- MENU PLAYLIST MELAYANG --- */}
      {isBukuPage && showPlaylist && (
        <div className="fixed bottom-24 right-4 md:right-8 z-[100] w-64 max-h-80 bg-black/80 backdrop-blur-xl border border-white/20 rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 flex flex-col transition-all duration-300">
          
          <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-3">
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Playlist {kategori === 'foto' ? 'Album Foto' : 'Novel'}
            </span>
            <button 
              onClick={toggleMusic} 
              className="text-sm bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-white"
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {playlists[kategori]?.map((song, idx) => (
              <button
                key={idx}
                onClick={() => playSelectedSong(song.src)}
                className={`text-left px-3 py-2 rounded-lg text-[16px] transition-all duration-300 ${
                  currentSong === song.src 
                  ? 'bg-white/30 text-white font-bold shadow-inner' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- TOMBOL MUSIK GLOBAL --- */}
      <button
        onClick={handleMainButtonClick}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] bg-white/10 backdrop-blur-md border border-white/30 text-white px-3 py-2 md:px-5 md:py-3 rounded-[16px] shadow-lg transition-transform hover:-translate-y-1 hover:bg-white/20 flex items-center gap-2 md:gap-3 cursor-pointer"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="text-xl md:text-2xl">{isPlaying ? '🎵' : '🔇'}</span>
        <span className="text-base md:text-xl font-bold">
          {isBukuPage ? 'Pilih Lagu' : (isPlaying ? 'Playing' : 'Play Music')}
        </span>
        
        {isBukuPage && (
          <span className={`text-sm transition-transform duration-300 ${showPlaylist ? 'rotate-180' : ''}`}>
            ▲
          </span>
        )}
      </button>

      {/* PENGATURAN RUTE HALAMAN */}
      <Routes>
        <Route path="/" element={<HalamanPembuka onPlayMusic={startMusicFromIntro} />} />
        <Route path="/pilihan" element={<HalamanBeranda />} />
        <Route path="/buku/:kategori" element={<FlipbookViewer />} />
        <Route path="/admin-upload-rahasia" element={<AdminUpload />} />
      </Routes>
    </>
  );
}

export default App;