'use client';
import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const difference = +targetDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const updateTimeLeft = () => {
      setTimeLeft(calculateTimeLeft());
    };
    
    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && 
                    timeLeft.minutes === 0 && timeLeft.seconds === 0;

if(isExpired) return null;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Dias</div>
      </div>
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Horas</div>
      </div>
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Min</div>
      </div>
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-1">Seg</div>
      </div>
    </div>
  );
};

