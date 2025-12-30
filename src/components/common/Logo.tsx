import React from "react";

interface LogoProps {
    variant?: "full" | "icon";
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "full", className = "" }) => {
    if (variant === "icon") {
        return (
            <div className={`${className}`}>
                <span
                    className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-500"
                    style={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.05em'
                    }}
                >
                    L
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Main Logo Text */}
            <div className="flex items-baseline gap-0.5">
                <span
                    className="text-2xl font-black text-gray-900 dark:text-white"
                    style={{
                        letterSpacing: '-0.03em',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                >
                    Loyalty
                </span>
                <span
                    className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                    style={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.03em',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                >
                    Pro
                </span>
            </div>

            {/* Subtitle with decorative line */}
            <div className="flex items-center gap-1.5 -mt-1">
                <div className="h-[2px] w-5 bg-gradient-to-r from-indigo-600 to-transparent dark:from-indigo-400 rounded-full"></div>
                <span
                    className="text-[9px] font-semibold uppercase text-gray-500 dark:text-gray-400"
                    style={{
                        letterSpacing: '0.15em',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                >
                    Reward System
                </span>
            </div>
        </div>
    );
};

export default Logo;
