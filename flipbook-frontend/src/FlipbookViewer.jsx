import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan ANON_KEY proyek Supabase Anda
const supabase = createClient('https://cpqnghxnkyapkkrweonp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcW5naHhua3lhcGtrcndlb25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjA1MDUsImV4cCI6MjA5NTA5NjUwNX0.balyE2w7fqd7dtL9xf_aAP1SCl4lqyobnfFhXfVO7NQ');

function FlipbookViewer() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Gunakan 'id' karena kolom ini pasti ada di tabel Anda
      const { data, error } = await supabase
        .from('data FlipBook')
        .select('*')
        .order('id', { ascending: false }) // Diubah dari 'created_at' ke 'id'
        .limit(1)
        .maybeSingle(); 

      if (error) {
        console.error("Error dari Supabase:", error);
      } else if (data) {
        console.log("Data berhasil ditemukan:", data);
        setPages(data.halaman); 
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Memuat buku...</div>;
  if (pages.length === 0) return <div>Tidak ada buku yang ditemukan.</div>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <HTMLFlipBook width={400} height={550} showCover={true}>
        {pages.map((url, index) => (
          <div key={index} className="page shadow-lg">
            <img src={url} alt={`Halaman ${index + 1}`} className="w-full h-full object-contain" />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}

export default FlipbookViewer;