export function diff(date: Date): [number, number, number] {
  const diffTime = Math.abs(date.getTime() - new Date().getTime());

  return [
    Math.floor(diffTime / 3600000),
    Math.floor((diffTime % 3600000) / 60000),
    Math.floor((diffTime % 60000) / 1000),
  ];
}
