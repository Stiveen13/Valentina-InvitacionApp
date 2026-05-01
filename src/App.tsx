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
  Gift
} from 'lucide-react';

// --- Constants ---
const EVENT_DATE = new Date('2026-05-23T20:30:00');
const RSVP_PHONE = '3205708928';
const RSVP_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSc7GEz6xJi9aflSejTHxACtdCNa9JxXE9gQSs4wGoJPI7iwUg/viewform?usp=header';
const MUSIC_URL = 'https://www.googleapis.com/drive/v3/files/19jkS86eJQggcaqPbNdSptFVcj3-4AB81/?alt=media&key=AIzaSyANTOMhIHUFCjz1OWcz0oDa4Yah5WWMYvE'; // Chayanne & Danna Paola - Veo en ti la luz

// --- Components ---

const FlowerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <circle cx="50" cy="50" r="12" />
    {[...Array(8)].map((_, i) => (
      <path
        key={i}
        d="M50 38 Q65 15 80 38 T50 62 T20 38 T50 14"
        transform={`rotate(${i * 45} 50 50)`}
        style={{ transformOrigin: '50% 50%' }}
        className="opacity-40"
      />
    ))}
    <circle cx="50" cy="50" r="5" className="fill-white/20" />
  </svg>
);

const WatercolorBackground = () => (
  <div className="quince-bg pointer-events-none">
    <div className="brush-stroke w-[600px] h-[600px] bg-quince-rose -top-20 -left-20" />
    <div className="brush-stroke w-[500px] h-[500px] bg-quince-blush top-1/4 -right-10" />
    <div className="brush-stroke w-[700px] h-[700px] bg-quince-cream -bottom-20 left-10" />
    <div className="brush-stroke w-[400px] h-[400px] bg-quince-rose bottom-1/4 right-1/4" />
    
    {[...Array(20)].map((_, i) => (
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
    className={`absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_30px_rgba(212,175,55,0.4)] blur-[1px] ${className}`}
  />
);

const MagicDust = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(40)].map((_, i) => (
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
          opacity: [0, 0.7, 0.2, 0.7, 0],
          scale: [0.5, 1.5, 0.5, 1.5, 0.5]
        }}
        transition={{ 
          duration: 15 + Math.random() * 25, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white,0_0_12px_rgba(212,175,55,0.3)]"
      />
    ))}
  </div>
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = EVENT_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center px-3 py-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-md min-w-[70px]">
      <span className="text-3xl font-bold text-quince-gold">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-quince-gold/60 font-bold">{label}</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6 }}
      className="paper-note mx-auto max-w-sm mt-8 relative z-10"
    >
      <div className="flex gap-3 justify-center">
        <TimeUnit value={timeLeft.days} label="Días" />
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Seg" />
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-quince-gold/40">Faltan para el gran día</p>
    </motion.div>
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

  // Autoplay when the invitation is opened (requires user interaction with the envelope first)
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

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      // Dispatch custom event to trigger music
      window.dispatchEvent(new Event('invitationOpened'));
    }, 2500);
  };

  return (
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
      
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="envelope-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-quince-cream flex flex-col items-center justify-center p-4"
          >
            <WatercolorBackground />
            
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
                  className="mb-8 text-quince-gold font-['Playfair_Display'] italic text-2xl tracking-[0.2em]"
                >
                  Toca para abrir
                </motion.div>

                <div className="relative w-full max-w-[350px] aspect-[4/3]">
                  {/* Sombra del sobre */}
                  <div className="absolute inset-0 bg-quince-gold/10 blur-2xl transform translate-y-8 scale-90 rounded-full" />
                  
                  {/* Cuerpo del sobre */}
                  <div className="relative w-full h-full bg-white shadow-2xl rounded-b-lg border border-quince-rose overflow-hidden">
                    {/* Solapa Superior */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1/2 bg-quince-cream border-b border-quince-gold/10 shadow-sm rounded-t-lg"
                      style={{ 
                        transformOrigin: "top", 
                        zIndex: 20,
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)" 
                      }}
                    />
                    {/* Lados del sobre (frente) */}
                    <div 
                      className="absolute inset-0 bg-[#fefefe]" 
                      style={{ clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)", zIndex: 10 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {isOpening && (
              <div className="relative w-full max-w-[350px] aspect-[4/3]">
                {/* Sombra del sobre */}
                <div className="absolute inset-0 bg-quince-gold/10 blur-2xl transform translate-y-8 scale-90 rounded-full" />
                
                {/* Cuerpo del sobre */}
                <div className="relative w-full h-full bg-white shadow-2xl rounded-b-lg border border-quince-rose overflow-hidden">
                  {/* Solapa Superior */}
                  <motion.div 
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: -160 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-quince-cream border-b border-quince-gold/10 shadow-sm rounded-t-lg"
                    style={{ 
                      transformOrigin: "top", 
                      zIndex: 20,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)" 
                    }}
                  />

                  {/* Contenido de la carta asomándose */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -60 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-x-4 bottom-4 top-8 bg-white shadow-inner p-4 flex flex-col items-center justify-center border border-quince-gold/10"
                  >
                    <FlowerIcon className="text-quince-gold mb-2 w-10 h-10 animate-pulse" />
                    <div className="h-1 w-12 bg-quince-rose rounded-full mb-1" />
                    <div className="h-1 w-8 bg-quince-rose rounded-full" />
                  </motion.div>

                  {/* Lados del sobre (frente) */}
                  <div 
                    className="absolute inset-0 bg-[#fefefe]" 
                    style={{ clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)", zIndex: 10 }}
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
        transition={{ duration: 1 }}
      >
        {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center isolate overflow-hidden">
        <WatercolorBackground />
        
        {/* Luces/Flares as in the image background */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-32 h-32 rounded-full bg-quince-gold-light/10 blur-3xl pointer-events-none"
            style={{ 
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative max-w-4xl w-full z-10 p-12 md:p-20 flex flex-col items-center justify-center min-h-[600px]"
        >
          <div className="max-w-2xl w-full">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-['Alex_Brush'] text-5xl md:text-6xl text-quince-text mb-2 drop-shadow-sm"
            >
              Mis
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-['Alex_Brush'] text-7xl md:text-9xl text-quince-gold mb-6 drop-shadow-sm leading-tight"
            >
              Quince Años
            </motion.h1>

            <div className="flex items-center justify-center gap-4 mb-4">
               <div className="h-px w-16 bg-quince-gold-light" />
               <motion.h2 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.2 }}
                 className="font-['Playfair_Display'] italic text-3xl md:text-5xl text-quince-text tracking-wide"
               >
                 Xiomara Vásquez Osorio
               </motion.h2>
               <div className="h-px w-16 bg-quince-gold-light" />
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="font-['Playfair_Display'] italic text-xl md:text-2xl text-quince-text/70 mt-6 mb-8 max-w-lg mx-auto leading-relaxed"
            >
              "El 24 de mayo de 2011 nació una niña llamada Xiomara, esperada con anhelo y amor por sus padres, familia y amigos. Hoy, quince años después, te invitamos a celebrar con el mismo amor este momento tan especial.  Te espero para compartir juntos mi cuento de fantasía, en una noche llena de luz, magia y encanto. "
            </motion.p>

            <CountdownTimer />
          </div>
        </motion.div>
      </section>

      {/* 
          =========================================
          --- BRUSHSTROKE PHOTO CAROUSEL SECTION ---
          =========================================
          This is the vertical photo container section 
          requested to be enlarged for phone invitations.
      */}
      <section id="carousel-section" className="py-24 relative overflow-hidden bg-white/10 backdrop-blur-[2px]">
        <Container fluid className="px-0">
          <div className="max-w-[95vw] md:max-w-3xl mx-auto px-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[3/5] md:aspect-[4/5] w-full"
            >
              {/* Artistic Background Glow */}
              <div className="absolute inset-0 bg-quince-blush/30 blur-[120px] rounded-full scale-110" />
              
              {/* Single Large Frame with Elegant Card Style */}
              <div className="relative h-full w-full p-2 md:p-4">
                <div className="relative h-full w-full card-photo-frame">
                  <Carousel fade indicators={false} controls={true} className="h-full">
                  {[             
                    "https://lh3.googleusercontent.com/d/1hmFTCot3RiPIudaozBv9HG8W-JUR_DYQ"
                    
                  ].map((src, idx) => (
                    <Carousel.Item key={idx} className="h-full bg-[#3e1212]">
                      <img 
                        src={src} 
                        alt={`Mili ${idx + 1}`}
                        className="w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                        style={{ filter: "contrast(1.1) saturate(1.2)" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>

            {/* Decorative elements around the "painting" */}
            <SparklingLight className="-top-10 -left-10 scale-[2] blur-[2px]" />
            <SparklingLight className="-bottom-20 left-1/4 scale-150 blur-[3px]" />
            <SparklingLight className="top-1/2 -right-16 scale-125 blur-[1px]" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 text-quince-gold opacity-60 animate-pulse">
                <FlowerIcon className="w-full h-full" />
              </div>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 text-center font-['Playfair_Display'] italic text-2xl text-quince-text/80 max-w-2xl mx-auto px-4 leading-relaxed"
          >
            " Gracias por ser parte de mi cuento."
          </motion.p>
        </Container>
      </section>

      {/* --- Details Section --- */}
      <section className="py-24 bg-white/40 backdrop-blur-sm relative border-y border-quince-gold/10 overflow-hidden">
        <FlowerIcon className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 text-quince-gold/10 opacity-30" />
        <Container>
          <Row className="text-center g-5">
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-quince-rose text-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <Calendar size={28} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-quince-text">Fecha</h3>
                <p className="text-quince-gold uppercase tracking-widest text-sm font-bold">Sábado</p>
                <p className="text-2xl font-bold text-quince-text">23 de Mayo, 2026</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-quince-gold text-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <Clock size={28} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-quince-text">Hora</h3>
                <p className="text-quince-gold uppercase tracking-widest text-sm font-bold">Recepción</p>
                <p className="text-2xl font-bold text-quince-text">8:30 P.M.</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-quince-cream text-quince-gold rounded-full flex items-center justify-center mb-4 shadow-xl border border-quince-gold/20">
                  <MapPin size={28} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 text-quince-text">Lugar</h3>
                <p className="text-quince-gold uppercase tracking-widest text-sm font-bold">Villa Luna</p>
                <p className="text-lg font-bold text-quince-text">Via Nariño (Gira por el CAI)</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      
     

      {/* --- Map Section --- */}
      <section className="py-24 bg-white/20 backdrop-blur-sm relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-quince-rose/10 to-transparent" />
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4 text-quince-text">¿Cómo llegar?</h2>
            <p className="text-quince-gold font-bold uppercase tracking-widest text-xs">Te esperamos en Villa Luna para celebrar juntos.</p>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-[450px]">
            <iframe
               src="https://www.google.com/maps?q=4.084644909258949,-76.23115512016295&hl=es&z=17&output=embed"
               width="100%"
               height="100%"
               style={{ border: 0 }}
               loading="lazy"
               allowFullScreen
            ></iframe>
          </div>
        </Container>
      </section>

      {/* --- RSVP Section --- */}
      <section className="py-24 relative overflow-hidden text-center isolate">
         <div className="absolute inset-0 bg-quince-cream/80 backdrop-blur-[2px]" />
        <FlowerIcon className="absolute -top-20 -right-20 w-80 h-80 text-quince-gold-light/10 animate-spin-slow opacity-20" />
        <FlowerIcon className="absolute -bottom-20 -left-20 w-96 h-96 text-quince-gold/10 animate-spin-slow-reverse opacity-20" />

        <Container className="relative z-10">
          <Gift className="mx-auto mb-6 text-quince-gold animate-bounce" size={48} />
          <h2 className="font-['Alex_Brush'] text-8xl mb-6 text-quince-gold">Asistencia</h2>
          <p className="font-['Playfair_Display'] italic text-2xl mb-10 text-quince-text/70">
            Tu presencia es nuestro mejor regalo.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Button 
               variant="light" 
               size="lg" 
              className="px-12 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-sm bg-gradient-to-r from-pink-400 to-rose-500 text-white border-none shadow-2xl hover:scale-110 active:scale-95 transition-all"
               onClick={() => window.open(RSVP_LINK, '_blank')}
              >
               Confirmar Formulario
            </Button>
            
            <a 
              href={`https://wa.me/${RSVP_PHONE}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-quince-text font-bold hover:text-quince-gold transition-colors text-lg"
            >
              <Phone size={24} className="text-quince-gold" />
              <span>WhatsApp: {RSVP_PHONE}</span>
            </a>
          </div>

          <div className="mt-16 pt-16 border-t border-quince-gold/10 text-quince-text">
            <p className="uppercase tracking-[0.4em] text-xs opacity-50 mb-2 font-bold">Lluvia de Sobres</p>
            <p className="font-['Playfair_Display'] italic text-3xl">¡Te esperamos!</p>
          </div>
        </Container>
      </section>

      <MusicPlayer />

      {/* --- Footer --- */}
      <footer className="py-12 text-center text-quince-text/30 text-xs uppercase tracking-[0.5em] font-bold">
        © 2026 Stiveen13 • Invitaciones de Ensueño
      </footer>
    </motion.div>
    </div>
  );
}
