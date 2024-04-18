import React, { useCallback, useEffect, useState } from 'react';
import { Drawer } from './Drawer';
import { useApiContext } from '../../contexts/api.tsx';

const ImageFeedDrawer: React.FC = () => {
  const { getOutputImages, makeServerURL } = useApiContext();
  const [images, setImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getOutputImages({ page, page_size: pageSize }).then((res) => {
      const files = res?.files || [];
      const images = files.map((file) => {
        const filename = file.split('/').pop();
        return makeServerURL(`/view?filename=${filename}`);
      });
      setImages(images);
    })
  }, [page, pageSize]);

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="App">
      <button type="button" onClick={handleOpen}>
        Image feed
      </button>
      <Drawer images={images} open={open} onClose={handleClose} />
    </div>
  );
};

export default ImageFeedDrawer;
