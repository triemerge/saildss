// Indian number formatting utility
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    // Crores
    return (num / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  } else if (num >= 100000) {
    // Lakhs
    return (num / 100000).toFixed(2).replace(/\.?0+$/, '') + ' L';
  } else if (num >= 1000) {
    // Thousands
    return (num / 1000).toFixed(1).replace(/\.?0+$/, '') + ' K';
  } else {
    return num.toLocaleString('en-IN');
  }
}

export function formatIndianCurrency(num: number): string {
  if (num >= 10000000) {
    // Crores
    return '₹' + (num / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  } else if (num >= 100000) {
    // Lakhs
    return '₹' + (num / 100000).toFixed(2).replace(/\.?0+$/, '') + ' L';
  } else if (num >= 1000) {
    // Thousands
    return '₹' + (num / 1000).toFixed(1).replace(/\.?0+$/, '') + ' K';
  } else {
    return '₹' + num.toLocaleString('en-IN');
  }
}

export function formatIndianNumberFull(num: number): string {
  return num.toLocaleString('en-IN');
}