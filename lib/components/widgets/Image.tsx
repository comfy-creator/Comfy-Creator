type ImageProps = {
  value?: string;
};

export function ImageWidget({ value }: ImageProps) {
  return value && <img src={value} alt={value} style={{ width: '100%', height: '100%' }} />;
}
