import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function BudgetCard({ title, total, items }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <ShoppingCart size={20} className="text-blue-500" />
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Total: <span className="font-semibold text-gray-800">${total.toFixed(2)}</span>
      </p>
      <p className="text-sm text-gray-500">
        {items} artículo{items !== 1 ? 's' : ''} incluidos
      </p>
    </div>
  );
}
