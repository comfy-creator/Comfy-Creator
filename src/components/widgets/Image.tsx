import { useEffect } from 'react';

type ImageProps = {
  value: string;
};

export function ImageWidget({ value }: ImageProps) {
  useEffect(() => {
    console.log('Image value:', value);
  }, []);

  return <img src={value} alt={value} style={{ width: '100%', height: '100%' }} />;
}
