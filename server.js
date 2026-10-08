const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Inisialisasi SDK Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// =========================================================================
// DATABASE LOKAL SEMENTARA (1 GURU & 4 SISWA)
// Di sini tempat kamu menambah/mengubah NIS, Password, dan Data Pengguna!
// =========================================================================
const USERS_DATABASE = [
  {
    id: "G1001", // NIP/ID Guru
    password: "123", // Password Guru
    nama: "Ahmad Fauzi, S.Kom",
    role: "guru",
    nip: "19850112 201001 1 002",
    matpel: "Pemrograman Web & Mobile",
  },
  {
    id: "S2304030004", // NIS Siswa 1
    password: "2004-06-07", // Contoh password format tgl-bln-thn (bisa diganti "12345678")
    nama: "Muhamad Eko Maulana",
    role: "siswa",
    nisn: "005129381",
    kelas: "XII TEKNIK KOMPUTER DAN JARINGAN 1",
  },
  {
    id: "S2304030005", // NIS Siswa 2
    password: "12345678", // Contoh password nomor urut
    nama: "SAVIRA NASYA SYAWALLIA",
    role: "siswa",
    nisn: "0058291032",
    kelas: "XII ADMINISTRASI PERKANTORAN 2",
  },
  {
    id: "S2304030006", // NIS Siswa 3
    password: "12345678",
    nama: "JULIA",
    role: "siswa",
    nisn: "0057391029",
    kelas: "XI TATA BOGA 1",
  },
  {
    id: "S2304030007", // NIS Siswa 4
    password: "12345678",
    nama: "MELVI",
    role: "siswa",
    nisn: "0059128392",
    kelas: "X TATARIAS 1",
  },
];

// =========================================================================
// ENDPOINT LOGIN VERIFIKASI NIS & PASSWORD
// =========================================================================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // 1. Cari pengguna berdasarkan NIS / ID
  const user = USERS_DATABASE.find((u) => u.id === username.trim());

  if (!user) {
    // Jika NIS / Username tidak ditemukan
    return res
      .status(401)
      .json({ error: "NIS / ID salah, silahkan coba lagi!" });
  }

  // 2. Cek apakah password cocok
  if (user.password !== password.trim()) {
    // Jika Password salah
    return res.status(401).json({ error: "Password salah!" });
  }

  // 3. Jika NIS dan Password cocok, kirim data user ke frontend
  res.json({
    message: "Login berhasil!",
    user: {
      id: user.id,
      nama: user.nama,
      role: user.role,
      nisn: user.nisn || user.nip,
      kelas: user.kelas || user.matpel,
    },
  });
});

// Endpoint Chatbot AI
const SYSTEM_PROMPT = `
Kamu adalah "HikmahBot", Asisten Pembelajaran AI resmi di SMK Nurul Hikmah.
Tugasmu adalah membantu siswa memahami materi pelajaran, memberikan bimbingan tugas, 
dan memberikan penjelasan yang ramah, sopan, serta edukatif khas lingkungan SMK.
Jawablah pertanyaan dengan ringkas dan jelas.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Error AI:", error);
    res.status(500).json({ error: "Gagal terhubung ke AI Asisten" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server e-learning running di http://localhost:${PORT}`);
});
