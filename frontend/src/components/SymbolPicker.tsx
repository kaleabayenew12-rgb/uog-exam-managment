import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface SymbolPickerProps {
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

export const SymbolPicker: React.FC<SymbolPickerProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('mathematics');

  const symbolCategories = {
    mathematics: {
      name: 'Mathematics',
      symbols: [
        { symbol: '∑', name: 'Sum' },
        { symbol: '∏', name: 'Product' },
        { symbol: '√', name: 'Square Root' },
        { symbol: '∛', name: 'Cube Root' },
        { symbol: '∞', name: 'Infinity' },
        { symbol: '∫', name: 'Integral' },
        { symbol: '∂', name: 'Partial' },
        { symbol: 'Δ', name: 'Delta' },
        { symbol: 'π', name: 'Pi' },
        { symbol: 'θ', name: 'Theta' },
        { symbol: 'α', name: 'Alpha' },
        { symbol: 'β', name: 'Beta' },
        { symbol: 'γ', name: 'Gamma' },
        { symbol: 'λ', name: 'Lambda' },
        { symbol: 'μ', name: 'Mu' },
        { symbol: 'σ', name: 'Sigma' },
        { symbol: 'φ', name: 'Phi' },
        { symbol: '≈', name: 'Approximately' },
        { symbol: '≠', name: 'Not Equal' },
        { symbol: '≤', name: 'Less Than Equal' },
        { symbol: '≥', name: 'Greater Than Equal' },
        { symbol: '±', name: 'Plus Minus' },
        { symbol: '×', name: 'Multiply' },
        { symbol: '÷', name: 'Divide' }
      ]
    },
    chemistry: {
      name: 'Chemistry',
      symbols: [
        { symbol: '→', name: 'Reaction Arrow' },
        { symbol: '⇌', name: 'Equilibrium' },
        { symbol: '↑', name: 'Gas Evolution' },
        { symbol: '↓', name: 'Precipitate' },
        { symbol: 'Δ', name: 'Heat' },
        { symbol: '⊕', name: 'Positive Charge' },
        { symbol: '⊖', name: 'Negative Charge' },
        { symbol: '°C', name: 'Celsius' },
        { symbol: '°F', name: 'Fahrenheit' },
        { symbol: 'K', name: 'Kelvin' }
      ]
    },
    physics: {
      name: 'Physics',
      symbols: [
        { symbol: 'Ω', name: 'Ohm' },
        { symbol: 'μ', name: 'Micro' },
        { symbol: 'ν', name: 'Frequency' },
        { symbol: 'ρ', name: 'Density' },
        { symbol: '∝', name: 'Proportional' },
        { symbol: '∇', name: 'Nabla' },
        { symbol: '∠', name: 'Angle' },
        { symbol: '°', name: 'Degree' },
        { symbol: '′', name: 'Prime' },
        { symbol: '″', name: 'Double Prime' }
      ]
    },
    general: {
      name: 'General',
      symbols: [
        { symbol: '©', name: 'Copyright' },
        { symbol: '®', name: 'Registered' },
        { symbol: '™', name: 'Trademark' },
        { symbol: '§', name: 'Section' },
        { symbol: '¶', name: 'Paragraph' },
        { symbol: '†', name: 'Dagger' },
        { symbol: '‡', name: 'Double Dagger' },
        { symbol: '•', name: 'Bullet' },
        { symbol: '…', name: 'Ellipsis' },
        { symbol: '–', name: 'En Dash' },
        { symbol: '—', name: 'Em Dash' },
        { symbol: '"', name: 'Left Quote' },
        { symbol: '"', name: 'Right Quote' },
        { symbol: '‘', name: 'Left Single Quote' },
        { symbol: '’', name: 'Right Single Quote' }
      ]
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    onSelect(symbol);
    onClose();
  };

  const filteredSymbols = symbolCategories[selectedCategory as keyof typeof symbolCategories]?.symbols.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.symbol.includes(searchTerm)
  ) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Insert Symbol</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-4 mb-4">
            {Object.entries(symbolCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {filteredSymbols.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSymbolSelect(item.symbol)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group text-center"
                title={item.name}
              >
                <div className="text-2xl text-gray-700 group-hover:text-blue-600 mb-1">
                  {item.symbol}
                </div>
                <div className="text-xs text-gray-500 group-hover:text-blue-600 truncate">
                  {item.name}
                </div>
              </button>
            ))}
          </div>

          {filteredSymbols.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No symbols found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
