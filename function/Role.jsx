import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import '/CSS/Hias.css';

const MOCK_QUESTIONS = [
  { id: 1, text: "Apa kepanjangan dari elemen HTML?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
  { id: 2, text: "Properti CSS mana yang digunakan untuk mengubah warna teks?", options: ["background-color", "color", "font-color", "text-style"], correct: 1 },
  { id: 3, text: "Dalam React, hook bawaan yang digunakan untuk mengelola state lokal adalah...", options: ["useEffect", "useContext", "useState", "useReducer"], correct: 2 },
  { id: 4, text: "Class Tailwind CSS apa yang digunakan untuk mengaktifkan layout Flexbox?", options: ["display-flex", "flex", "d-flex", "layout-flex"], correct: 1 },
  { id: 5, text: "Apa fungsi utama dari hook useEffect pada komponen React?", options: ["Mengelola state global", "Menangani side-effects seperti data fetching", "Membuat komponen baru", "Mengoptimalkan CSS"], correct: 1 },
  { id: 6, text: "Sintaks JavaScript modern (ES6) yang benar untuk mendeklarasikan variabel konstan adalah...", options: ["var x = 10;", "let x = 10;", "const x = 10;", "constant x = 10;"], correct: 2 },
  { id: 7, text: "Di Tailwind CSS, class 'p-4' setara dengan ukuran padding sebesar...", options: ["4px", "1rem (16px)", "4rem", "24px"], correct: 1 },
  { id: 8, text: "Metode Array JavaScript mana yang mengembalikan array baru hasil transformasi fungsi?", options: ["forEach()", "filter()", "map()", "reduce()"], correct: 2 },
  { id: 9, text: "Atribut JSX dalam React yang digunakan untuk menghubungkan elemen <label> dengan <input> adalah...", options: ["htmlFor", "for", "id", "target"], correct: 0 },
  { id: 10, text: "Konsep React untuk mengirimkan data dari parent component ke child component dinamakan...", options: ["State", "Props", "Context", "Redux"], correct: 1 },
  { id: 11, text: "Class Tailwind CSS untuk membuat sudut elemen menjadi melengkung (border-radius) adalah...", options: ["border-radius", "rounded", "curve", "circle"], correct: 1 },
  { id: 12, text: "Operator perbandingan JavaScript yang mengecek tipe data dan nilai secara ketat adalah...", options: ["==", "=", "===", "!="], correct: 2 },
  { id: 13, text: "Dalam React, prop 'key' wajib diberikan pada perulangan list berfungsi untuk...", options: ["Styling CSS", "Meningkatkan efisiensi rekonsiliasi DOM", "Navigasi URL", "Validasi Form"], correct: 1 },
  { id: 14, text: "Breakpoint 'md:' pada Tailwind CSS aktif pada ukuran lebar layar minimal...", options: ["576px", "640px", "768px", "1024px"], correct: 2 },
  { id: 15, text: "Apa keunggulan utama penggunaan localStorage pada browser web?", options: ["Menyimpan data sementara per tab", "Menyimpan data persisten tanpa waktu kedaluwarsa", "Mengirimkan data otomatis ke server", "Mengamankan password pengguna"], correct: 1 }
];

const PROGRAM_RECOMMENDATIONS = {
  Beginner: {
    levelBadge: "Level: Beginner (0 - 40%)",
    title: "Front-End Foundation (HTML, CSS & JS Fundamental)",
    description: "Sangat disarankan untuk memperkuat pemahaman dasar pemograman web, struktur semantik HTML, sintaks dasar CSS, dan logika JavaScript ES6.",
    accentColor: "bg-amber-500",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
  },
  Intermediate: {
    levelBadge: "Level: Intermediate (41 - 75%)",
    title: "Modern Web Dev with React & Tailwind CSS",
    description: "Direkomendasikan untuk memperdalam konsep React (Hooks, State Management) serta penguasaan utility-first CSS framework untuk membangun SPA modern.",
    accentColor: "bg-blue-600",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  Advanced: {
    levelBadge: "Level: Advanced (76 - 100%)",
    title: "Full-Stack Front-End Architecture & Performance",
    description: "Direkomendasikan untuk menguasai tingkat mahir: Optimasi performa render React, arsitektur micro-frontend, testing, dan integrasi API skala besar.",
    accentColor: "bg-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  }
};

const sanitizeInput = (str) => {
  return str.replace(/[&<>"']/g, (match) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return map[match];
  });
};

function useQuiz() {
  const [step, setStep] = useState(1);
  const [userBio, setUserBio] = useState({ name: '', email: '', whatsapp: '', program: '' });
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('placement_test_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.userBio) setUserBio(parsed.userBio);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.currentIndex === 'number') setCurrentIndex(parsed.currentIndex);
      }
    } catch (e) {
      localStorage.removeItem('placement_test_session');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('placement_test_session', JSON.stringify({ step, userBio, answers, currentIndex }));
    } catch (e) {}
  }, [step, userBio, answers, currentIndex]);

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setUserBio(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateBio = () => {
    const newErrors = {};
    const sanitizedName = sanitizeInput(userBio.name.trim());
    const sanitizedEmail = sanitizeInput(userBio.email.trim());
    const sanitizedWA = sanitizeInput(userBio.whatsapp.trim());

    if (!sanitizedName) newErrors.name = "Nama lengkap wajib diisi.";
    if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      newErrors.email = "Masukkan alamat email yang valid.";
    }
    if (!sanitizedWA || !/^[0-9+]{9,15}$/.test(sanitizedWA)) {
      newErrors.whatsapp = "Nomor WhatsApp harus berupa angka (9-15 digit).";
    }
    if (!userBio.program) newErrors.program = "Pilih target program minat Anda.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setUserBio({ name: sanitizedName, email: sanitizedEmail, whatsapp: sanitizedWA, program: userBio.program });
      return true;
    }
    return false;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateResult = useCallback(() => {
    let score = 0;
    MOCK_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correct) score += 1;
    });
    const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100);
    let level = 'Beginner';
    if (percentage > 75) level = 'Advanced';
    else if (percentage > 40) level = 'Intermediate';

    return { score, total: MOCK_QUESTIONS.length, percentage, level };
  }, [answers]);

  const resetQuiz = () => {
    if (window.confirm("Apakah Anda yakin ingin mengulang tes dari awal?")) {
      try {
        localStorage.removeItem('placement_test_session');
      } catch (e) {}
      setUserBio({ name: '', email: '', whatsapp: '', program: '' });
      setAnswers({});
      setCurrentIndex(0);
      setErrors({});
      setStep(1);
    }
  };

  return {
    step, setStep,
    userBio, handleBioChange, validateBio,
    errors,
    answers, handleSelectOption,
    currentIndex, setCurrentIndex,
    calculateResult, resetQuiz
  };
}

