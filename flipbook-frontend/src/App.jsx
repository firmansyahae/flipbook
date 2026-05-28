import { Routes, Route, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react'; // <-- Tambahan untuk musik
import FlipbookViewer from './FlipbookViewer';
import AdminUpload from './AdminUpload';

function HalamanBeranda() {
  const images = ['/1.webp', '/2.webp', '/3.webp', '/4.webp', '/5.webp'];
  const duplicatedImages = [...images, ...images];

  // --- LOGIKA MUSIK ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Mencoba memutar lagu otomatis saat web dibuka (Volume 50%)
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => {
        setIsPlaying(true); // Jika browser mengizinkan autoplay
      }).catch((error) => {
        console.log("Autoplay ditahan browser. User harus klik tombol play.");
      });
    }
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black">
      
      {/* --- ELEMEN AUDIO (Tersembunyi) --- */}
      {/* "loop" berfungsi agar lagu diputar ulang terus-menerus */}
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* --- TOMBOL MUSIK ESTETIK (Di Pojok Kanan Bawah) --- */}
      <button
        onClick={toggleMusic}
        className="absolute bottom-8 right-8 z-50 bg-white/10 backdrop-blur-md border border-white/30 text-white px-5 py-3 rounded-[16px] shadow-lg transition-transform hover:-translate-y-1 hover:bg-white/20 flex items-center gap-3 cursor-pointer"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="text-2xl">{isPlaying ? '🎵' : '🔇'}</span>
        <span className="text-xl font-bold">{isPlaying ? 'Playing' : 'Play Music'}</span>
      </button>

      {/* --- BACKGROUND ANIMASI BERJALAN --- */}
      <div className="absolute top-0 left-0 h-full w-max flex animate-scroll z-0">
        {duplicatedImages.map((src, index) => (
          <img 
            key={index} 
            src={src} 
            alt={`Memori ${index}`} 
            className="h-full w-screen object-cover" 
          />
        ))}
      </div>

      {/* --- OVERLAY GELAP --- */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mt-[30vh]">
        
        {/* 1. HEADING 1 */}
        <h1 className="text-white text-[64px] font-cormorant font-bold mb-0 drop-shadow-md leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Tempat terasa indah karena ada kamu.
        </h1>
        
        {/* 2. SUB HEADING */}
        <p className="text-white text-[32px] font-cormorant font-normal mt-[16px] drop-shadow-sm leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Momen sederhana yang ternyata jadi sangat berarti.
        </p>
        
        {/* 3. SHAPE OPSI */}
        <div className="flex flex-row justify-center items-center gap-10 mt-[32px]">
          
          <Link 
            to="/buku/foto" 
            className="bg-white text-black font-cormorant font-bold text-2xl flex items-center justify-center rounded-[16px] px-[32px] py-[24px] shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Album Foto
          </Link>

          <Link 
            to="/buku/novel" 
            className="bg-white text-black font-cormorant font-bold text-2xl flex items-center justify-center rounded-[16px] px-[32px] py-[24px] shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Novel
          </Link>
          
        </div>
      </div>

    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HalamanBeranda />} />
      <Route path="/buku/:kategori" element={<FlipbookViewer />} />
      <Route path="/admin-upload-rahasia" element={<AdminUpload />} />
    </Routes>
  );
}

export default App;