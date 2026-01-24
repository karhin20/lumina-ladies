import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
    targetDate: string | Date;
    className?: string;
    showLabels?: boolean;
}

const CountdownTimer = ({ targetDate, className, showLabels = true }: CountdownTimerProps) => {
    const calculateTimeLeft = () => {
        const difference = new Date(targetDate).getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className={cn("flex items-center gap-4", className)}>
            <TimeUnit label="Days" value={timeLeft.days} showLabel={showLabels} />
            <Separator />
            <TimeUnit label="Hours" value={timeLeft.hours} showLabel={showLabels} />
            <Separator />
            <TimeUnit label="Minutes" value={timeLeft.minutes} showLabel={showLabels} />
            <Separator />
            <TimeUnit label="Seconds" value={timeLeft.seconds} showLabel={showLabels} />
        </div>
    );
};

const TimeUnit = ({ label, value, showLabel }: { label: string; value: number; showLabel: boolean }) => (
    <div className="text-center">
        {showLabel && <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>}
        <p className="text-2xl md:text-3xl font-bold font-display">{String(value).padStart(2, "0")}</p>
    </div>
);

const Separator = () => (
    <span className="text-accent text-2xl font-bold pb-2">:</span>
);

export default CountdownTimer;
