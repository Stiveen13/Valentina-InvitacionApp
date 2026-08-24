import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Calendar,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  Music,
  Navigation,
  Pause,
  Play,
  Phone,
  Gift,
  AlertCircle,
  Crown
} from 'lucide-react';

// --- Constants ---
const EVENT_DATE = new Date('2026-10-10T20:00:00');
const RSVP_PHONE = '';
const RSVP_CONTACT_NAME = 'Johanna Henao ';
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz13gzhWlyF5JbfpKTJl1sa6wd5RjmkqHuPlKZegXofMDQ2GmhX-VgOD6mG10vQX30l/exec";
const MUSIC_URL = 'https://www.googleapis.com/drive/v3/files/1A_pUpmyZyqNV2_S6yq5f3Rg8xjGMavqA/?alt=media&key=AIzaSyANTOMhIHUFCjz1OWcz0oDa4Yah5WWMYvE'; // Song URL

// Fotos servidas desde public/fotos en lugar de hotlink a Google Drive: JPEG
// comprimido (~225-325 KB c/u) frente a los ~2.5 MB de los PNG originales.
const PHOTOS = [
  { src: '/fotos/Foto-4.png', alt: 'valentina montoya henao ', width: 1086, height: 1448 },
  { src: '/fotos/Foto-1.png', alt: 'valentina montoya henao ', width: 1086, height: 1448 },
  { src: '/fotos/Foto-2.png', alt: 'valentina montoya henao ', width: 1086, height: 1448 },
  { src: '/fotos/Foto-3.png', alt: 'Valentina Montoya Henao ', width: 1086, height: 1448 },
];

const EVENT_END_DATE = new Date('2026-10-11T03:00:00');
const EVENT_TITLE = '15 Años de Valentina Montoya Henao ';
const EVENT_LOCATION = 'Vereda Belén';
const EVENT_DETAILS = 'Celebración de los 15 años de Valentina Montoya Henao  Traje formal. Puntualidad: 8:00 P.M.';
const MAPS_QUERY = 'Avícola buganviles';

// --- Helpers ---

const MUSIC_PREF_KEY = 'quince-musica';

const getMusicPreference = (): string | null => {
  try {
    return window.localStorage.getItem(MUSIC_PREF_KEY);
  } catch {
    // Safari en navegación privada lanza al tocar localStorage.
    return null;
  }
};

const setMusicPreference = (value: string) => {
  try {
    window.localStorage.setItem(MUSIC_PREF_KEY, value);
  } catch {
    /* preferencia no persistida, no es crítico */
  }
};

/** Formato de fecha flotante para iCalendar y Google Calendar: 20260926T200000 */
const toCalendarStamp = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    'T',
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    '00'
  ].join('');

const GOOGLE_CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent(EVENT_TITLE)}` +
  `&dates=${toCalendarStamp(EVENT_DATE)}/${toCalendarStamp(EVENT_END_DATE)}` +
  `&details=${encodeURIComponent(EVENT_DETAILS)}` +
  `&location=${encodeURIComponent(EVENT_LOCATION)}`;

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(MAPS_QUERY)}&navigate=yes`;

/** Genera y descarga un .ics para quien no use Google Calendar. */
const downloadIcs = () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//15 Valentina//ES',
    'BEGIN:VEVENT',
    `UID:${toCalendarStamp(EVENT_DATE)}-valentina-15@invitacion`,
    `DTSTAMP:${toCalendarStamp(new Date())}`,
    `DTSTART:${toCalendarStamp(EVENT_DATE)}`,
    `DTEND:${toCalendarStamp(EVENT_END_DATE)}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DETAILS}`,
    `LOCATION:${EVENT_LOCATION}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = '15-anos-valentina.ics';
  link.click();
  URL.revokeObjectURL(url);
};

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

const WatercolorBackground = () => {
  const reduceMotion = useReducedMotion();

  // Se calculan una sola vez: con Math.random() en el cuerpo del render las
  // posiciones cambiaban en cada re-render y las animaciones daban saltos.
  const sparkles = useMemo(
    () => [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`
    })),
    []
  );

  return (
    <div className="quince-bg pointer-events-none">
      <div className="brush-stroke w-[600px] h-[600px] bg-quince-rose/30 -top-20 -left-20" />
      <div className="brush-stroke w-[500px] h-[500px] bg-quince-blush/30 top-1/4 -right-10" />
      <div className="brush-stroke w-[700px] h-[700px] bg-quince-lavender/40 -bottom-20 left-10" />
      <div className="brush-stroke w-[400px] h-[400px] bg-quince-rose/20 bottom-1/4 right-1/4" />

      {!reduceMotion && sparkles.map((style, i) => (
        <div key={i} className="gold-sparkle" style={style} />
      ))}
    </div>
  );
};

