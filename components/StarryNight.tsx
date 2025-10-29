import React, { useEffect, useRef } from 'react';

const StarryNight: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let stars: { x: number; y: number; radius: number; }[] = [];
        const numStars = 200;

        const setCanvasDimensions = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 0.8 + 0.2,
                });
            }
        };

        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);

        let animationFrameId: number;
        let isVisible = true;

        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
            if (isVisible) {
                draw();
            } else {
                window.cancelAnimationFrame(animationFrameId);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const draw = () => {
            if (!ctx || !isVisible) return;
            
            ctx.clearRect(0, 0, width, height);
            
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
                ctx.fill();
            });

            animationFrameId = window.requestAnimationFrame(draw);
        }

        draw();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setCanvasDimensions);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }

    }, []);


    return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 opacity-30 dark:opacity-20 transition-opacity" />;
};

export default StarryNight;
