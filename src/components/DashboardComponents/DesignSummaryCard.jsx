import React from 'react';
import { Calendar } from 'lucide-react';

export default function DesignSummaryCard({ title, description, date }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-gray-500 text-sm">
        <Calendar size={16} className="mr-2" />
        {date}
      </div>
    </div>
  );
}
