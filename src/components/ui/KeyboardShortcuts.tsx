"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, RefreshCw, Search, Heart, Sun, Moon } from "lucide-react";

interface ShortcutItem {
    keys: string[];
    description: string;
    icon: React.ElementType;
}

const shortcuts: ShortcutItem[] = [
    { keys: ["R"], description: "Get a new random quote", icon: RefreshCw },
    { keys: ["/"], description: "Focus search bar", icon: Search },
    { keys: ["Esc"], description: "Close dialogs / unfocus", icon: X },
    { keys: ["?"], description: "Toggle this shortcuts panel", icon: Keyboard },
];

export function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // "?" key to toggle shortcuts panel
            if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }

            // Escape to close
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
                    >
                        <div className="glass-card rounded-3xl p-6 shadow-2xl mx-4">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                                        <Keyboard className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Keyboard Shortcuts
                                    </h2>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl glass-subtle text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Shortcuts List */}
                            <div className="space-y-3">
                                {shortcuts.map((shortcut, index) => {
                                    const Icon = shortcut.icon;
                                    return (
                                        <motion.div
                                            key={shortcut.description}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50"
                                        >
                                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex gap-1">
                                                {shortcut.keys.map((key) => (
                                                    <kbd key={key} className="min-w-[2rem] text-center">
                                                        {key}
                                                    </kbd>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Footer tip */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 text-xs text-center text-gray-400 dark:text-gray-500"
                            >
                                Press <kbd>?</kbd> anytime to toggle this panel
                            </motion.p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
