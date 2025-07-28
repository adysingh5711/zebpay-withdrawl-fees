'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './../lib/utils';
const themes = [
    {
        key: 'system',
        icon: Monitor,
        label: 'System theme',
    },
    {
        key: 'light',
        icon: Sun,
        label: 'Light theme',
    },
    {
        key: 'dark',
        icon: Moon,
        label: 'Dark theme',
    },
];

export type ThemeSwitcherProps = {
    className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative isolate flex h-8 rounded-full bg-background/80 backdrop-blur-sm p-1 ring-1 ring-border shadow-sm',
                // Enhanced styling
                '[&_*]:border-border',
                className
            )}
            style={{
                fontFeatureSettings: '"rlig" 1, "calt" 1',
            }}
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = theme === key;

                return (
                    <button
                        aria-label={label}
                        className={cn(
                            'relative h-6 w-6 rounded-full transition-colors hover:bg-muted/50',
                            // Enhanced focus states
                            'focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))] focus-visible:outline-offset-2'
                        )}
                        key={key}
                        onClick={() => setTheme(key)}
                        type="button"
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-primary/90 shadow-lg ring-2 ring-primary/20 backdrop-blur-sm"
                                layoutId="activeTheme"
                                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                                style={{
                                    // High contrast shadow for better visibility
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06), inset 0 1px 0 0 rgb(255 255 255 / 0.1)',
                                }}
                            />
                        )}
                        <Icon
                            className={cn(
                                'relative z-10 m-auto h-4 w-4 transition-colors',
                                isActive ? 'text-foreground' : 'text-muted-foreground'
                            )}
                        />
                    </button>
                );
            })}

            {/* Custom scrollbar styles for any overflow (if needed) */}
            <style jsx>{`
                .theme-switcher-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .theme-switcher-container::-webkit-scrollbar-track {
                    background: hsl(var(--muted));
                    border-radius: 4px;
                }
                .theme-switcher-container::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground) / 0.3);
                    border-radius: 4px;
                }
                .theme-switcher-container::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--muted-foreground) / 0.5);
                }
            `}</style>
        </div>
    );
};