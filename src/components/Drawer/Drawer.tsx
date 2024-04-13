import './Drawer.css';
import Image from './image.png';

export const Drawer = (props: any) => {
  const { open, onClose } = props;

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
          {[0, 0, 0, 0, 0, 0].map((_) => (
            <ImageWithOverlay src={Image} alt="image" />
          ))}
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
