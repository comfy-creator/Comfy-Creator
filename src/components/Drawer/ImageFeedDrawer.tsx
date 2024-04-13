import React, { useCallback, useState } from 'react';
import { Drawer } from './Drawer';

const ImageFeedDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="App">
      <button type="button" onClick={handleOpen}>
        Image feed
      </button>
      <Drawer open={open} onClose={handleClose} />
    </div>
  );
};

export default ImageFeedDrawer;
