import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaPlay, FaPause, FaChevronDown } from "react-icons/fa";
import confetti from "canvas-confetti";
import { Dialog } from "@headlessui/react";
import WishForm from '../src/WishForm';

export default function App() {
  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isFolded, setIsFolded] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = [useRef(null), useRef(null)]; // 2 video

  // Songs list
  const songs = [
    { title: "Perfect - Ed Sheeran", src: "https://www.dropbox.com/scl/fi/3iol9jvbwj5t4w65jbhvn/Ed_Sheeran-Perfect.mp3?rlkey=lmaiavydgqm8bbolc0wpri0kv&st=d01ph4eq&raw=1" },
    { title: "Anji - Dia", src: "https://www.dropbox.com/scl/fi/eyacmnfwtcs0vegk8umj7/ANJI_DIA.mp3?rlkey=elhlfxeu36chrv2djvf1k6vhh&st=4o2ahkbx&raw=1" },
    { title: "Christina Perri - A Thousand Years", src: "https://www.dropbox.com/scl/fi/7qynoaueslqgw2wmam32m/Christina_Perri_A_Thousand_Years.mp3?rlkey=i1c43dz09hhh06ax7s1b1jxpt&st=2cu8elv9&raw=1" },
    { title: "HIVI - Remaja", src: "https://www.dropbox.com/scl/fi/217rhtkycn4oq8rsmrhp6/HIVI-_Remaja.mp3?rlkey=nyfawnqn5yynajof272lm67mk&st=rmj3gfv6&raw=1" },
    { title: "Katy Perry - Unconditionally", src: "https://www.dropbox.com/scl/fi/4vzke8zhb8isdzhd8mx2k/Katy-Perry_Unconditionally.mp3?rlkey=ytnbo592o20h2w5myxa9i50b3&st=59d99vvu&raw=1" },
    { title: "Raffa Affar - Cinta Sampai Mati", src: "https://dl.dropboxusercontent.com/scl/fi/zgmr3gfbmso7acj4s12zk/Cinta-Sampai-Mati-Raffa-Affar-Lirik-Video.mp3?rlkey=442nccny5c6kh011jubu3gfpt&st=k6nqnurs" },
    { title: "Surya Prtma - Pacar Cantik", src: "https://www.dropbox.com/scl/fi/c7nf3n35rtf1g74fmdpep/Surya-Prtma-Pacar-Cantik-Official-Lyric-Video.mp3?rlkey=oyug5y37ry6n3jsnhrmsqb0qv&st=3we4tz6s&dl=1" },
    { title: "Sandhy Sondoro - Tak Pernah Padam", src: "https://www.dropbox.com/scl/fi/bkwtay7qeywx6123ybrdd/Sandhy_Sondoro_Tak_Pernah_Padam.mp3?rlkey=6144ujcd6i9v7x715lktx8g1z&st=o4yisuts&raw=1" }
  ];

  // Timer Aniversary
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Load audio baru saat ganti lagu
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [currentIndex]);

  // Play/Pause handler
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {
          setHasInteracted(false);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Next song saat lagu habis
  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  // Sinkron status play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Dropdown pilih lagu
  const handleSongSelect = (e) => {
    const index = parseInt(e.target.value, 10);
    setCurrentIndex(index);
  };

  // Konfetti bonus 🎉
  const playConfetti = (options = {}) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0099', '#ff66cc', '#ff99dd'],
      ...options,
    });
  };

  // ⏯️ Auto play/pause logic
  useEffect(() => {
    if (!showVideo) return;

    const observers = videoRefs.map((videoRef, idx) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          });
        },
        { threshold: 0.6 } // video minimal 60% visible
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [showVideo]);

  // Timer for Anniversary
  const calculateTimeLeft = () => {
    const now = new Date();

    // Buat target tanggal 1 bulan ini
    let target = new Date(now.getFullYear(), now.getMonth(), 1);

    // Kalau sekarang sudah lewat tanggal 1, targetkan ke tanggal 1 bulan depan
    if (now >= target) {
      target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    const difference = target - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // Kalau lewat target, set semua jadi 0
      timeLeft = {
        Days: 0,
        Hours: 0,
        Minutes: 0,
        Seconds: 0,
      };
    }

    return timeLeft;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Falling Hearts Effect
  useEffect(() => {
    const heartInterval = setInterval(() => {
      if (hasInteracted) {
        confetti({
          particleCount: 3,
          spread: 50,
          origin: { x: Math.random(), y: 0 },
          shapes: ['heart'],
          colors: ['#ff66cc']
        });
      }
    }, 3000);

    return () => clearInterval(heartInterval);
  }, [hasInteracted]);

  // Gambar
  const galleryImages = [
    "https://dl.dropboxusercontent.com/scl/fi/h6s7tjm3dlnnshomfqkbl/1.JPG?rlkey=os4wt9py6m08itb34bmw1ma06&st=58xt9fpl&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/0r4tnmge3tkgwtinx6sam/2.JPG?rlkey=2ybrioll3gejykwgtopt1s7bf&st=ya8ayqko&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/pnit051pegsqy2t2a7mue/3.JPG?rlkey=zdyi7hl3m5miuotb463dze7r2&st=2a1y5mr4&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/920x5lk3t49j9bgfkwe0l/4.JPG?rlkey=ur1pf1sgio6lqfsgg604ucy63&st=5avj9as8&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/h97fjhw9uc7xo3uxt69jf/5.JPG?rlkey=wgt94pf62udey7zt3zqgxglb9&st=xfsmpvxq&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/dmekh0h7jlrd6l3omaidz/6.JPG?rlkey=u7v9kp7f6687k5hd4v9593xm7&st=s8z2xdvm&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/6jx90fldax2w5qdu5ggep/7.jpg?rlkey=xzcwe0jymmwec1n38igs303f3&st=ua29ums6&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/obb6twx6o6fmpp14x0frj/8.jpg?rlkey=ibshf0tbo8955wo3yat98joax&st=32edk1dw&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/wjwox0hvpjyhvhfjw6hiy/9.jpg?rlkey=1mxeca0wypfuz27qr33bi34az&st=1o8wce5p&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/6lytla2l31epa0b09g7gf/10.jpg?rlkey=8lvtockqps0tgyuoys42443we&st=chki32nm&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/le3qxvl7a3b78949l63qi/11.JPG?rlkey=7osdgyx98vnl758q29tm6inq1&st=fxhaldea&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/6jbcekn4ocvwucjyj7zue/12.jpg?rlkey=as7b74s53ci7d9cxvh1g8ibno&st=0jtu0rhc&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/thm5n9c7zaw3m5fphso7s/13.jpg?rlkey=j452emrmjgr6mzrwc8amx4dk8&st=t6bece95&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/t5aymiay2ulenz14154r9/14.jpg?rlkey=r3er48timb7kkdi4ykevi7m2x&st=vn6p8vdz&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/x4k5edphul6nwcmug9jj3/15.jpg?rlkey=hstoyv9u7jyi2e4rs9f63w03b&st=q4waevw1&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/b49834sl5qxxjgicoi3yy/16.jpg?rlkey=8wqaj4clx36bstx3iw4zy3hmr&st=1ex8wtki&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/p5h5touynr3pbv8thyes5/17.jpg?rlkey=cmo3fx9g218fo3tv6a4acs4g4&st=i4n29z29&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/z6c7uzwjtzucsba858hd3/18.JPG?rlkey=s4n4hnsm1gdg0lmz9ewpys0r7&st=7dgy0ymr&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/oega5f141fvf6jjq4klpr/19.JPG?rlkey=zh5sgr83mq846m9hla7wcy7jb&st=usavqjoh&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/t8kxr7egwkj15nr5haanp/20.JPG?rlkey=93kd079vgliyjccq09fcdm2y8&st=b0vrli3y&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/cej0xjwmsgfbwdkboddri/21.JPG?rlkey=2p1s6bvo2mv7rlfig0ugcp5yp&st=rboaokgl&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/qipun2at8oo6ysdhyfzjn/22.JPG?rlkey=qs0jyzmvwvu3olwyndelbh21w&st=kj7k1fta&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/x1vhoq66lhagc6p69mbd0/23.JPG?rlkey=kuxqol87p159hwp4wwtm6korv&st=hcdjqqzh&dl=1", 
    "https://dl.dropboxusercontent.com/scl/fi/5co4tvev0gmlxuu3pswd7/24.JPG?rlkey=mex5xbbacpwsqq5ufk865vxzu&st=y7dmp8rj&dl=1"
  ];

  // Pesan Cinta
  const loveNotes = [
    "Setiap hari bersamamu adalah halaman baru dalam buku kehidupan terindah yang pernah kutulis",
    "Aku selalu percaya, hidup adalah cerita panjang yang penuh kejutan, dan kamu adalah bagian terindah dalam setiap babnya",
    "Mataku selalu mencari wajahmu di setiap keramaian, karena hanya di hadapanmu aku merasa pulang",
    "Kamu adalah alasan di balik setiap senyum tulusku, kekuatan di balik setiap langkahku, dan ketenangan di balik setiap gelisahku",
    "Aku bersyukur pada alam semesta karena mempertemukan kita",
    "Tuhan tahu aku butuh seseorang sepertimu—seseorang yang membuatku percaya bahwa cinta memang sehangat ini, seteduh ini, dan sebenar ini.",
    "Terima kasih telah hadir dalam hidupku, mencintaiku dengan caramu yang sederhana namun selalu istimewa",
    "Aku janji, akan menjaga cerita kita sebaik mungkin. Menulis kisah baru bersamamu, setiap detiknya, dengan cinta yang tak akan pernah habis"
  ];

  // Kenangan Bersama
  const memories = [
    {
      date: "November 2024",
      title: "Pertama Bertemu",
      description: "Pertemuan tak sengaja di kampus setelah kamu selesai kelas...",
      emoji: "🌟"
    },
    {
      date: "April 2025",
      title: "Jalan Pertama",
      description: "Pergi nonton film bersama di bioskop",
      emoji: "🎬"
    },
    {
      date: "Jul 2025",
      title: "Quality Time",
      description: "Menghabiskan waktu bersama sebelum kamu pulang kampung",
      emoji: "🌳"
    }
  ];

  // Quiz
  const quizQuestions = [
    {
      question: "Dimana kita pertama kali bertemu?",
      options: ["Kafe", "Kampus", "Taman", "Mall"],
      answer: 1
    },
    {
      question: "Apa warna favoritku?",
      options: ["Merah", "Biru", "Hijau", "Hitam"],
      answer: 3
    },
    {
      question: "Apa hidden hobi aku?",
      options: ["Bernyanyi", "Mengambar", "Memasak", "Menulis"],
      answer: 2
    }
  ];

  // Quiz Handler
  const handleAnswer = (selectedOption) => {
    if (selectedOption === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
      playConfetti({ particleCount: 30 });
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 flex flex-col items-center justify-center text-center p-4 overflow-x-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
      >
        <source src={songs[currentIndex].src} type="audio/mpeg" />
      </audio>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4">
            Happy Birthday, <span className="text-rose-600">My Love🤍</span>!
          </h1>
          <div className="w-32 h-1 bg-pink-400 mx-auto"></div>
        </motion.div>

        {/* Birthday Message */}
        {[
          "Hari ini alam semesta merayakan keberadaanmu",
          "Kau hadirkan warna dalam hidup yang tadinya kelabu",
          "Terima kasih untuk semua tawa dan air mata yang kita bagi",
          "Semoga tahun ini membawa semua kebahagiaan untukmu",
          "Aku bersyukur bisa menjadi bagian dari hidupmu"
        ].map((text, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.5, duration: 1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-pink-800 mb-6"
          >
            {text}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-8 p-4 bg-white bg-opacity-50 rounded-xl backdrop-blur-sm shadow-sm"
        >
          <h3 className="text-xl font-semibold text-pink-700 mb-3">
            Menuju Mensiversary
          </h3>
          <div className="flex justify-center gap-3">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white p-2 rounded-lg min-w-16">
                <div className="text-2xl font-bold text-rose-600">{value}</div>
                <div className="text-xs text-pink-500 uppercase">{unit}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Memory Timeline */}
        <div className="mt-16 space-y-8">
          <h2 className="text-3xl font-bold text-pink-700">Our Journey</h2>
          {memories.map((memory, index) => (
            <motion.div
              key={index}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 3.5 + index * 0.3 }}
              className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-6`}
            >
              <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center text-3xl flex-shrink-0">
                {memory.emoji}
              </div>
              <div className={`p-5 rounded-xl ${index % 2 === 0 ? 'bg-pink-50' : 'bg-white'} border border-pink-200 flex-1 text-left`}>
                <h3 className="font-bold text-pink-600">{memory.date} • {memory.title}</h3>
                <p className="mt-2 text-pink-800">{memory.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Photo Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-pink-700 mb-8">Beautiful Memories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-xl shadow-lg border-2 border-pink-200"
              >
                <img
                  src={src}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-40 object-cover hover:scale-110 transition duration-500"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wish Form Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.8 }}
          className="mt-16 w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border-4 border-pink-200"
        >
          <h2 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">
            🎂 Tulis Keinginanmu 🎉
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Tulis doa atau harapan terbaikmu di sini 💖
          </p>
          <WishForm />
        </motion.div>

        {/* Love Quiz */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5 }}
          className="mt-16 bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-3xl font-bold text-pink-700 mb-6">Love Quiz</h2>

          {showResult ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">
                Skor Kamu: {score}/{quizQuestions.length}
              </h3>
              <p className="text-lg text-pink-800 mb-6">
                {score === quizQuestions.length
                  ? "Kamu benar-benar mengenalku! ❤️"
                  : score > quizQuestions.length / 2
                    ? "Lumayan... tapi bisa lebih baik!"
                    : "Kita perlu lebih banyak waktu bersama~"}
              </p>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowResult(false);
                }}
                className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
              >
                Main Lagi
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xl text-pink-800 mb-6">
                {quizQuestions[currentQuestion].question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quizQuestions[currentQuestion].options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    className="p-3 bg-pink-100 hover:bg-pink-200 rounded-lg transition text-pink-800 font-medium"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Origami Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5 }}
          className="mt-16 flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-4">Pesan Rahasia</h2>
          <motion.div
            className={`w-64 h-64 cursor-pointer ${isFolded ? 'bg-pink-400' : 'bg-pink-100 shadow-inner'}`}
            onClick={() => setIsFolded(!isFolded)}
            whileHover={{ scale: 1.03 }}
            animate={{
              rotate: isFolded ? [0, -5, 5, -5, 0] : 0,
              borderRadius: isFolded ? "30% 70% 70% 30% / 30% 30% 70% 70%" : "10px"
            }}
            transition={{ duration: 0.5 }}
          >
            {!isFolded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 h-full flex items-center justify-center text-center"
              >
                <p className="text-pink-800 font-medium text-lg">
                  "Jika cinta adalah seni, maka kamu adalah mahakaryanya yang paling indah"
                </p>
              </motion.div>
            )}
          </motion.div>
          <p className="mt-3 text-pink-600">Klik untuk {isFolded ? 'membuka' : 'menutup'}</p>
        </motion.div>
        
        <div className="mt-16">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setShowVideo(!showVideo);
          playConfetti();
        }}
        className="px-8 py-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition flex items-center gap-2 mx-auto"
      >
        {showVideo ? "Sembunyikan Video" : "Putar Video Kenangan"}
        <FaChevronDown
          className={`transition ${showVideo ? "rotate-180" : ""}`}
        />
      </motion.button>

      {showVideo && (
        <>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 overflow-hidden"
          >
            <video
              ref={videoRefs[0]}
              controls
              className="mx-auto rounded-xl shadow-xl w-full max-w-2xl"
              poster="/Romantic-birthday-site/src/gambar/13.jpg"
            >
              <source src="https://www.dropbox.com/scl/fi/kt9sr37gu8qv2ix37w6wi/memories.mp4?rlkey=p9q0ophyhg8h73tzitiu6n0b2&st=fhe3sgnt&raw=1" type="video/mp4" />
            </video>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 overflow-hidden"
          >
            <video
              ref={videoRefs[1]}
              controls
              className="mx-auto rounded-xl shadow-xl w-full max-w-2xl"
              poster="/Romantic-birthday-site/src/gambar/13.jpg"
            >
              <source src="https://www.dropbox.com/scl/fi/zmgxkzvv7mkr5y5v80y9z/memories2.mp4?rlkey=thjy4oc7epbiwwmd3rjaq5t6m&st=qh4as5lo&raw=1" type="video/mp4" />
            </video>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 overflow-hidden"
          >
            <video
              ref={videoRefs[1]}
              controls
              className="mx-auto rounded-xl shadow-xl w-full max-w-2xl"
              poster="/Romantic-birthday-site/src/gambar/13.jpg"
            >
              <source src="https://www.dropbox.com/scl/fi/3lr7yd7y2cassd45olq0v/memories3.mp4?rlkey=hscrghgpz6a55hppqh95p8uce&st=2sc20gkv&raw=1" type="video/mp4" />
            </video>
          </motion.div>
        </>
      )}
    </div>

        {/* Action Buttons */}
        <div className="mt-16 mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? "Pause Musik" : "Play Musik"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              playConfetti({ particleCount: 200 });
            }}
            className="px-6 py-3 bg-white text-pink-600 border-2 border-pink-400 rounded-full shadow-md hover:bg-pink-50 transition"
          >
            Baca Surat Cintaku 💌
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-0.5 mb-2 flex flex-col sm:flex-row justify-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-2 py-2 bg-pink-500 text-white rounded-full shadow-md transition"
        >
          <select
            value={currentIndex}
            onChange={handleSongSelect}
            className="px-1 py-1 bg-pink-500 text-white rounded-full outline-none cursor-pointer appearance-none text-center"
          >
            {songs.map((song, index) => (
              <option
                key={index}
                value={index}
                className="text-black text-center"
              >
                {song.title}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Love Letter Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-300">
            <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <Dialog.Title className="text-2xl font-bold">Untukmu, yang Paling Kucinta🤍</Dialog.Title>
            </div>

            <div className="p-6 space-y-4 text-pink-900 max-h-[60vh] overflow-y-auto">
              {loveNotes.map((note, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg border-b border-pink-100 pb-4"
                >
                  {note}
                </motion.p>
              ))}

              <div className="flex justify-center my-4">
                <FaHeart className="text-red-500 text-4xl animate-pulse" />
              </div>
            </div>

            <div className="p-4 bg-pink-50 flex justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition flex items-center gap-2"
              >
                Tutup <FaHeart className="text-sm" />
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Floating Hearts */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          delay: 6,
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2
        }}
        className="fixed bottom-8 right-8 text-pink-500 z-10"
      >
        <FaHeart size={48} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7 }}
        className="mt-12 text-pink-500 text-sm"
      >
        Made with ❤️ for you
      </motion.div>
    </div>
  );
}
