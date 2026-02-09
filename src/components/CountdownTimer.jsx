import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex gap-4 md:gap-6 justify-center">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="glass-card glow-border p-4 md:p-6 min-w-[70px] md:min-w-[100px]">
            <motion.span
              key={unit.value}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-5xl font-display font-bold text-primary block text-center"
            >
              {unit.value.toString().padStart(2, '0')}
            </motion.span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
