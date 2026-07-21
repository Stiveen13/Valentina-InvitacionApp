import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Container, Row, Col, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Music, 
  Pause, 
  Play, 
  Heart, 
  ChevronDown,
  Phone,
  Gift,
  Sparkles,
  AlertCircle,
  Crown
} from 'lucide-react';

// --- Constants ---
const EVENT_DATE = new Date('2026-09-26T20:00:00');
const RSVP_PHONE = '573187344947';
const RSVP_CONTACT_NAME = 'Mariana Lozano Santa';
const SHEETS_URL = "https://script.google.com/macros/s/AKfycby8fPPLOm8YwWQpWauBah-DaUn3Gllqw-DQLmMZbKKA2ujq9Sg-QpLh4gtZfKo1KxrhhA/exec";
const MUSIC_URL = 'https://www.googleapis.com/drive/v3/files/1QOGxv1ZeLjrfWk6pu4IsdS1LyGfbWsIq/?alt=media&key=AIzaSyANTOMhIHUFCjz1OWcz0oDa4Yah5WWMYvE'; // Song URL

// --- Custom Sleeping Beauty Fairytale Icons ---

const CrownIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 80" className={className} fill="currentColor">
    <path d="M10 65 L20 25 L40 45 L50 15 L60 45 L80 25 L90 65 Z" fill="currentColor" opacity="0.95" />
    <path d="M10 65 L90 65 L85 75 L15 75 Z" fill="currentColor" />
    <circle cx="20" cy="20" r="5" className="fill-quince-gold-light" />
    <circle cx="50" cy="10" r="6" className="fill-quince-gold-light animate-pulse" />
    <circle cx="80" cy="20" r="5" className="fill-quince-gold-light" />
    <circle cx="50" cy="35" r="3.5" className="fill-white" />
  </svg>
);

const CastleIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M20 90 L20 50 L30 40 L30 90 Z" opacity="0.8" />
    <path d="M70 90 L70 40 L80 50 L80 90 Z" opacity="0.8" />
    <path d="M30 90 L30 35 L50 20 L70 35 L70 90 Z" />
    <polygon points="50,5 45,20 55,20" className="fill-quince-gold-light" />
    <polygon points="25,25 20,40 30,40" className="fill-quince-gold-light" />
    <polygon points="75,25 70,40 80,40" className="fill-quince-gold-light" />
    <path d="M42 90 A 8 12 0 0 1 58 90 Z" className="fill-quince-cream" />
  </svg>
);

const RoseIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 20 C35 20 25 32 30 48 C35 64 50 75 50 88 C50 75 65 64 70 48 C75 32 65 20 50 20 Z" opacity="0.9" />
    <path d="M50 28 C42 28 36 35 40 45 C44 55 50 62 50 70 C50 62 56 55 60 45 C64 35 58 28 50 28 Z" fill="#E899AC" />
    <circle cx="50" cy="38" r="5" fill="#FFF4D9" />
  </svg>
);

