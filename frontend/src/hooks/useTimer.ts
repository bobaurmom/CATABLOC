import { useState, useEffect, useRef } from 'react';

export type timeFormat = {
  hour: number,
  minute: number,
  second: number
}


interface TimeState {
    currentTime: timeFormat,
    isRunning: boolean,
    startTime: number | null,
}

const useTimer = (initialRunning: boolean = false) => {
    const [currentTime, setCurrentTime] = useState<TimeState>({
        currentTime: { hour: 0, minute: 0, second: 0 },
        isRunning: initialRunning,
        startTime: initialRunning ? Date.now() : null
    });

    useEffect(() => {
        if (!currentTime.isRunning) return;
        const timer = setInterval(() => {
            if(!currentTime.startTime) return;
            const elapsedTime = Date.now() - currentTime.startTime;
            const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
            const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
            setCurrentTime(prev => ({
                ...prev,
                currentTime: { hour: hours, minute: minutes, second: seconds }
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTime.isRunning, currentTime.startTime]);

    const calculateElapsedTime = (currentTime: timeFormat):number => {
        const { hour, minute, second } = currentTime;
        return (hour * 3600 + minute * 60 + second) * 1000;
    };

    const startTimer = () => {
        if (!currentTime.isRunning) {
            setCurrentTime({
                ...currentTime,
                isRunning: true,
                startTime: Date.now()
            });
        }
    };

    const stopTimer = () => {
        if (currentTime.isRunning) {
            setCurrentTime({
                ...currentTime,
                isRunning: false
            });
        }
    };

    const resumeTimer = () => {
        if (!currentTime.isRunning && currentTime.startTime) {
            setCurrentTime({
                ...currentTime,
                isRunning: true,
                startTime: Date.now() - calculateElapsedTime(currentTime.currentTime)
            });
        }
    };


    const resetTimer = () => {
        setCurrentTime({
            currentTime: { hour: 0, minute: 0, second: 0 },
            isRunning: false,
            startTime: null
        });
    };

    return { currentTime: currentTime.currentTime, isRunning: currentTime.isRunning, startTimer, stopTimer, resumeTimer, resetTimer };
}

export { useTimer };