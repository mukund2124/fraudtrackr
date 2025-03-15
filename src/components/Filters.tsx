
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TransactionFilters } from '../types/Transaction';
import { motion } from 'framer-motion';

interface FiltersProps {
  onFilterChange: (filters: TransactionFilters) => void;
}

const defaultFilters: TransactionFilters = {
  searchTerm: '',
  minFraudProb: 0,
  maxFraudProb: 1,
  isForeignOnly: false,
  isDifferentCountryOnly: false,
  merchantName: ''
};

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (
    field: keyof TransactionFilters,
    value: string | number | boolean
  ) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="glass rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Search & Filters
        </h2>
        <motion.button
          className="text-sm px-3 py-1 rounded-full flex items-center glass-dark"
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="h-4 w-4 mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </motion.button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search transactions by any field..."
          className="w-full p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unionbank-blue focus:border-transparent"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {filters.searchTerm && (
          <button
            className="absolute right-3 top-2.5"
            onClick={() => handleFilterChange('searchTerm', '')}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {showFilters && (
        <motion.div 
          className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fraud Probability Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={filters.minFraudProb}
                onChange={(e) => handleFilterChange('minFraudProb', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm">
                {(filters.minFraudProb * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={filters.maxFraudProb}
                onChange={(e) => handleFilterChange('maxFraudProb', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm">
                {(filters.maxFraudProb * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="foreignOnly"
                  checked={filters.isForeignOnly}
                  onChange={(e) => handleFilterChange('isForeignOnly', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="foreignOnly" className="text-sm">
                  Foreign Transactions Only
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="differentCountry"
                  checked={filters.isDifferentCountryOnly}
                  onChange={(e) => handleFilterChange('isDifferentCountryOnly', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="differentCountry" className="text-sm">
                  Different Country Only
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant Name
            </label>
            <input
              type="text"
              placeholder="Filter by merchant..."
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unionbank-blue focus:border-transparent"
              value={filters.merchantName}
              onChange={(e) => handleFilterChange('merchantName', e.target.value)}
            />
          </div>

          <div className="col-span-full flex justify-end">
            <motion.button
              className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={resetFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Filters;
