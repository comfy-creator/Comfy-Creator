type ImageProps = {
  value: string;
};

export function Image({ value }: ImageProps) {
  return <img src={value} alt={value} style={{ width: '100%', height: '100%' }} />;
}
