import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Bath, UtensilsCrossed, Bed, Sofa, Home } from 'lucide-react';

export default function RoomSelector({ rooms, selectedRoom, onSelect }) {
  const roomIcons = {
    Kitchen: <UtensilsCrossed className="w-8 h-8" />,
    Bathroom: <Bath className="w-8 h-8" />,
    Bedroom: <Bed className="w-8 h-8" />,
    'Living Room': <Sofa className="w-8 h-8" />,
    'Full House': <Home className="w-8 h-8" />
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {rooms.map((room, idx) => (
        <motion.button
          key={room}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onSelect(room)}
          className={`p-6 rounded-lg border-2 transition-all ${
            selectedRoom === room
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={selectedRoom === room ? 'text-red-600' : 'text-gray-600'}>
              {roomIcons[room]}
            </div>
            <span className="font-semibold text-sm text-gray-900">{room}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}