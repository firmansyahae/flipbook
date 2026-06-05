import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpqnghxnkyapkkrweonp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcW5naHhua3lhcGtrcndlb25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjA1MDUsImV4cCI6MjA5NTA5NjUwNX0.balyE2w7fqd7dtL9xf_aAP1SCl4lqyobnfFhXfVO7NQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref} data-density={props.density}>
      <div 
        className="w-full h-full overflow-hidden relative kertas-buku"
        style={{ 
          boxShadow: props.dynamicShadow, 
          [props.borderSide]: '1px solid #d4d4d4'
        }}
      >
        {props.imageUrl ? (
          <img
            src={props.imageUrl}
            alt={`Halaman ${props.number}`}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#faf9f6]">
            <span className="text-gray-300 font-cormorant italic text-sm md:text-base">The End</span>
          </div>
        )}
        
        {props.showSpineShadow && (
          <div className={`absolute top-0 w-12 md:w-16 h-full pointer-events-none opacity-[0.15] ${props.spineClass}`}></div>
        )}
      </div>
    </div>
  );
});

function FlipbookViewer() {
  const { kategori } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [judulBuku, setJudulBuku] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('data FlipBook')
        .select('*')
        .eq('kategori', kategori)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.halaman) {
        let masterPages = [...data.halaman];
        if (masterPages.length % 2 !== 0) {
          masterPages.push(""); 
        }
        setPages(masterPages);
        setJudulBuku(data.judul);
      } else {
        console.error("Error/Data kosong:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [kategori]);

  const goNext = () => {
    if (bookRef.current) bookRef.current.pageFlip().flipNext();
  };
  
  const goPrev = () => {
    if (bookRef.current) bookRef.current.pageFlip().flipPrev();
  };

  const jumpToPage = (e) => {
    const targetPage = parseInt(e.target.value);
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(targetPage);
    }
  };

  const onPageFlip = (e) => {
    setCurrentPage(e.data);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#2b221a]">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-white mt-4 font-cormorant text-lg md:text-xl text-center px-4">Memuat lembaran kenangan...</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#2b221a] text-white">
        <p className="text-xl md:text-2xl font-cormorant mb-4 text-center px-4">Belum ada cerita di sini.</p>
        <Link to="/pilihan" className="px-4 py-2 md:px-6 md:py-2 border border-white rounded hover:bg-white hover:text-black transition-colors text-sm md:text-base">
          Kembali
        </Link>
      </div>
    );
  }

  const totalPages = pages.length;
  const bgTheme = kategori === 'novel'
    ? 'from-[#3e2723] via-[#2d1a11] to-[#1a0f0a]' 
    : 'from-[#d4bc96] via-[#c2a476] to-[#8b6b4a]';

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br ${bgTheme} overflow-hidden`}>
      
      {/* TOOLBAR ATAS - Dirapikan untuk Mobile */}
      <div className="absolute top-0 left-0 w-full h-12 md:h-14 bg-black/50 backdrop-blur-md z-50 flex items-center justify-between px-3 md:px-6 shadow-md">
        <div className="flex items-center">
          <Link to="/pilihan" className="text-white/80 hover:text-white transition-colors flex items-center gap-1 md:gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline font-medium text-sm md:text-base">Kembali</span>
          </Link>
        </div>
        {/* Teks truncate agar tidak berantakan jika judul sangat panjang di HP */}
        <h2 className="text-white/90 font-cormorant text-base md:text-2xl tracking-wide font-bold truncate max-w-[150px] md:max-w-none text-center">
          {judulBuku}
        </h2>
        <div className="w-6 md:w-20"></div>
      </div>

      {/* AREA BUKU - Full responsif */}
      <div className="relative flex items-center justify-between w-full max-w-5xl px-0 md:px-4 mt-14 mb-20 md:mb-16 flex-1">
        
        {/* Tombol Kiri (Disembunyikan di HP karena user bisa SWIPE layar HP) */}
        <button onClick={goPrev} className="z-40 p-2 md:p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all transform hover:scale-110 shadow-lg hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>

        <div className="flex-1 flex justify-center items-center drop-shadow-2xl">
          <HTMLFlipBook
            width={350} 
            height={500} 
            size="stretch"
            minWidth={200}
            maxWidth={450} 
            minHeight={300}
            maxHeight={650}
            maxShadowOpacity={0.5}
            showCover={true} 
            mobileScrollSupport={true}
            usePortrait={true} // FITUR AJAIB: Otomatis 1 halaman di layar HP!
            ref={bookRef}
            onFlip={onPageFlip} 
            className="book-wrapper"
          >
            {pages.map((url, index) => {
              const isCover = index === 0;
              const isBackCover = index === totalPages - 1;
              const isRightPage = index % 2 === 0;
              
              const density = isCover || isBackCover ? "hard" : "soft";
              const showSpineShadow = !isCover && !isBackCover;
              const spineClass = isRightPage 
                ? 'left-0 bg-gradient-to-r from-black to-transparent' 
                : 'right-0 bg-gradient-to-l from-black to-transparent';

              let pagesUnderneath = isRightPage ? (totalPages - index - 1) : index;
              let ratio = totalPages > 1 ? pagesUnderneath / (totalPages - 1) : 1;
              let layers = Math.max(1, Math.ceil(ratio * 7)); 

              const shadowColors = ['#e5e5e5', '#d4d4d4', '#c2c2c2', '#a3a3a3', '#858585', '#666666', '#525252'];
              let shadowArr = [];

              shadowArr.push(`inset ${isRightPage ? '5px' : '-5px'} 0 10px rgba(0,0,0,0.15)`);

              for (let i = 0; i < layers; i++) {
                let offset = isRightPage ? i + 1 : -(i + 1);
                shadowArr.push(`${offset}px 0 0 ${shadowColors[i]}`);
              }

              let dropOffset = isRightPage ? layers + 1 : -(layers + 1);
              shadowArr.push(`${dropOffset}px 0 10px rgba(0,0,0,0.3)`);

              const dynamicShadow = shadowArr.join(', ');
              const borderSide = isRightPage ? 'borderLeft' : 'borderRight';

              return (
                <Page 
                  key={index} 
                  density={density}
                  imageUrl={url} 
                  number={index + 1}
                  showSpineShadow={showSpineShadow}
                  spineClass={spineClass}
                  dynamicShadow={dynamicShadow} 
                  borderSide={borderSide}
                />
              );
            })}
          </HTMLFlipBook>
        </div>

        {/* Tombol Kanan (Disembunyikan di HP) */}
        <button onClick={goNext} className="z-40 p-2 md:p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all transform hover:scale-110 shadow-lg hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>

      </div>

      {/* TOOLBAR BAWAH - Slider di-scale untuk HP */}
      <div className="absolute bottom-0 left-0 w-full h-14 md:h-16 bg-black/80 backdrop-blur-md z-50 flex items-center justify-between px-3 md:px-6 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        
        {/* Tombol prev kecil di HP */}
        <button onClick={goPrev} className="text-white/70 hover:text-white transition-colors block md:hidden" title="Sebelumnya">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>

        <div className="flex-1 max-w-xl mx-2 md:mx-8 flex items-center gap-2 md:gap-4 group">
          <span className="text-white/90 font-mono text-[10px] md:text-sm font-bold w-8 md:w-12 text-right">
            {currentPage === 0 ? "Cover" : currentPage === totalPages - 1 ? "End" : `Hal ${currentPage}`}
          </span>
          <div className="relative flex-1 flex items-center">
            <input 
              type="range" 
              min={0} 
              max={totalPages > 0 ? totalPages - 1 : 0} 
              value={currentPage} 
              onChange={jumpToPage}
              className="w-full h-1 md:h-2 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 transition-colors"
              style={{ accentColor: '#ffffff' }}
            />
          </div>
          <span className="text-white/60 font-mono text-[10px] md:text-xs w-6 md:w-8">
            / {totalPages}
          </span>
        </div>

        {/* Tombol next kecil di HP */}
        <button onClick={goNext} className="text-white/70 hover:text-white transition-colors block md:hidden" title="Berikutnya">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>

    </div>
  );
}

export default FlipbookViewer;