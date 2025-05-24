/**
 * Format bytes to a human-readable string
 * @param bytes The number of bytes
 * @param decimals The number of decimal places to display
 * @returns A formatted string (e.g., "1.5 KB", "2.3 MB", etc.)
 */
export function formatBytes(bytes: bigint, decimals: number = 2): string {
  if (bytes === BigInt(0)) return '0 Bytes';

  const k = BigInt(1024);
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let i = 0;
  let bytesNumber = bytes;

  while (bytesNumber >= k && i < sizes.length - 1) {
    bytesNumber = bytesNumber / k;
    i++;
  }

  // Convert to number for formatting decimals
  const bytesAsNumber = Number(bytesNumber);
  return `${bytesAsNumber.toFixed(dm)} ${sizes[i]}`;
} 