/**
 * Formats a price value by rounding to the nearest whole number and adding comma separators
 * @param price - The price value to format (can be a number or string)
 * @returns Formatted price string with comma separators (e.g., "1,235" instead of "1234.56")
 * 
 * @example
 * formatPrice(1234.56) // returns "1,235"
 * formatPrice(1234.45) // returns "1,234"
 * formatPrice(500) // returns "500"
 */
export default function formatPrice(price: number | string): string {
  // Convert to number if string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  // Handle invalid numbers
  if (isNaN(numPrice)) {
    return '0'
  }
  
  // Round to nearest whole number
  const roundedPrice = Math.round(numPrice)
  
  // Format with comma separators using toLocaleString
  return roundedPrice.toLocaleString('en-US')
}

