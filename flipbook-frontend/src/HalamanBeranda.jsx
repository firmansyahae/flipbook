import { Link } from 'react-router-dom';

function HalamanBeranda() {
  const images = ['/1.webp', '/2.webp', '/3.webp', '/4.webp', '/5.webp'];
  const duplicatedImages = [...images, ...images];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black">
      
      {/* BACKGROUND ANIMASI BERJALAN */}
      <div className="absolute top-0 left-0 h-full w-max flex animate-scroll z-0">
        {duplicatedImages.map((src, index) => (
          <img 
            key={index} 
            src={src} 
            alt={`Memori ${index}`} 
            className="h-full w-auto max-w-none flex-shrink-0" 
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* KONTEN UTAMA: Diletakkan di Optical Center (agak ke atas dengan mt-[-10vh]) */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mt-[-5vh] md:mt-[-10vh]">
        
        {/* JUDUL UTAMA: Tebal, ukuran besar, jarak baris rapat */}
        <h1 
          className="text-white text-4xl md:text-[64px] font-bold mb-0 drop-shadow-xl leading-[1.1]" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Beberapa tempat terasa indah karena ada kamu.
        </h1>
        
        {/* SUBJUDUL: Lebih kecil (28px), miring (italic), warna abu-abu terang, jarak terpisah jelas (mt-32px) */}
        <p 
          className="text-gray-200 text-xl md:text-[28px] font-normal italic mt-[24px] md:mt-[32px] drop-shadow-md leading-relaxed" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Momen sederhana yang ternyata jadi sangat berarti.
        </p>
        
        {/* CONTAINER TOMBOL: Jarak yang cukup jauh dari teks (mt-64px) agar "bernapas" */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mt-[48px] md:mt-[64px] w-full md:w-auto">
          
          {/* TOMBOL 1: Garis tipis, transparan, teks UPPERCASE & renggang (tracking-widest) */}
          <Link 
            to="/buku/foto" 
            className="text-white border border-white/60 bg-white/5 backdrop-blur-sm uppercase tracking-widest font-medium text-lg md:text-xl flex items-center justify-center rounded-[8px] px-[32px] py-[16px] md:px-[40px] md:py-[20px] w-full md:w-auto shadow-lg transition-all duration-500 hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Album Foto
          </Link>

          {/* TOMBOL 2: Desain identik dengan Tombol 1 */}
          <Link 
            to="/buku/novel" 
            className="text-white border border-white/60 bg-white/5 backdrop-blur-sm uppercase tracking-widest font-medium text-lg md:text-xl flex items-center justify-center rounded-[8px] px-[32px] py-[16px] md:px-[40px] md:py-[20px] w-full md:w-auto shadow-lg transition-all duration-500 hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Novel
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default HalamanBeranda;