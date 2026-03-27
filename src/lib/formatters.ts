export function formatPrice(price: number): string {
  return `$${price.toFixed(0)}`;
}

export function formatPriceChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function getInitials(email: string): string {
  return email.charAt(0).toUpperCase();
}
