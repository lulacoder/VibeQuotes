"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Lightbulb,
  Smiley,
  Fire,
  CloudSun,
  Mountains,
  Sparkle,
  BookOpenText,
} from "@phosphor-icons/react";

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const moods = [
  { name: "Inspired", tag: "inspirational", icon: Lightbulb },
  { name: "Happy", tag: "happiness", icon: Smiley },
  { name: "Motivated", tag: "motivational", icon: Fire },
  { name: "Calm", tag: "life", icon: CloudSun },
  { name: "Love", tag: "love", icon: Heart },
  { name: "Wise", tag: "wisdom", icon: BookOpenText },
  { name: "Success", tag: "success", icon: Mountains },
  { name: "Random", tag: "", icon: Sparkle },
];

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Sparkle weight="duotone" className="h-4 w-4 text-[var(--color-accent-primary)]" />
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
          What mood are you in?
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {moods.map((mood, index) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.name || (selectedMood === null && mood.tag === "");

          return (
            <motion.button
              key={mood.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(mood.tag ? mood.name : "")}
              className={`pill gap-2 ${
                isSelected ? "pill-active" : ""
              }`}
            >
              <Icon
                weight={isSelected ? "fill" : "duotone"}
                className="h-4 w-4"
              />
              {mood.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
