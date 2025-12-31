"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Tag, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { useQuotes } from "@/context/QuotesContext";

export function StatsCard() {
    const { getLikedQuotes, likedCount } = useQuotes();

    const likedQuotes = getLikedQuotes();

    // Calculate stats
    const uniqueAuthors = new Set(likedQuotes.map(r => r.quoteSnapshot.author)).size;
    const allTags = likedQuotes.flatMap(r => r.quoteSnapshot.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const favoriteTag = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "None yet";

    const stats = [
        {
            label: "Favorites",
            value: likedCount,
            icon: Heart,
            gradient: "from-tertiary-500 to-pink-500",
            bgGradient: "from-tertiary-500/10 to-pink-500/10",
        },
        {
            label: "Authors",
            value: uniqueAuthors,
            icon: Users,
            gradient: "from-primary-500 to-indigo-500",
            bgGradient: "from-primary-500/10 to-indigo-500/10",
        },
        {
            label: "Top Tag",
            value: favoriteTag,
            isText: true,
            icon: Tag,
            gradient: "from-accent-500 to-cyan-500",
            bgGradient: "from-accent-500/10 to-cyan-500/10",
        },
        {
            label: "Level",
            value: likedCount >= 50 ? "Master" : likedCount >= 20 ? "Explorer" : likedCount >= 5 ? "Seeker" : "Beginner",
            isText: true,
            icon: Trophy,
            gradient: "from-amber-500 to-orange-500",
            bgGradient: "from-amber-500/10 to-orange-500/10",
        },
    ];

    if (likedCount === 0) {
        return null; // Don't show stats if no likes
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6 md:p-8"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Your Journey
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track your wisdom collection
                    </p>
                </div>
                <Sparkles className="w-5 h-5 text-primary-500 ml-auto" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className={`relative p-4 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/20 dark:border-white/10 overflow-hidden group`}
                        >
                            {/* Background decoration */}
                            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />

                            {/* Icon */}
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.gradient} mb-3`}>
                                <Icon className="w-4 h-4 text-white" />
                            </div>

                            {/* Value */}
                            <div className={`font-bold text-gray-900 dark:text-gray-100 ${stat.isText ? "text-lg truncate" : "text-2xl"
                                }`}>
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {stat.label}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress to {likedCount >= 50 ? "Enlightened" : likedCount >= 20 ? "Master" : likedCount >= 5 ? "Explorer" : "Seeker"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {likedCount} / {likedCount >= 50 ? 100 : likedCount >= 20 ? 50 : likedCount >= 5 ? 20 : 5}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${Math.min(100, (likedCount / (likedCount >= 50 ? 100 : likedCount >= 20 ? 50 : likedCount >= 5 ? 20 : 5)) * 100)}%`
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-tertiary-500 rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
}
