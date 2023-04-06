export function paddingRight(text: string, maxLength: number): string {
  const paddingLength = maxLength - text.length;
  const padding = " ".repeat(paddingLength);
  return `${text}${padding}`;
}
