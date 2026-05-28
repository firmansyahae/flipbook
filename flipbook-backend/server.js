const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fromPath } = require('pdf2pic');

// 1. Panggil library Supabase
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 2. Konfigurasi Supabase
const supabaseUrl = 'https://cpqnghxnkyapkkrweonp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcW5naHhua3lhcGtrcndlb25wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTUyMDUwNSwiZXhwIjoyMDk1MDk2NTA1fQ.dcVkMdaaovGDjOtRfSlYt310ox64LvZZ1mtV-g9EeIM';
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Buat folder 'uploads' secara otomatis jika belum ada
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const imageDir = './images';
if (!fs.existsSync(imageDir)){
    fs.mkdirSync(imageDir);
}

// 4. Konfigurasi penyimpanan Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Tempat file singgah
  },
  filename: function (req, file, cb) {
    // Ubah nama file menjadi angka timestamp agar unik
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 5. Endpoint uji coba awal (GET)
app.get('/', (req, res) => {
  res.send('Halo! Backend Flipbook saya sudah menyala dan siap terhubung ke Supabase!');
});

// 6. Endpoint POST untuk menerima PDF dari Admin
app.post('/api/upload', upload.single('fileBuku'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Tidak ada file PDF yang diunggah.');
    }

    console.log('Hore! File berhasil diterima server:', req.file.filename);

    const pdfPath = req.file.path; 
    const namaBukuSingkat = req.file.filename.split('.')[0]; 

    // Konfigurasi pdf2pic
    const options = {
      density: 150,           
      saveFilename: namaBukuSingkat, // Menggunakan angka unik agar tidak tertukar
      savePath: "./images",   
      format: "webp",         
      width: 800,             
      height: 1131            
    };

    const convert = fromPath(pdfPath, options);

    console.log('Mulai mengonversi PDF ke gambar... mohon tunggu.');
    const hasilKonversi = await convert.bulk(-1, { responseType: "image" }); 
    console.log('Konversi selesai! Total halaman:', hasilKonversi.length);

    console.log('Mulai mengunggah gambar ke Supabase Storage...');
    let daftarUrlGambar = [];

    // Loop untuk mengunggah setiap gambar hasil konversi satu per satu
    for (let i = 0; i < hasilKonversi.length; i++) {
        const fileGambar = hasilKonversi[i];
        const imagePath = fileGambar.path;
        
        // Kita buatkan folder khusus per buku di dalam Supabase Storage
        const namaFileStorage = `buku-${namaBukuSingkat}/halaman-${fileGambar.page}.webp`;

        // Membaca file gambar fisik dari laptop Anda
        const fileBuffer = fs.readFileSync(imagePath);

        // --- PENTING: GANTI 'nama_bucket_kalian' DENGAN NAMA BUCKET SUPABASE ANDA ---
        const namaBucket = 'data FlipBook'; 

        const { data, error } = await supabase
            .storage
            .from(namaBucket) 
            .upload(namaFileStorage, fileBuffer, {
                contentType: 'image/webp',
                upsert: true
            });

        if (error) {
            console.error(`Gagal upload halaman ${fileGambar.page}:`, error);
            throw error;
        }

        // Mendapatkan URL Publik gambar agar bisa diakses di internet
        const { data: publicUrlData } = supabase
            .storage
            .from(namaBucket)
            .getPublicUrl(namaFileStorage);

        daftarUrlGambar.push(publicUrlData.publicUrl);
        console.log(`Halaman ${fileGambar.page} berhasil diunggah ke Cloud!`);
    }

    console.log('Semua gambar berhasil diunggah ke Storage!');
    console.log('Menyimpan data buku ke Database...');

    const kategoriBuku = req.body.kategori || 'umum'; // Menangkap kategori dari frontend

    // Simpan judul dan urutan gambar ke tabel 'buku' di Database Supabase
    const { data: dbData, error: dbError } = await supabase
        .from('data FlipBook')
        .insert([
            {
                judul: `Jurnal Dummy ${namaBukuSingkat}`,
                penulis: 'Admin Dummy',
                kategori: kategoriBuku, // <-- INI YANG BARU
                halaman: daftarUrlGambar
            }
        ]);

    if (dbError) {
        console.error('Gagal menyimpan ke database:', dbError);
        throw dbError;
    }

    console.log('Data buku berhasil disimpan di Database!');

    res.send({ 
        pesan: 'Sempurna! PDF diproses, diunggah ke Storage, dan disimpan di Database.', 
        totalHalaman: hasilKonversi.length,
    });

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).send('Gagal memproses file.');
  }
});

// 7. Menyalakan server (SELALU LETAKKAN DI PALING BAWAH)
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});