const SparklingLight = ({ className }: { className?: string }) => {
  const reduceMotion = useReducedMotion();

  const drift = useMemo(() => ({
    x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
    y: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
    duration: 10 + Math.random() * 10
  }), []);

  if (reduceMotion) return null;

  return (
    <motion.div
      animate={{
        x: drift.x,
        y: drift.y,
        opacity: [0.4, 1, 0.4, 0.8, 0.4],
        scale: [1, 1.5, 1, 1.2, 1]
      }}
      transition={{
        duration: drift.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(212,175,55,0.5)] blur-[1px] ${className}`}
    />
  );
};

const MagicDust = () => {
  const reduceMotion = useReducedMotion();

  const motes = useMemo(
    () => [...Array(12)].map(() => ({
      startX: `${Math.random() * 100}vw`,
      startY: `${Math.random() * 100}vh`,
      x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
      y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
      duration: 15 + Math.random() * 25
    })),
    []
  );

  if (reduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {motes.map((mote, i) => (
        <motion.div
          key={i}
          initial={{ x: mote.startX, y: mote.startY, opacity: 0 }}
          animate={{
            x: mote.x,
            y: mote.y,
            opacity: [0, 0.8, 0.2, 0.8, 0],
            scale: [0.5, 1.6, 0.5, 1.6, 0.5]
          }}
          transition={{
            duration: mote.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white,0_0_15px_rgba(212,175,55,0.5)]"
        />
      ))}
    </div>
  );
};

// Definido fuera de CountdownTimer a propósito: dentro del padre se creaba un
// tipo de componente nuevo en cada tick, React remontaba los cuatro bloques
// cada segundo y el memo no servía de nada.
const TimeUnit = React.memo(({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center px-2 py-1.5 md:px-3.5 md:py-2 bg-white/70 rounded-2xl border border-white/60 shadow-md min-w-[65px] sm:min-w-[75px] md:min-w-[95px]">
    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-quince-deep tabular-nums">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[9px] md:text-[11px] uppercase tracking-widest text-quince-deep font-bold">{label}</span>
  </div>
));

const HeroGlow = () => {
  const reduceMotion = useReducedMotion();

  const glows = useMemo(
    () => [...Array(5)].map(() => ({
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
    })),
    []
  );

  if (reduceMotion) return null;

  return (
    <>
      {glows.map((glow, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.15, 0.35, 0.15],
            scale: [1, 1.25, 1]
          }}
          transition={{
            duration: glow.duration,
            repeat: Infinity,
            delay: glow.delay
          }}
          className="absolute w-32 h-32 rounded-full bg-quince-gold-light/20 blur-3xl pointer-events-none"
          style={{ top: glow.top, left: glow.left }}
        />
      ))}
    </>
  );
};

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

  return (
    <div className="flex gap-1.5 sm:gap-2 md:gap-3 justify-center mt-8 relative z-10 w-full px-1">
      <TimeUnit value={timeLeft.days} label="Días" />
      <TimeUnit value={timeLeft.hours} label="Horas" />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <TimeUnit value={timeLeft.seconds} label="Seg" />
    </div>
  );
};

const PhotoCarousel = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const goTo = (i: number) => setIndex(((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length);
  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % PHOTOS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [index, isPaused]);

  const photo = PHOTOS[index];

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={photo.src}
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
          className="w-full h-full object-cover opacity-90"
          style={{ filter: "contrast(1.05) saturate(1.1)" }}
        />
      </AnimatePresence>

      <button
        type="button"
        aria-label="Foto anterior"
        onClick={goPrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 text-quince-deep shadow-md hover:bg-white/90 transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Foto siguiente"
        onClick={goNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/70 backdrop-blur-sm border border-white/60 text-quince-deep shadow-md hover:bg-white/90 transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-label={`Ir a la foto ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}
          />
        ))}
      </div>
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
        setMusicPreference('off');
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setMusicPreference('on');
            })
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
      // Si el invitado ya silenció la música en una visita anterior, no se le
      // vuelve a imponer: la invitación se consulta varias veces antes del día.
      if (getMusicPreference() === 'off') return;

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
    <div className="fixed bottom-6 right-6 z-[var(--z-floating)]">
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
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pausar la música' : 'Reproducir la música'}
        aria-pressed={isPlaying}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-300 ${
          isPlaying ? 'bg-quince-gold text-quince-ink' : 'bg-white text-quince-deep border border-quince-deep/20'
        }`}
      >
        {isPlaying ? <Pause size={24} aria-hidden="true" /> : <Play size={24} aria-hidden="true" className="ml-1" />}
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

const FIELD_CLASS = "w-full p-3.5 rounded-xl bg-white/90 border border-white/60 focus:ring-2 focus:ring-quince-deep outline-none text-quince-ink placeholder-quince-ink/50 font-medium transition-all";
const LABEL_CLASS = "block text-quince-ink font-bold mb-1.5 text-xs uppercase tracking-wider";

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    asistira: '',
    numero: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [waUrl, setWaUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nombre, asistira, numero } = formData;
    const nextErrors: typeof errors = {};
    if (!nombre.trim()) nextErrors.nombre = "Escribe tu nombre y apellido";
    if (!asistira) nextErrors.asistira = "Indícanos si podrás acompañarnos";
    if (!numero) nextErrors.numero = "Selecciona cuántas personas asistirán";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSending(true);
    setStatus("Enviando...");

    const mensaje = ` Confirmación de asistencia (15 Años de    Valentina):
