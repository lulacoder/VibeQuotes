"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Lightbulb,
    Smile,
    Flame,
    CloudSun,
    Mountain,
    Sparkles,
    BookOpen
} from "lucide-react";

interface MoodSelectorProps {
    selectedMood: string | null;
    onMoodSelect: (mood: string) => void;
}

const moods = [
    {
        name: "Inspired",
        tag: "inspirational",
        icon: Lightbulb,
        gradient: "from-amber-400 to-orange-500",
        bgGradient: "from-amber-500/10 to-orange-500/10"
    },
    {
        name: "Happy",
        tag: "happiness",
        icon: Smile,
        gradient: "from-yellow-400 to-amber-500",
        bgGradient: "from-yellow-500/10 to-amber-500/10"
    },
    {
        name: "Motivated",
        tag: "motivational",
        icon: Flame,
        gradient: "from-red-500 to-orange-500",
        bgGradient: "from-red-500/10 to-orange-500/10"
    },
    {
        name: "Calm",
        tag: "life",
        icon: CloudSun,
        gradient: "from-cyan-400 to-blue-500",
        bgGradient: "from-cyan-500/10 to-blue-500/10"
    },
    {
        name: "Love",
        tag: "love",
        icon: Heart,
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-500/10 to-rose-500/10"
    },
    {
        name: "Wise",
        tag: "wisdom",
        icon: BookOpen,
        gradient: "from-purple-500 to-indigo-500",
        bgGradient: "from-purple-500/10 to-indigo-500/10"
    },
    {
        name: "Success",
        tag: "success",
        icon: Mountain,
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
        name: "Random",
        tag: "",
        icon: Sparkles,
        gradient: "from-primary-500 to-accent-500",
        bgGradient: "from-primary-500/10 to-accent-500/10"
    },
];

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    What mood are you in?
                </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {moods.map((mood, index) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMood === mood.name || (selectedMood === null && mood.tag === "");

                    return (
                        <motion.button
                            key={mood.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onMoodSelect(mood.tag ? mood.name : "")}
                            className={`relative group flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${isSelected
                                    ? `bg-gradient-to-br ${mood.bgGradient} border-2 border-transparent shadow-lg`
                                    : "glass-subtle hover:shadow-md"
                                }`}
                            style={{
                                borderImage: isSelected
                                    ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to)) 1`
                                    : undefined
                            }}
                        >
                            {/* Icon container */}
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${mood.gradient} shadow-lg transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-105"
                                }`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>

                            {/* Label */}
                            <span className={`text-sm font-medium transition-colors ${isSelected
                                    ? "text-gray-900 dark:text-gray-100"
                                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                                }`}>
                                {mood.name}
                            </span>

                            {/* Selected indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${mood.gradient} flex items-center justify-center shadow-lg`}
                                >
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}

                            {/* Glow effect on hover */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
