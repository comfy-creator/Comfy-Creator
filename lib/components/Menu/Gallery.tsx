import React from 'react'

const Gallery = () => {
  return (
    <div className="gallery">
        <h2>Gallery</h2>
        <h4>Your Images that has been generated</h4>

        <div className="gallery-container">
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
            <ImageWithOverlay src="https://via.placeholder.com/150" alt="image" />
        </div>
    </div>
  )
}

export default Gallery


interface ImageWithOverlayProps {
   src: string;
   alt: string;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({ src, alt }) => {
   const onRemove = () => {};
   const onDownload = () => {};
   return (
    <div className="image">
      <div className="image_container">
         <img src={src} alt={alt} className="image_tag" />
         <div className="image_overlay"></div>
         <div className="image_overlay">
            <button onClick={onDownload} className="download-button">
               Download
            </button>
            <button onClick={onRemove} className="remove-button">
               Delete
            </button>
         </div>
      </div>
    </div>
   );
};