const WatercolorBackground = () => (
  <div className="quince-bg pointer-events-none">
    <div className="brush-stroke w-[600px] h-[600px] bg-quince-rose/30 -top-20 -left-20" />
    <div className="brush-stroke w-[500px] h-[500px] bg-quince-blush/30 top-1/4 -right-10" />
    <div className="brush-stroke w-[700px] h-[700px] bg-quince-lavender/40 -bottom-20 left-10" />
    <div className="brush-stroke w-[400px] h-[400px] bg-quince-rose/20 bottom-1/4 right-1/4" />
    
    {[...Array(25)].map((_, i) => (
      <div 
        key={i} 
        className="gold-sparkle"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>
);

const SparklingLight = ({ className }: { className?: string }) => (
  <motion.div
    animate={{ 
      x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      y: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
      opacity: [0.4, 1, 0.4, 0.8, 0.4],
      scale: [1, 1.5, 1, 1.2, 1]
    }}
    transition={{ 
      duration: 10 + Math.random() * 10, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(212,175,55,0.5)] blur-[1px] ${className}`}
  />
);

const MagicDust = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: `${Math.random() * 100}vw`, 
          y: `${Math.random() * 100}vh`,
          opacity: 0 
        }}
        animate={{ 
          x: [
            `${Math.random() * 100}vw`, 
            `${Math.random() * 100}vw`, 
            `${Math.random() * 100}vw`
          ],
          y: [
            `${Math.random() * 100}vh`, 
            `${Math.random() * 100}vh`, 
            `${Math.random() * 100}vh`
          ],
          opacity: [0, 0.8, 0.2, 0.8, 0],
          scale: [0.5, 1.6, 0.5, 1.6, 0.5]
        }}
        transition={{ 
          duration: 15 + Math.random() * 25, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white,0_0_15px_rgba(212,175,55,0.5)]"
      />
    ))}
  </div>
);

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = EVENT_DATE.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = React.memo(({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center px-2 py-1.5 md:px-3.5 md:py-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-md min-w-[65px] sm:min-w-[75px] md:min-w-[95px]">
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-quince-gold tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[9px] md:text-[11px] uppercase tracking-widest text-quince-gold-bg/90 font-bold">{label}</span>
    </div>
  ));

  return (
    <div className="flex gap-1.5 sm:gap-2 md:gap-3 justify-center mt-8 relative z-10 w-full px-1">
      <TimeUnit value={timeLeft.days} label="Días" />
      <TimeUnit value={timeLeft.hours} label="Horas" />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <TimeUnit value={timeLeft.seconds} label="Seg" />
    </div>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  useEffect(() => {
    const handleInvitationOpen = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log("Autoplay blocked or failed:", err));
      }
    };

    window.addEventListener('invitationOpened', handleInvitationOpen);
    return () => window.removeEventListener('invitationOpened', handleInvitationOpen);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio 
        ref={audioRef} 
        src={MUSIC_URL}
        loop 
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          const error = (e.target as any).error;
          console.error("Error de carga de audio:", error);
        }}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-300 ${
          isPlaying ? 'bg-quince-gold text-white' : 'bg-white text-quince-gold border border-quince-gold/20'
        }`}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 bg-quince-gold-light w-4 h-4 rounded-full flex items-center justify-center"
          >
            <Music size={10} className="text-quince-gold" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    asistira: '',
    numero: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEnviar = async () => {
    const { nombre, asistira, numero } = formData;

    if (!nombre || !asistira || !numero) {
      alert("Por favor completa todos los campos");
      return;
    }

    setStatus("Enviando...");

    try {
      // 🔥 Guardar en Google Sheets
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData)
      });

      setStatus("✅ Confirmación enviada");
      
      // 📲 WhatsApp
      const mensaje = `🎉 Confirmación de asistencia (15 Años de Mariana):
Nombre: ${nombre}
Asistencia: ${asistira}
Número de personas: ${numero}`;

      const waUrl = `https://wa.me/${RSVP_PHONE}?text=${encodeURIComponent(mensaje)}`;
      
      setTimeout(() => {
        setIsSubmitted(true);
        window.location.href = waUrl;
      }, 1000);

    } catch (error) {
      console.error("Error al enviar:", error);
      setStatus("❌ Hubo un error, intenta de nuevo");
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-2xl mt-10 text-center"
      >
        <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2 text-white">¡Gracias por confirmar!</h3>
        <p className="text-white/90 italic">Tu respuesta ha sido registrada. ¡Mariana te espera para celebrar juntos!</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-2xl mt-10">
      <div className="flex justify-center mb-3">
        <CrownIcon className="w-10 h-10 text-quince-gold animate-bounce" />
      </div>
      <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2 text-white">🎉 ¡Queremos celebrar contigo!</h3>
      <p className="text-white/90 mb-4 italic text-sm">Confirma tu asistencia completando el siguiente formulario</p>
      
      {/* RSVP Deadline Notice */}
      <div className="mb-6 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-quince-gold/40 text-white text-xs font-bold flex items-center justify-center gap-2">
        <AlertCircle size={16} className="text-quince-gold-light shrink-0" />
        <span>Fecha límite para confirmar: <strong>Viernes 18 de septiembre</strong></span>
      </div>

      <div className="space-y-5 text-left">
        <div>
          <label className="block text-white font-bold mb-1.5 text-xs uppercase tracking-wider">Tu nombre completo</label>
          <input 
            type="text"
            placeholder="Escribe tu nombre y apellido" 
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full p-3.5 rounded-xl bg-white/80 border border-white/60 focus:ring-2 focus:ring-quince-gold outline-none text-black placeholder-black/50 font-medium"
          />
        </div>

        <div>
          <label className="block text-white font-bold mb-1.5 text-xs uppercase tracking-wider">¿Podrás acompañarnos?</label>
          <select 
            value={formData.asistira}
            onChange={(e) => setFormData({...formData, asistira: e.target.value})}
            className="w-full p-3.5 rounded-xl bg-white/80 border border-white/60 focus:ring-2 focus:ring-quince-gold outline-none text-black font-medium transition-all"
          >
            <option value="">Selecciona una opción</option>
            <option value="Sí, allí estaré">Sí, allí estaré</option>
            <option value="No podré asistir">No podré asistir</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-bold mb-1.5 text-xs uppercase tracking-wider">Número total de asistentes</label>
          <select 
            value={formData.numero}
            onChange={(e) => setFormData({...formData, numero: e.target.value})}
            className="w-full p-3.5 rounded-xl bg-white/80 border border-white/60 focus:ring-2 focus:ring-quince-gold outline-none text-black font-medium transition-all"
          >
            <option value="">Selecciona la cantidad</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
            ))}
          </select>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnviar}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-transform cursor-pointer text-base mt-2"
        >
          <Phone size={20} />
          Confirmar asistencia
        </motion.button>

        {status && (
          <p className="mt-3 text-white font-bold animate-pulse text-center text-sm">{status}</p>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      window.dispatchEvent(new Event('invitationOpened'));
    }, 1800);
  };

  return (
    <div className="min-h-screen relative text-quince-text font-['Montserrat'] overflow-x-hidden bg-quince-cream">
      <WatercolorBackground />
      <MagicDust />
      
      <SparklingLight className="top-20 left-[5%]" />
      <SparklingLight className="top-[40%] right-[5%]" />
      <SparklingLight className="bottom-[20%] left-[10%]" />
      <SparklingLight className="top-[70%] left-[2%]" />
      <SparklingLight className="bottom-[5%] right-[8%]" />
      <SparklingLight className="top-[15%] right-[12%]" />
      <SparklingLight className="bottom-[45%] right-[2%]" />
      
      {/* Envelope Opening Overlay */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="envelope-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-[#ECA8BA] flex flex-col items-center justify-center p-4"
          >
            {!isOpening && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleOpen}
                className="flex flex-col items-center cursor-pointer"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8 text-quince-gold-light font-['Playfair_Display'] italic text-2xl tracking-[0.2em] font-bold flex items-center gap-2"
                >
                  <Crown size={24} className="text-quince-gold" />
                  <span>Toca para abrir la invitación real</span>
                  <Crown size={24} className="text-quince-gold" />
                </motion.div>

                <div className="relative w-full max-w-[450px] aspect-[4/3]">
                  {/* Sombra del sobre */}
                  <div className="absolute inset-0 bg-black/20 blur-2xl transform translate-y-8 scale-90 rounded-full" />
                  
                  {/* Cuerpo del sobre temática La Bella Durmiente */}
                  <div className="relative w-full h-full bg-[#F8A8BD] shadow-2xl rounded-b-lg border-4 border-quince-gold/60 overflow-hidden">
                    {/* Solapa Superior */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1/2 bg-[#FFBCCB] border-b-4 border-quince-gold/60 shadow-md rounded-t-lg flex justify-center items-center"
                      style={{ 
                        transformOrigin: "top", 
                        zIndex: 20,
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)" 
                      }}
                    >
                    </div>
                    {/* Sello real dorado */}
                    <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-quince-gold rounded-full border-2 border-white flex items-center justify-center shadow-lg z-30">
                      <CrownIcon className="w-8 h-8 text-white" />
                    </div>

                    {/* Lados del sobre */}
                    <div 
                      className="absolute inset-0 bg-[#F8A8BD]/95 border-t-2 border-quince-gold/30" 
                      style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", zIndex: 15 }}
                    />
                    <div 
                      className="absolute inset-0 bg-[#F8A8BD]/85" 
                      style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)", zIndex: 10 }}
                    />
                    <div 
                      className="absolute inset-0 bg-[#F8A8BD]/85" 
                      style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)", zIndex: 10 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {isOpening && (
              <div className="relative w-full max-w-[450px] aspect-[4/3]">
                <div className="absolute inset-0 bg-black/20 blur-2xl transform translate-y-8 scale-90 rounded-full" />
                
                <div className="relative w-full h-full bg-[#F8A8BD] shadow-2xl rounded-b-lg border-4 border-quince-gold/60 overflow-hidden">
                  <motion.div 
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: -160 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-[#FFBCCB] border-b-4 border-quince-gold/60 shadow-md rounded-t-lg"
                    style={{ 
                      transformOrigin: "top", 
                      zIndex: 20,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)" 
                    }}
                  />

                  {/* Carta saliendo */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -60 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-x-4 bottom-4 top-8 bg-white/95 shadow-inner p-4 flex flex-col items-center justify-center border-2 border-quince-gold rounded-t-lg"
                  >
                    <CrownIcon className="text-quince-rose mb-2 w-10 h-10 animate-pulse" />
                    <p className="font-['Alex_Brush'] text-2xl text-quince-rose">Mariana</p>
                    <p className="font-['Playfair_Display'] text-xs text-quince-rose/80 uppercase tracking-widest font-bold">15 Años</p>
                  </motion.div>

                  <div 
                    className="absolute inset-0 bg-[#F8A8BD]/95 border-t-2 border-quince-gold/30" 
                    style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", zIndex: 15 }}
                  />
                  <div 
                    className="absolute inset-0 bg-[#F8A8BD]/85" 
                    style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)", zIndex: 10 }}
                  />
                  <div 
                    className="absolute inset-0 bg-[#F8A8BD]/85" 
                    style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)", zIndex: 10 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpened ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* --- Hero Section --- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center isolate overflow-hidden">
          <WatercolorBackground />
          
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.15, 0.35, 0.15],
                scale: [1, 1.25, 1]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-32 h-32 rounded-full bg-quince-gold-light/20 blur-3xl pointer-events-none"
              style={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
            />
          ))}

          <motion.div
            className="relative max-w-4xl w-full z-10 p-8 md:p-20 flex flex-col items-center justify-center min-h-[750px] bg-quince-gold-bg/95 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.4)] border-x-4 border-quince-gold/40 rounded-3xl my-8"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(212,175,55,0.08) 0%, transparent 12%, transparent 88%, rgba(212,175,55,0.08) 100%)'
            }}
          >
            {/* Scroll Top Roll */}
            <div className="absolute -top-4 left-[-10px] right-[-10px] h-10 bg-[#e0bc7a] rounded-full border-2 border-quince-gold/50 shadow-md z-20 flex items-center justify-between px-3">
              <div className="w-4 h-8 bg-black/20 rounded-full" />
              <div className="w-4 h-8 bg-black/20 rounded-full" />
            </div>

            {/* Scroll Bottom Roll */}
            <div className="absolute -bottom-4 left-[-10px] right-[-10px] h-10 bg-[#e0bc7a] rounded-full border-2 border-quince-gold/50 shadow-md z-20 flex items-center justify-between px-3">
              <div className="w-4 h-8 bg-black/20 rounded-full" />
              <div className="w-4 h-8 bg-black/20 rounded-full" />
            </div>

            <div className="max-w-2xl w-full">
              {/* Crown Emblem */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-3"
              >
                <CrownIcon className="w-16 h-16 text-quince-rose drop-shadow-md" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-['Alex_Brush'] text-5xl md:text-6xl text-quince-rose mb-1 drop-shadow-sm"
              >
                Mis
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-['Alex_Brush'] text-7xl md:text-9xl text-quince-rose mb-4 drop-shadow-sm leading-tight"
              >
                Quince Años
              </motion.h1>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                 <div className="h-px w-12 md:w-20 bg-quince-rose/60" />
                 <motion.h2 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="font-['Playfair_Display'] italic text-3xl md:text-5xl text-quince-rose font-bold tracking-wide"
                 >
                   Mariana Lozano Santa
                 </motion.h2>
                 <div className="h-px w-12 md:w-20 bg-quince-rose/60" />
              </div>

              {/* Theme Subtitle */}
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-quince-rose/10 border border-quince-rose/30 mb-8">
                <Sparkles size={16} className="text-quince-rose" />
                <span className="font-['Playfair_Display'] text-sm md:text-base font-bold text-quince-rose tracking-wider uppercase">
                  Temática: La Bella Durmiente
                </span>
                <Sparkles size={16} className="text-quince-rose" />
              </div>
   
              <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-quince-rose/20 shadow-inner mb-6 text-center">
                <p className="font-['Playfair_Display'] italic text-lg md:text-xl text-black/85 leading-relaxed">
                  "Con gran alegría quiero invitarte a celebrar conmigo un día muy especial: mis 15 años.
                  <br /><br />
                  Será una noche llena de emociones, sueños, música y momentos inolvidables. Tu compañía hará que esta fecha sea aún más especial para mí. Espero contar con tu presencia para compartir juntos esta hermosa celebración."
                </p>
              </div>

              <CountdownTimer />
            </div>
          </motion.div>
        </section>

        {/* --- Fairytale Photo Carousel Section --- */}
        <section id="carousel-section" className="py-20 relative overflow-hidden bg-white/10 backdrop-blur-[2px]">
          <Container fluid className="px-0">
            <div className="max-w-[95vw] md:max-w-3xl mx-auto px-2">
              <div className="relative aspect-[3/5] md:aspect-[4/5] w-full">
                <div className="absolute inset-0 bg-quince-blush/30 blur-[120px] rounded-full scale-110" />
                
                <div className="relative h-full w-full p-2 md:p-4">
                  <div className="relative h-full w-full card-photo-frame border-8 border-white shadow-2xl rounded-2xl overflow-hidden">
                    <Carousel fade indicators={false} controls={true} className="h-full">
                      {[             
                        "https://lh3.googleusercontent.com/d/1DRIuih9U9Oi_Lp-iP4HWscW2WXEpXB7i"
                      ].map((src, idx) => (
                        <Carousel.Item key={idx} className="h-full bg-[#F8A8BD]">
                          <img 
                            src={src} 
                            alt={`Mariana ${idx + 1}`}
                            className="w-full h-full object-cover opacity-90"
                            referrerPolicy="no-referrer"
                            style={{ filter: "contrast(1.05) saturate(1.1)" }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                </div>

                <SparklingLight className="-top-10 -left-10 scale-[2] blur-[2px]" />
                <SparklingLight className="-bottom-20 left-1/4 scale-150 blur-[3px]" />
                <SparklingLight className="top-1/2 -right-16 scale-125 blur-[1px]" />
                
                <div className="absolute -bottom-10 -right-10 w-28 h-28 text-quince-gold opacity-80 animate-pulse">
                  <RoseIcon className="w-full h-full" />
                </div>
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-14 text-center font-['Playfair_Display'] italic text-2xl text-white max-w-2xl mx-auto px-4 leading-relaxed"
            >
              "Gracias por formar parte de mi cuento de hadas."
            </motion.p>
          </Container>
        </section>

        {/* --- Details Section --- */}
        <section className="py-20 bg-white/30 backdrop-blur-md relative border-y border-quince-gold/20 overflow-hidden">
          <Container>
            <Row className="text-center g-4 justify-center">
              {/* Fecha */}
              <Col md={4} sm={6}>
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center bg-white/20 p-6 rounded-3xl border border-white/40 shadow-lg h-full">
                  <div className="w-16 h-16 bg-quince-rose text-white rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/30">
                    <Calendar size={28} />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-white">Fecha</h3>
                  <p className="text-quince-gold-light uppercase tracking-widest text-xs font-bold">Sábado</p>
                  <p className="text-2xl font-bold text-white mt-1">26 de Septiembre</p>
                </motion.div>
              </Col>

              {/* Horarios */}
              <Col md={4} sm={6}>
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center bg-white/20 p-6 rounded-3xl border border-white/40 shadow-lg h-full">
                  <div className="w-16 h-16 bg-quince-gold text-white rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/30">
                    <Clock size={28} />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-white">Horario</h3>
                  <p className="text-quince-gold-light uppercase tracking-widest text-xs font-bold">Recepción & Fiesta</p>
                  <p className="text-2xl font-bold text-white mt-1">8:00 P.M. – 3:00 A.M.</p>
                  <div className="mt-3 bg-white/30 px-3 py-1.5 rounded-full border border-white/50 text-xs text-white font-bold inline-flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-quince-gold-light" />
                    <span>Puntualidad: 8:00 P.M.</span>
                  </div>
                </motion.div>
              </Col>

              {/* Lugar */}
              <Col md={4} sm={12}>
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center bg-white/20 p-6 rounded-3xl border border-white/40 shadow-lg h-full">
                  <div className="w-16 h-16 bg-white text-quince-rose rounded-full flex items-center justify-center mb-4 shadow-xl border border-quince-rose/30">
                    <MapPin size={28} />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-white">Lugar</h3>
                  <p className="text-quince-gold-light uppercase tracking-widest text-xs font-bold">Finca La Caleñita</p>
                  <p className="text-lg font-bold text-white mt-0.5">(Restaurante Cortesana)</p>
                  <p className="text-sm text-white/90 mt-1">Tuluá, Corregimiento de Nariño</p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* --- Location Map Section --- */}
        <section className="py-20 bg-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-quince-rose/10 to-transparent" />
          <Container className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-3 text-white">¿Cómo llegar?</h2>
              <p className="text-quince-gold-light font-bold uppercase tracking-widest text-xs">
                Finca La Caleñita (Restaurante Cortesana) • Tuluá, Corregimiento de Nariño
              </p>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/80 h-[420px] relative">
              <iframe
                src="https://maps.google.com/maps?q=Finca+La+Cale%C3%B1ita+Restaurante+Cortesana+Tulua&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                title="Ubicación Finca La Caleñita"
              ></iframe>
            </div>
          </Container>
        </section>

        {/* --- Dress Code Section --- */}
        <section className="py-20 bg-white/10 backdrop-blur-sm relative overflow-hidden">
          <Container className="relative z-10 text-center">
            <div className="max-w-xl mx-auto p-10 md:p-12 rounded-[2.5rem] border-2 border-quince-gold/40 bg-quince-gold-bg/95 shadow-xl text-black">
              <div className="flex justify-center mb-3">
                <CrownIcon className="w-12 h-12 text-quince-rose" />
              </div>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4 text-quince-rose">Código de Vestimenta</h2>
              <p className="font-['Playfair_Display'] italic text-3xl font-bold text-black mb-4">
                Traje Formal
              </p>
              <div className="h-px w-28 bg-quince-rose/40 mx-auto mb-5" />
              <p className="text-sm md:text-base font-bold text-quince-rose/90 uppercase tracking-widest bg-quince-rose/10 py-3 px-6 rounded-xl inline-block border border-quince-rose/20">
                ✨ Vestimenta elegante para un cuento de ensueño ✨
              </p>
            </div>
          </Container>
        </section>

        {/* --- RSVP & Envelope / Gifts Section --- */}
        <section className="py-20 relative overflow-hidden text-center isolate">
          <div className="absolute inset-0 bg-quince-cream/70 backdrop-blur-[2px]" />
          
          <Container className="relative z-10">
            {/* Lluvia de Sobres / Gifts Notice */}
            <div className="mb-14 pb-12 border-b border-white/20 text-white flex flex-col items-center">
              <Gift className="mb-3 text-quince-gold animate-bounce" size={44} />
              <p className="uppercase tracking-[0.4em] text-xs opacity-60 mb-2 font-bold">Lluvia de Sobres</p>
              <p className="font-['Playfair_Display'] italic text-3xl md:text-4xl">"Tu presencia es nuestro mejor regalo"</p>
            </div>
            
            <h2 className="font-['Alex_Brush'] text-7xl md:text-8xl mb-4 text-quince-gold drop-shadow-lg">Confirmación de Asistencia</h2>

            {/* RSVP Form Component */}
            <RSVPForm />

            {/* Direct Contact */}
            <div className="mt-10 flex flex-col items-center">
              <p className="text-white/80 text-sm mb-3 italic">
                ¿Tienes alguna inquietud o consulta sobre el evento? Comunícate con:
              </p>
              <a 
                href={`https://wa.me/${RSVP_PHONE}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white font-bold hover:text-quince-gold transition-colors text-lg bg-white/15 px-7 py-3.5 rounded-full border border-white/30 backdrop-blur-md shadow-lg"
              >
                <Phone size={22} className="text-[#25D366]" />
                <span>WhatsApp: {RSVP_CONTACT_NAME} (318 734 4947)</span>
              </a>
            </div>
          </Container>
        </section>

        <MusicPlayer />

        {/* --- Footer --- */}
        <footer className="py-10 text-center text-white/40 text-xs uppercase tracking-[0.4em] font-bold">
          © 2026 15 Años de Mariana Lozano Santa • La Bella Durmiente
        </footer>
      </motion.div>
    </div>
  );
}
