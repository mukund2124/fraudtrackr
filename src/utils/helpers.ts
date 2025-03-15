
import { Transaction, TransactionFilters } from "../types/Transaction";

// Format currency values
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Get risk level based on fraud probability
export const getRiskLevel = (probFraud: number): 'high' | 'medium' | 'low' => {
  if (probFraud > 0.8) return 'high';
  if (probFraud >= 0.5) return 'medium';
  return 'low';
};

// Get risk color based on fraud probability
export const getRiskColor = (probFraud: number): string => {
  if (probFraud > 0.8) return 'risk-high';
  if (probFraud >= 0.5) return 'risk-medium';
  return 'risk-low';
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

// Filter transactions based on filters
export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Search term filter
    if (
      filters.searchTerm &&
      !Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Fraud probability range
    if (
      transaction.Prob_Fraud < filters.minFraudProb ||
      transaction.Prob_Fraud > filters.maxFraudProb
    ) {
      return false;
    }

    // Foreign transaction filter
    if (filters.isForeignOnly && transaction.is_foreign_transaction !== 1) {
      return false;
    }

    // Different country filter
    if (filters.isDifferentCountryOnly && transaction.different_country !== 1) {
      return false;
    }

    // Merchant name filter
    if (
      filters.merchantName &&
      !transaction.merchantName
        .toLowerCase()
        .includes(filters.merchantName.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
};

// Sort transactions by fraud probability (highest first)
export const sortTransactionsByRisk = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => b.Prob_Fraud - a.Prob_Fraud);
};

// Export transactions to CSV
export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = Object.keys(transactions[0]).join(',');
  const rows = transactions.map(transaction => 
    Object.values(transaction).map(value => 
      typeof value === 'string' ? `"${value}"` : value
    ).join(',')
  ).join('\n');
  
  return `${headers}\n${rows}`;
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Simulate loading JSON files
export const simulateJSONFileLoading = (
  onDataLoaded: (data: Transaction) => void, 
  interval: number = 2000
): { start: () => void; stop: () => void } => {
  let intervalId: number | null = null;
  
  const start = () => {
    const allData = [...generateMockTransactions(50)];
    let index = 0;
    
    intervalId = window.setInterval(() => {
      if (index < allData.length) {
        onDataLoaded(allData[index]);
        index++;
      } else {
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      }
    }, interval);
  };
  
  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  return { start, stop };
};
