export function formatDate(inputDate: string, withTime: boolean = true) {
  const date = new Date(inputDate);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  if (withTime) {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } else {
    return `${day}.${month}.${year}`;
  }
}