const InputGroup = React.memo(({ label, name, type = "text", value, onChange, placeholder, error, options }) => (
  <div className="text-left mb-4">
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'} rounded-xl focus:outline-none focus:ring-4 transition duration-200 text-sm`}
      >
        <option value="">-- Pilih Target Program --</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-white border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'} rounded-xl focus:outline-none focus:ring-4 transition duration-200 text-sm`}
      />
    )}
    {error && <span className="text-xs text-red-500 font-medium mt-1 block">{error}</span>}
  </div>
));

const ProgressBar = React.memo(({ current, total, answeredCount }) => {
  const percent = Math.round((answeredCount / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
        <span className="uppercase tracking-wider text-blue-600">Soal {current} dari {total}</span>
        <span>Terjawab: {answeredCount}/{total} ({percent}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

const OptionButton = React.memo(({ text, isSelected, onClick, index }) => {
  const labels = ['A', 'B', 'C', 'D'];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between mb-3 ${
        isSelected
          ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold shadow-sm ring-2 ring-blue-500/20'
          : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${
          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}>
          {labels[index]}
        </span>
        <span className="text-sm">{text}</span>
      </div>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
      }`}>
        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
});

export default function Role() {
  const {
    step, setStep,
    userBio, handleBioChange, validateBio,
    errors,
    answers, handleSelectOption,
    currentIndex, setCurrentIndex,
    calculateResult, resetQuiz
  } = useQuiz();

  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (validateBio()) {
      setStep(2);
    }
  };

  const currentQ = MOCK_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const result = calculateResult();
  const recommendation = PROGRAM_RECOMMENDATIONS[result.level];

  const waPhone = "6281234567890";
  const waText = encodeURIComponent(
    `Halo Admin, saya *${userBio.name}* telah menyelesaikan Placement Test!\n\n` +
    `*Detail Hasil Evaluasi:*\n` +
    `- Skor: ${result.score} / ${result.total} (${result.percentage}%)\n` +
    `- Level: *${result.level}*\n` +
    `- Target Program: ${userBio.program}\n` +
    `- Rekomendasi Program: *${recommendation.title}*\n\n` +
    `Mohon info pendaftaran dan konsultasi lebih lanjut. Terima kasih!`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full text-center mb-6 fade-in">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Front-End Selection Project
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Placement Test Engine
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Evaluasi Mandiri Multi-Step & Rekomendasi Program Belajar
        </p>
      </div>

      <div className="max-w-xl w-full custom-card p-6 sm:p-8 fade-in">
        {step === 1 && (
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">1. Registrasi Biodata</h2>
              <p className="text-xs text-slate-500 mt-1">Isi identitas Anda secara valid sebelum memulai kuis placement.</p>
            </div>

            <form onSubmit={handleStartQuiz}>
              <InputGroup
                label="Nama Lengkap"
                name="name"
                value={userBio.name}
                onChange={handleBioChange}
                placeholder="Contoh: Jasmine"
                error={errors.name}
              />
              <InputGroup
                label="Email Aktif"
                name="email"
                type="email"
                value={userBio.email}
                onChange={handleBioChange}
                placeholder="nama@domain.com"
                error={errors.email}
              />
              <InputGroup
                label="Nomor WhatsApp"
                name="whatsapp"
                type="tel"
                value={userBio.whatsapp}
                onChange={handleBioChange}
                placeholder="081234567890"
                error={errors.whatsapp}
              />
              <InputGroup
                label="Target Program Minat"
                name="program"
                value={userBio.program}
                onChange={handleBioChange}
                options={[
                  "Front-End Web Development",
                  "React Specialization",
                  "Full-Stack Web Engineering"
                ]}
                error={errors.program}
              />

              <button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 transition duration-200 text-sm flex items-center justify-center space-x-2"
              >
                <span>Mulai Tes Placement</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <ProgressBar current={currentIndex + 1} total={MOCK_QUESTIONS.length} answeredCount={answeredCount} />

            <div className="min-h-[220px]">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 text-left leading-snug">
                {currentQ.text}
              </h3>

              <div className="space-y-1">
                {currentQ.options.map((opt, idx) => (
                  <OptionButton
                    key={idx}
                    index={idx}
                    text={opt}
                    isSelected={answers[currentQ.id] === idx}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-4">
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &larr; Sebelumnya
              </button>

              {currentIndex === MOCK_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin menyelesaikan tes sekarang?")) {
                      setStep(3);
                    }
                  }}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition"
                >
                  Submit Ujian
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition"
                >
                  Berikutnya &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <span className={`inline-block border text-xs font-bold px-3 py-1 rounded-full mb-3 ${recommendation.badgeColor}`}>
              {recommendation.levelBadge}
            </span>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-1">
              Selamat, {userBio.name}!
            </h2>
            <p className="text-xs text-slate-500 mb-6">Hasil evaluasi tes pengerjaan Anda telah dihitung secara presisi.</p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
              <div className="text-4xl font-black text-blue-600 mb-1">{result.percentage}%</div>
              <p className="text-xs text-slate-600">
                Menjawab Benar <strong className="text-slate-800">{result.score}</strong> dari <strong className="text-slate-800">{result.total}</strong> Soal Evaluasi
              </p>
            </div>

            <div className="text-left bg-blue-50/60 border border-blue-200 p-5 rounded-2xl mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${recommendation.accentColor}`}></div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Rekomendasi Program</span>
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-2">{recommendation.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{recommendation.description}</p>
            </div>

            <div className="space-y-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition text-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>Konsultasi via WhatsApp CTA</span>
              </a>

              <button
                type="button"
                onClick={resetQuiz}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition text-xs"
              >
                Ulangi Tes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Role />
    </React.StrictMode>
  );
}