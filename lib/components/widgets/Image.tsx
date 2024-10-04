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

  return (
    <div ref={imagesRef} className={`w-full ${images.length > 1 && 'grid grid-cols-2 gap-[5px]'}`}>
      {images.map((image, i) => (
        <img
          src={image}
          alt={image}
          className=' max-w-full h-full rounded'
        />
      ))}
    </div>
  );
}