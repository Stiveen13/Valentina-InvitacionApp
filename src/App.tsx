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
const MUSIC_URL = 'https://lh3.googleusercontent.com/d/1aDRgTgniHW6ePa8YjASHJeE8HMAegEBn'; // Elegant placeholder

// --- Components ---

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
    <div className="flex flex-col items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 min-w-[70px]">
      <span className="text-3xl font-bold text-black">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center mt-8">
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
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} type="audio/mpeg" />
      </audio>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors duration-300 ${
          isPlaying ? 'bg-black text-white' : 'bg-white text-black border border-black/10'
        }`}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center"
          >
            <Music size={10} className="text-white" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    // Iniciar la secuencia de apertura automáticamente
    const timer = setTimeout(() => {
      setIsOpened(true);
    }, 3500); // Tiempo total para ver el sobre y su apertura
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-['Montserrat'] overflow-x-hidden">
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="envelope-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-[#FDFCFB] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-[350px] aspect-[4/3]">
              {/* Sombra del sobre */}
              <div className="absolute inset-0 bg-black/5 blur-2xl transform translate-y-8 scale-90 rounded-full" />
              
              {/* Cuerpo del sobre */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-full h-full bg-[#f4f1ea] shadow-xl rounded-b-lg border border-gray-200 overflow-hidden"
              >
                {/* Solapa Superior */}
                <motion.div 
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -160 }}
                  transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-[#e8e4d8] border-b border-gray-300 shadow-sm rounded-t-lg"
                  style={{ 
                    transformOrigin: "top", 
                    zIndex: 20,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)" 
                  }}
                />

                {/* Contenido de la carta asomándose */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: -40 }}
                  transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
                  className="absolute inset-x-4 bottom-4 top-8 bg-white shadow-inner p-4 flex flex-col items-center justify-center border border-gray-100"
                >
                  <Heart className="text-black/20 mb-2" size={20} />
                  <div className="h-1 w-12 bg-gray-100 rounded-full mb-1" />
                  <div className="h-1 w-8 bg-gray-100 rounded-full" />
                </motion.div>

                {/* Lados del sobre (frente) */}
                <div 
                  className="absolute inset-0 bg-[#f4f1ea]" 
                  style={{ clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)", zIndex: 10 }}
                />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-12 left-0 w-full text-center text-gray-400 uppercase tracking-[0.3em] text-xs"
              >
                Una invitación especial...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpened ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl w-full"
        >
          <span className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-4 block font-semibold">
            Te invitamos a celebrar
          </span>
          <h1 className="font-['Alex_Brush'] text-7xl md:text-9xl text-black mb-2">
            Mis 15 Años
          </h1>
          <h2 className="font-['Playfair_Display'] italic text-2xl md:text-3xl text-gray-700 mb-8">
            Xiomara Vásquez Osorio
          </h2>

          <div className="relative mx-auto w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-8 border-white mb-10 bg-white">
             <img 
              src="https://lh3.googleusercontent.com/d/1-1YdHVJNWazxUTovGavpE1wc0i68SIIU" 
              alt="Invitación Xiomara"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-8">
               <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white"
               >
                 <ChevronDown size={32} />
               </motion.div>
            </div>
          </div>

          <p className="font-['Playfair_Display'] italic text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            "Te invito a celebrar conmigo mi cuento de fantasía. En una noche llena de luz y encanto."
          </p>

          <CountdownTimer />
        </motion.div>
      </section>

      {/* --- Details Section --- */}
      <section className="py-24 bg-white border-y border-gray-100">
        <Container>
          <Row className="text-center g-5">
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Calendar size={28} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">Fecha</h3>
                <p className="text-gray-500 uppercase tracking-widest text-sm">Sábado</p>
                <p className="text-2xl font-semibold">23 de Mayo, 2026</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Clock size={28} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">Hora</h3>
                <p className="text-gray-500 uppercase tracking-widest text-sm">Recepción</p>
                <p className="text-2xl font-semibold">8:30 P.M.</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MapPin size={28} />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">Lugar</h3>
                <p className="text-gray-500 uppercase tracking-widest text-sm">Villa Luna</p>
                <p className="text-lg font-semibold">Via Nariño (Gira por el CAI)</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- Photo Gallery --- */}
      <section className="py-24 bg-[#FDFCFB]">
        <div className="text-center mb-16">
          <Heart className="mx-auto text-black mb-4" size={32} />
          <h2 className="font-['Alex_Brush'] text-6xl text-black">Momentos Especiales</h2>
        </div>
        
        <div className="max-w-4xl mx-auto px-4">
          <Carousel fade className="shadow-2xl rounded-3xl overflow-hidden border-[12px] border-white">
            <Carousel.Item>
              <img
                className="d-block w-full h-[600px] object-cover"
                src="https://lh3.googleusercontent.com/d/152Zmkwq1suhYuzi81us6SO5j_Sy6vYmB"
                alt="First slide"
                referrerPolicy="no-referrer"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-full h-[600px] object-cover"
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
                alt="Second slide"
                referrerPolicy="no-referrer"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-full h-[600px] object-cover"
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
                alt="Third slide"
                referrerPolicy="no-referrer"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-full h-[600px] object-cover"
                src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1974&auto=format&fit=crop"
                alt="Fourth slide"
                referrerPolicy="no-referrer"
              />
            </Carousel.Item>
          </Carousel>
        </div>
      </section>

      {/* --- Map Section --- */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-4">¿Cómo llegar?</h2>
            <p className="text-gray-500">Te esperamos en Villa Luna para celebrar juntos.</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-[450px]">
            <iframe 
              src="https://maps.google.com/maps?q=4.088302,-76.230003&z=17&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Ubicación del evento"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Container>
      </section>

      {/* --- RSVP Section --- */}
      <section className="py-24 bg-black text-white text-center relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-64 h-64 border border-white/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-80 h-80 border border-white/10 rounded-full"
        />

        <Container className="relative z-10">
          <Gift className="mx-auto mb-6 text-white/50" size={48} />
          <h2 className="font-['Alex_Brush'] text-7xl mb-6">Confirmar Asistencia</h2>
          <p className="font-['Playfair_Display'] italic text-xl mb-10 text-gray-400">
            Tu presencia es nuestro mejor regalo.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button 
              variant="light" 
              size="lg" 
              className="px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
              onClick={() => window.open(RSVP_LINK, '_blank')}
            >
              Confirmar en Formulario
            </Button>
            
            <a 
              href={`https://wa.me/${RSVP_PHONE}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Phone size={20} />
              <span>WhatsApp: {RSVP_PHONE}</span>
            </a>
          </div>

          <div className="mt-16 pt-16 border-t border-white/10">
            <p className="uppercase tracking-[0.4em] text-xs text-gray-500 mb-2">Lluvia de Sobres</p>
            <p className="font-['Playfair_Display'] italic text-2xl">¡Te esperamos!</p>
          </div>
        </Container>
      </section>

      <MusicPlayer />

      {/* --- Footer --- */}
      <footer className="py-8 text-center text-gray-400 text-xs uppercase tracking-widest bg-[#FDFCFB]">
        © 2026 Stiveen13 • Invitaciones 
      </footer>
    </motion.div>
    </div>
  );
}
