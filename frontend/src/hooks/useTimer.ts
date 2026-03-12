/**
 * @file useTimer.ts
 * @description A custom React hook for managing a timer. It provides functionalities to start, stop, resume, and reset the timer, as well as tracking the elapsed time in hours, minutes, and seconds.
 * @author sovath
 * @version 1.0
 * @date 2026-03-12
 * 
 * @param {boolean} initialRunning [initialRunning = false] - Optional parameter to set the initial running state of the timer.
 * @return {object} An object containing the current time, running state, and functions to control the timer.
 * 
 * @property {timeFormat} currentTime - The current time of the timer in hours, minutes, and seconds.({ hour: number, minute: number, second: number })
 * @property {boolean} isRunning - A boolean indicating whether the timer is currently running.
 * @property {function} startTimer - A function to start the timer, it also resets the timer back to zero.
 * @property {function} stopTimer - A function to stop the timer, it pauses the timer.
 * @property {function} resumeTimer - A function to resume the timer, resume the timer after pause.
 * @property {function} resetTimer - A function to reset the timer, also stop the timer.
 * 
 * @example
 * If you wish to start the timer immediately when the component mounts, you can call the hook with `true` as an argument:
 * const { currentTime, isRunning, startTimer, stopTimer, resumeTimer, resetTimer } = useTimer(true);
 * 
 * * If you want to start the timer based on a user action, you can call the hook without arguments and use the `startTimer` function to start it when needed:
 * function handleStart(){
 *   startTimer();
 * }
 * 
 * // This to stop the timer then resume after some code execution
 * function handleStop(){
 *   stopTimer();
 *   //Execute some code
 *    resumeTimer();
 * }
 * 
 * * //User can reset a timer after call the reset function, the timer will be reset to zero and stop.
 * function handleReset(){
 *   resetTimer();
 * }
 */


import { useState, useEffect } from 'react';

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