import './Drawer.css';

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
        className={`overlay ${!open && 'overlayHidden'} ${open && 'overlayOpen'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`drawer ${open && 'animate'} ${!open && 'hidden'}`}>
        <div className="header">
          <h3 className="header_title">Image Feed</h3>
        </div>
        <div className="image_list">
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
    <div className="image-container">
      <img src={src} alt={alt} className="image" />
      <div className="image_overlay"></div>
      <div className="image_overlay">
        <a href={src} download className="download-button">
          Download
        </a>
        <button onClick={onRemove} className="remove-button">
          Remove
        </button>
      </div>
    </div>
  );
};
