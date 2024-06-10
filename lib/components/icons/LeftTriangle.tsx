export function LeftTriangle({ fill = '#ddd' }: { fill?: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <polygon points="6,1 1,4 6,7" fill={fill} />
    </svg>
  );
}
