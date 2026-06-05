import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function HalamanPembuka({ onPlayMusic }) {
  const [text, setText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  
  const typingAudioRef = useRef(null);

  // PERBAIKAN 1: Semua \n\n (enter ganda) diubah menjadi \n (enter tunggal)
  const fullText = 
    "Hai, Ayii...\n\n" +
    "Sebelum kita membuka halaman-halaman ini,\n" +
    "ada satu hal yang ingin aku sampaikan.\n" +
    "Terima kasih telah hadir dalam hidupku.\n" +
    "Terima kasih untuk setiap tawa yang kita bagi,\n" +
    "setiap cerita yang kita ukir,\n" +
    "dan setiap kenangan yang tersimpan hingga hari ini.\n" +
    "Di sini, tersimpan potongan-potongan perjalanan kita.\n" +
    "Bukan kisah yang sempurna,\n" +
    "tetapi kisah yang selalu ingin aku kenang bersama kamu.";

  useEffect(() => {
    if (typingAudioRef.current) {
      typingAudioRef.current.volume = 0.4; 
      typingAudioRef.current.play().catch(err => {
        console.log("Suara ketikan ditahan browser:", err);
      });
    }

    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      
      if (i > fullText.length) {
        clearInterval(typing);
        if (typingAudioRef.current) {
          typingAudioRef.current.pause();
        }
        setTimeout(() => setShowButton(true), 500); 
      }
    }, 60);

    return () => {
      clearInterval(typing);
      if (typingAudioRef.current) {
        typingAudioRef.current.pause();
      }
    };
  }, [fullText]);

  const handleLanjut = () => {
    if (onPlayMusic) {
      onPlayMusic(); 
    }
    navigate('/pilihan'); 
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-[#1c1311] to-black px-6 md:px-12 overflow-hidden">
      
      <audio ref={typingAudioRef} src="/typing.mp3" loop />

      {/* Jarak antara blok teks dan tombol sedikit dirapatkan juga (gap-6) */}
      <div className="max-w-3xl w-full flex flex-col gap-5 md:gap-6 px-2 md:px-0">
        
        {/* PERBAIKAN 2: leading diturunkan menjadi 1.4 agar tiap baris lebih rapat */}
        <p 
          className="text-gray-200 text-lg md:text-[24px] leading-[1.4] md:leading-[1.4] whitespace-pre-line drop-shadow-lg text-left"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {text}
          {!showButton && <span className="animate-pulse">|</span>}
        </p>

        <div className={`transition-opacity duration-1000 ${showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleLanjut}
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-5 py-3 md:px-7 md:py-3.5 rounded-[12px] md:rounded-[16px] text-base md:text-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-white hover:text-black hover:scale-102 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] cursor-pointer text-left"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Jadi, mari kita mulai lagi dari selesai... ❤️
          </button>
        </div>

      </div>

    </div>
  );
}

export default HalamanPembuka;