Nombre: ${nombre}
Asistencia: ${asistira}
Número de personas: ${numero}`;

    try {
      // 🔥 Guardar en Google Sheets
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData)
      });

      // 📲 WhatsApp: se ofrece como enlace en la pantalla de éxito en lugar de
      // navegar con window.location, que descartaba la confirmación en pantalla.
      setWaUrl(`https://wa.me/${RSVP_PHONE}?text=${encodeURIComponent(mensaje)}`);
    } catch (error) {
      console.error("Error al enviar:", error);
      setStatus("❌ Hubo un error, intenta de nuevo");
      setIsSending(false);
    }
  };

  if (waUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white/30 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-2xl mt-10 text-center"
      >
        <div className="w-20 h-20 bg-quince-deep rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2 text-quince-ink">¡Gracias por confirmar!</h3>
        <p className="text-quince-ink/90 italic mb-6">Tu respuesta ha sido registrada. ¡Valentina te espera para celebrar juntos!</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-quince-deep hover:bg-quince-ink text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 text-base"
        >
          <Phone size={20} />
          Avisar también por WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="rsvp-titulo"
      className="max-w-md mx-auto bg-white/30 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-2xl mt-10"
    >
      <div className="flex justify-center mb-3">
        <CrownIcon className="w-10 h-10 text-quince-deep animate-bounce" />
      </div>
      <h3 id="rsvp-titulo" className="font-['Playfair_Display'] text-2xl font-bold mb-2 text-quince-ink">🎉 ¡Queremos celebrar contigo!</h3>
      <p className="text-quince-ink/90 mb-4 italic text-sm">Confirma tu asistencia completando el siguiente formulario</p>

      {/* RSVP Deadline Notice */}
      <div className="mb-6 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-quince-deep/30 text-quince-ink text-xs font-bold flex items-center justify-center gap-2">
        <AlertCircle size={16} className="text-quince-deep shrink-0" />
        <span>Fecha límite para confirmar: <strong>Viernes 18 de septiembre</strong></span>
      </div>

      <div className="space-y-5 text-left">
        <div>
          <label htmlFor="rsvp-nombre" className={LABEL_CLASS}>Tu nombre completo</label>
          <input
            id="rsvp-nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="Escribe tu nombre y apellido"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? "rsvp-nombre-error" : undefined}
            className={FIELD_CLASS}
          />
          {errors.nombre && (
            <p id="rsvp-nombre-error" role="alert" className="mt-1.5 text-xs font-bold text-quince-deep">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label htmlFor="rsvp-asistira" className={LABEL_CLASS}>¿Podrás acompañarnos?</label>
          <select
            id="rsvp-asistira"
            name="asistira"
            value={formData.asistira}
            onChange={(e) => setFormData({...formData, asistira: e.target.value})}
            aria-invalid={!!errors.asistira}
            aria-describedby={errors.asistira ? "rsvp-asistira-error" : undefined}
            className={FIELD_CLASS}
          >
            <option value="">Selecciona una opción</option>
            <option value="Sí, allí estaré">Sí, allí estaré</option>
            <option value="No podré asistir">No podré asistir</option>
          </select>
          {errors.asistira && (
            <p id="rsvp-asistira-error" role="alert" className="mt-1.5 text-xs font-bold text-quince-deep">{errors.asistira}</p>
          )}
        </div>

        <div>
          <label htmlFor="rsvp-numero" className={LABEL_CLASS}>Número total de asistentes</label>
          <select
            id="rsvp-numero"
            name="numero"
            value={formData.numero}
            onChange={(e) => setFormData({...formData, numero: e.target.value})}
            aria-invalid={!!errors.numero}
            aria-describedby={errors.numero ? "rsvp-numero-error" : undefined}
            className={FIELD_CLASS}
          >
            <option value="">Selecciona la cantidad</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
            ))}
          </select>
          {errors.numero && (
            <p id="rsvp-numero-error" role="alert" className="mt-1.5 text-xs font-bold text-quince-deep">{errors.numero}</p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: isSending ? 1 : 1.02 }}
          whileTap={{ scale: isSending ? 1 : 0.98 }}
          disabled={isSending}
          className="w-full bg-quince-deep hover:bg-quince-ink disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-transform cursor-pointer text-base mt-2"
        >
          <Phone size={20} />
          {isSending ? 'Enviando…' : 'Confirmar asistencia'}
        </motion.button>

        {status && (
          <p role="status" className="mt-3 text-quince-ink font-bold text-center text-sm">{status}</p>
        )}
      </div>
    </form>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const hasOpenedRef = useRef(false);

  // Se dispara cuando la carta termina de salir del sobre (delay 0.8 + 1.2 s).
  // Antes era un setTimeout de 1800 ms, 200 ms antes de que acabara la
  // animación, así que el sobre se desvanecía a media reproducción.
  const handleEnvelopeDone = () => {
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;
    setIsOpened(true);
    window.dispatchEvent(new Event('invitationOpened'));
  };

  const handleOpen = () => {
    setIsOpening(true);
    // Red de seguridad: si la animación se interrumpe (pestaña en segundo plano,
    // movimiento reducido) onAnimationComplete no llega y el invitado se
    // quedaría encerrado en el sobre. El guard hace que solo entre uno.
    setTimeout(handleEnvelopeDone, 3000);
  };

  return (
    // Sin bg-quince-cream: este div es position:relative con z-index auto, así que
    // no crea contexto de apilamiento y su fondo opaco tapaba a .quince-bg
    // (z-index:-1). El degradado y los brush-stroke se calculaban sin verse nunca.
    <div className="min-h-screen relative text-quince-text font-['Montserrat'] overflow-x-hidden">
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
            className="fixed inset-0 z-[var(--z-overlay)] bg-quince-envelope flex flex-col items-center justify-center p-4"
          >
            {!isOpening && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleOpen}
                aria-label="Abrir la invitación"
                className="flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 rounded-3xl focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-quince-deep"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8 text-quince-deep font-['Playfair_Display'] italic text-2xl tracking-[0.2em] font-bold flex items-center gap-2"
                >
                  <Crown size={24} className="text-quince-deep" />
                  <span>Toca para abrir la invitación real</span>
                  <Crown size={24} className="text-quince-deep" />
                </motion.div>

                <div className="relative w-full max-w-[450px] aspect-[4/3]">
                  {/* Sombra del sobre */}
                  <div className="absolute inset-0 bg-black/20 blur-2xl transform translate-y-8 scale-90 rounded-full" />
                  
                  {/* Cuerpo del sobre temática La Bella Durmiente */}
                  <div className="relative w-full h-full bg-quince-envelope-body shadow-2xl rounded-b-lg border-4 border-quince-gold/60 overflow-hidden">
                    {/* Solapa Superior */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1/2 bg-quince-flap border-b-4 border-quince-gold/60 shadow-md rounded-t-lg flex justify-center items-center"
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
                      className="absolute inset-0 bg-quince-envelope-body/95 border-t-2 border-quince-gold/30" 
                      style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", zIndex: 15 }}
                    />
                    <div 
                      className="absolute inset-0 bg-quince-envelope-body/85" 
                      style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)", zIndex: 10 }}
                    />
                    <div 
                      className="absolute inset-0 bg-quince-envelope-body/85" 
                      style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)", zIndex: 10 }}
                    />
                  </div>
                </div>
              </motion.button>
            )}

            {isOpening && (
              <div className="relative w-full max-w-[450px] aspect-[4/3]">
                <div className="absolute inset-0 bg-black/20 blur-2xl transform translate-y-8 scale-90 rounded-full" />
                
                <div className="relative w-full h-full bg-quince-envelope-body shadow-2xl rounded-b-lg border-4 border-quince-gold/60 overflow-hidden">
                  <motion.div 
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: -160 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-quince-flap border-b-4 border-quince-gold/60 shadow-md rounded-t-lg"
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
                    onAnimationComplete={handleEnvelopeDone}
                    className="absolute inset-x-4 bottom-4 top-8 bg-white/95 shadow-inner p-4 flex flex-col items-center justify-center border-2 border-quince-gold rounded-t-lg"
                  >
                    <CrownIcon className="text-quince-rose mb-2 w-10 h-10 animate-pulse" />
                    <p className="font-['Alex_Brush'] text-2xl text-quince-rose">Valentina</p>
                    <p className="font-['Playfair_Display'] text-xs text-quince-rose/80 uppercase tracking-widest font-bold">15 Años</p>
                  </motion.div>

                  <div 
                    className="absolute inset-0 bg-quince-envelope-body/95 border-t-2 border-quince-gold/30" 
                    style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", zIndex: 15 }}
                  />
                  <div 
                    className="absolute inset-0 bg-quince-envelope-body/85" 
                    style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)", zIndex: 10 }}
                  />
                  <div 
                    className="absolute inset-0 bg-quince-envelope-body/85" 
                    style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)", zIndex: 10 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpened ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-hidden={!isOpened}
      >
        {/* --- Hero Section --- */}
        <section aria-label="Invitación" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center isolate overflow-hidden">
          {/* WatercolorBackground vive en la raíz y ya es position: fixed —
              renderizarlo también aquí duplicaba los blur() y las chispas. */}
          <HeroGlow />

          <motion.div
            className="relative max-w-4xl w-full z-[var(--z-content)] p-8 md:p-20 flex flex-col items-center justify-center min-h-[min(750px,90svh)] bg-quince-gold-bg/95 backdrop-blur-md shadow-[0_30px_70px_rgba(0,0,0,0.4)] border-x-4 border-quince-gold/40 rounded-3xl my-8"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(212,175,55,0.08) 0%, transparent 12%, transparent 88%, rgba(212,175,55,0.08) 100%)'
            }}
          >
            {/* Scroll Top Roll */}
            <div className="absolute -top-4 left-[-10px] right-[-10px] h-10 bg-quince-scroll rounded-full border-2 border-quince-gold/50 shadow-md z-20 flex items-center justify-between px-3">
              <div className="w-4 h-8 bg-black/20 rounded-full" />
              <div className="w-4 h-8 bg-black/20 rounded-full" />
            </div>

            {/* Scroll Bottom Roll */}
            <div className="absolute -bottom-4 left-[-10px] right-[-10px] h-10 bg-quince-scroll rounded-full border-2 border-quince-gold/50 shadow-md z-20 flex items-center justify-between px-3">
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
                 <div className="h-px w-12 md:w-20 bg-quince-deep/50" />
                 <motion.h2 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="font-['Playfair_Display'] italic text-3xl md:text-5xl text-quince-deep font-black tracking-wide drop-shadow-sm"
                 >
                   Valentina Montoya Henao 
                 </motion.h2>
                 <div className="h-px w-12 md:w-20 bg-quince-deep/50" />
              </div>


              <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-quince-rose/20 shadow-inner mb-6 text-center">
                <p className="font-['Playfair_Display'] italic text-lg md:text-xl text-quince-ink/90 leading-relaxed">
                  Quiero compartir contigo la magia de mis 15 años. 
                  <br /><br />
                  Tu presencia hará que este día sea aún más especial.
                  Hay momentos que se quedan para siempre en el corazón, y quiero vivir este junto a ti. Acompáñame a celebrar mis 15 años.
                </p>
              </div>

              <CountdownTimer />
            </div>
          </motion.div>
        </section>

        {/* --- Fairytale Photo Section --- */}
        <section id="foto-section" aria-label="Galería" className="py-20 relative overflow-hidden bg-white/10 backdrop-blur-[2px]">
          <div className="w-full">
            <div className="max-w-[95vw] md:max-w-3xl mx-auto px-2">
              <div className="relative aspect-[3/5] md:aspect-[4/5] w-full">
                <div className="absolute inset-0 bg-quince-blush/30 blur-[120px] rounded-full scale-110" />

                <div className="relative h-full w-full p-2 md:p-4">
                  <div className="relative h-full w-full card-photo-frame border-8 border-white shadow-2xl rounded-2xl overflow-hidden bg-quince-blush">
                    <PhotoCarousel />
                  </div>
                </div>

                <SparklingLight className="-top-10 -left-10 scale-[2] blur-[2px]" />
                <SparklingLight className="-bottom-20 left-1/4 scale-150 blur-[3px]" />
                <SparklingLight className="top-1/2 -right-16 scale-125 blur-[1px]" />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-14 text-center font-['Playfair_Display'] italic text-2xl text-quince-ink max-w-2xl mx-auto px-4 leading-relaxed"
            >
              "Gracias por formar parte de mi cuento de hadas."
            </motion.p>
          </div>
        </section>

        {/* --- Details Section --- */}
        <section aria-label="Detalles del evento" className="py-20 bg-white/30 backdrop-blur-md relative border-y border-quince-gold/20 overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
              {/* Fecha */}
              <div>
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center bg-white/20 p-6 rounded-3xl border border-white/40 shadow-lg h-full">
                  <div className="w-16 h-16 bg-quince-rose text-white rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/30">
                    <Calendar size={28} />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-quince-ink">Fecha</h3>
                  <p className="text-quince-deep uppercase tracking-widest text-xs font-bold">Sábado</p>
                  <p className="text-2xl font-bold text-quince-ink mt-1">10 de Octubre</p>
                </motion.div>
              </div>

              {/* Horarios */}
              <div>
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center bg-white/20 p-6 rounded-3xl border border-white/40 shadow-lg h-full">
                  <div className="w-16 h-16 bg-quince-gold text-quince-ink rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/30">
                    <Clock size={28} />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-quince-ink">Horario</h3>
                  <p className="text-quince-deep uppercase tracking-widest text-xs font-bold">Recepción & Fiesta</p>
                  <p className="text-2xl font-bold text-quince-ink mt-1">8:00 P.M. – 3:00 A.M.</p>
                  <div className="mt-3 bg-white/50 px-3 py-1.5 rounded-full border border-white/60 text-xs text-quince-ink font-bold inline-flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-quince-deep" />
                    <span>Puntualidad: 8:00 P.M.</span>
                  </div>
                </motion.div>
              </div>

              {/* Lugar */}
              <div className="sm:col-span-2 md:col-span-1">
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center bg-white/20 p-6 rounded-3xl border border-white/40 shadow-lg h-full">
                  <div className="w-16 h-16 bg-white text-quince-rose rounded-full flex items-center justify-center mb-4 shadow-xl border border-quince-rose/30">
                    <MapPin size={28} />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-quince-ink">Lugar</h3>
                  <p className="text-quince-deep uppercase tracking-widest text-xs font-bold">Finca Buganviles</p>
                  <p className="text-lg font-bold text-quince-ink mt-0.5">(Belén)</p>
                  <p className="text-sm text-quince-ink/90 mt-1">San Pedro, Vereda Belén</p>
                </motion.div>
              </div>
            </div>

            {/* Agendar: evita el clásico "¿a qué hora era?" días antes. */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={GOOGLE_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-quince-deep hover:bg-quince-ink text-white font-bold px-6 py-3 rounded-full shadow-lg transition-colors"
              >
                <CalendarPlus size={20} aria-hidden="true" />
                Agregar a Google Calendar
              </a>
              <button
                type="button"
                onClick={downloadIcs}
                className="inline-flex items-center gap-2 bg-white/70 hover:bg-white text-quince-ink font-bold px-6 py-3 rounded-full border border-white/70 shadow-lg transition-colors"
              >
                <Download size={20} aria-hidden="true" />
                Descargar invitación (.ics)
              </button>
            </div>
          </div>
        </section>

        {/* --- Location Map Section --- */}
        <section aria-label="Cómo llegar" className="py-20 bg-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-quince-rose/10 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-3">
            <div className="text-center mb-10">
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-3 text-quince-ink">¿Cómo llegar?</h2>
              <p className="text-quince-deep font-bold uppercase tracking-widest text-xs">
                Vereda belén, San Pedro Valle
              </p>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/80 h-[420px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1505.8780558614194!2d-76.21781538507233!3d4.00165777053762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sco!4v1787586560593!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                title="Ubicación Finca La Caleñita"
              ></iframe>
            </div>

            {/* El iframe no permite arrancar la navegación desde el móvil. */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-quince-deep hover:bg-quince-ink text-white font-bold px-6 py-3 rounded-full shadow-lg transition-colors"
              >
                <Navigation size={20} aria-hidden="true" />
                Abrir en Google Maps
              </a>
              <a
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/70 hover:bg-white text-quince-ink font-bold px-6 py-3 rounded-full border border-white/70 shadow-lg transition-colors"
              >
                <Navigation size={20} aria-hidden="true" />
                Abrir en Waze
              </a>
            </div>
          </div>
        </section>

        {/* --- Dress Code Section --- */}
        <section aria-label="Código de vestimenta" className="py-20 bg-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="relative z-10 mx-auto w-full max-w-6xl px-3 text-center">
            <div className="max-w-xl mx-auto p-10 md:p-12 rounded-[2.5rem] border-2 border-quince-gold/40 bg-quince-gold-bg/95 shadow-xl text-quince-ink">
              <div className="flex justify-center mb-3">
                <CrownIcon className="w-12 h-12 text-quince-rose" />
              </div>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4 text-quince-rose">Código de Vestimenta</h2>
              <p className="font-['Playfair_Display'] italic text-3xl font-bold text-quince-ink mb-4">
                Traje Formal
              </p>
              <div className="h-px w-28 bg-quince-rose/40 mx-auto mb-5" />
              <p className="text-sm md:text-base font-bold text-quince-rose/90 uppercase tracking-widest bg-quince-rose/10 py-3 px-6 rounded-xl inline-block border border-quince-rose/20">
                ✨ Vestimenta elegante para un cuento de ensueño ✨
              </p>
            </div>
          </div>
        </section>

        {/* --- RSVP & Envelope / Gifts Section --- */}
        <section aria-label="Contamos con tu asitencia" className="py-20 relative overflow-hidden text-center isolate">
          <div className="absolute inset-0 bg-quince-cream/70 backdrop-blur-[2px]" />
          
          <div className="relative z-10 mx-auto w-full max-w-6xl px-3">
            {/* Lluvia de Sobres / Gifts Notice */}
            <div className="mb-14 pb-12 border-b border-quince-deep/20 text-quince-ink flex flex-col items-center">
              <Gift className="mb-3 text-quince-deep animate-bounce" size={44} />
              <p className="uppercase tracking-[0.4em] text-xs opacity-80 mb-2 font-bold">Lluvia de Sobres</p>
              <p className="font-['Playfair_Display'] italic text-3xl md:text-4xl">"Tu presencia es nuestro mejor regalo"</p>
            </div>

            <h2 className="font-['Alex_Brush'] text-7xl md:text-8xl mb-4 text-quince-deep drop-shadow-lg">Contamos con tu Asistencia</h2>

            
            
            {/*
        
            //RSVP Form Component// 
            <RSVPForm />

             //Direct Contact //
            <div className="mt-10 flex flex-col items-center">
              <p className="text-quince-ink/90 text-sm mb-3 italic">
                ¿Tienes alguna inquietud o consulta sobre el evento? Comunícate con:
              </p>
              <a
                href={`https://wa.me/${RSVP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white font-bold text-lg bg-quince-deep hover:bg-quince-ink transition-colors px-7 py-3.5 rounded-full border border-white/40 shadow-lg"
              >
                <Phone size={22} />
                <span>WhatsApp: {RSVP_CONTACT_NAME} (318 734 4947)</span>
              </a>
            </div>
            */}

          </div>
        </section>
        

        <MusicPlayer />

        {/* --- Footer --- */}
        <footer className="py-10 text-center text-quince-ink/70 text-xs uppercase tracking-[0.4em] font-bold">
          © 2026 15 Años de Valentina Montoya Henao  • La Bella Durmiente By Stiveen13
        </footer>
      </motion.main>
    </div>
  );
}
