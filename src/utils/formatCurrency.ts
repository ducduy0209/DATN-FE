export const formatCurrency = (amount: string | undefined): string => {
  if(typeof amount === 'undefined') {
    return '-- VNĐ'
  }
  const formattedNumber = new Intl.NumberFormat('vi-VN').format(Number(amount));
  const formattedPrice = `${formattedNumber} VNĐ`;
  return formattedPrice
}