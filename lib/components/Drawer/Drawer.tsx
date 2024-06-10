interface IProps {
  open: boolean;
  onClose: () => void;
  images: string[];
}

export const Drawer = (props: IProps) => {
  const { open, onClose, images } = props;

  return (
    <>
      <div
        className={`content-browser-overlay ${!open && 'content-browser-overlayHidden'} ${open && 'content-browser-overlayOpen'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`content-browser-drawer ${open && 'content-browser-animate'} ${!open && 'content-browser-hidden'}`}
      >
        <div className="content-browser-header">
          <h3 className="content-browser-header_title">Image Feed</h3>
        </div>
        <div className="content-browser-image_list">
          {images ? (
            images.map((image, index) => <ImageWithOverlay key={index} src={image} alt="image" />)
          ) : (
            <div>
              <h4>No images</h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface ImageWithOverlayProps {
  src: string;
  alt: string;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({ src, alt }) => {
  const onRemove = () => {};
  return (
    <div className="content-browser-image-container">
      <img src={src} alt={alt} className="content-browser-image" />
      <div className="content-browser-image_overlay"></div>
      <div className="content-browser-image_overlay">
        <a href={src} download className="content-browser-download-button">
          Download
        </a>
        <button onClick={onRemove} className="content-browser-remove-button">
          Remove
        </button>
      </div>
    </div>
  );
};
