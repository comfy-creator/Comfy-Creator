import React from 'react'

const ImageFeed = () => {
  return (
    <div className="w-full h-full">
        <h2>Image Feed</h2>
        <h4>Your Images that has been generated</h4>

        <div className="h-[calc(100%-120px)] overflow-y-auto flex flex-wrap gap-2.5">
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

export default ImageFeed


interface ImageWithOverlayProps {
   src: string;
   alt: string;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({ src, alt }) => {
   const onRemove = () => {};
   const onDownload = () => {};
   return (
    <div className="image">
      <div className="relative group">
         <img src={src} alt={alt} className="h-[200px] w-[200px] block rounded-[6px]" />
         <div className="absolute top-0 left-0 w-full h-full rounded-[6px] bg-[rgba(34,34,34,0.3)] group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out flex justify-center items-center flex-col cursor-pointer"></div>
         <div className="absolute top-0 left-0 w-full h-full rounded-[6px] bg-[rgba(34,34,34,0.3)] group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out flex justify-center items-center flex-col cursor-pointer">
            <button onClick={onDownload} className="group-hover:block hidden text-white text-base font-bold m-2 cursor-pointer rounded-[8px] hover:bg-[#061836] bg-[#0c2d66] border-none outline-none p-2 transition-all duration-300 ease-in-out">
               Download
            </button>
            <button onClick={onRemove} className="group-hover:block hidden text-white text-base font-bold m-2 cursor-pointer rounded-[8px] hover:bg-[#061836] bg-[#0c2d66] border-none outline-none p-2 transition-all duration-300 ease-in-out">
               Delete
            </button>
         </div>
      </div>
    </div>
   );
};