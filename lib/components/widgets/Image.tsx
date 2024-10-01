import Viewer from 'viewerjs';
import { useEffect, useRef, useState } from 'react';

type ImageProps = {
  value?: string | string[];
};

export function ImageWidget({ value }: ImageProps) {
  const imagesRef = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<Viewer | null>(null);

  useEffect(() => {
    if (!imagesRef.current) return;
    if (gallery) gallery.destroy();

    setGallery(new Viewer(imagesRef.current, { toolbar: false }));
  }, [imagesRef]);

  const images = Array.isArray(value) ? value : [value];
  const style =
    images.length > 1 ? { gap: '5px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' } : {};

  return (
    <div ref={imagesRef} style={{ ...style, width: '100%' }}>
      {images.map((image, i) => (
        <img
          src={image}
          alt={image}
          style={{ maxWidth: '100%', height: '100%', borderRadius: '4px' }}
        />
      ))}
    </div>
  );
}
