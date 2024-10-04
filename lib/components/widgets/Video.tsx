type VideoProps = {
  value: {
    src: string;
    type: string;
  };
};

export function VideoWidget({ value }: VideoProps) {
  return (
    <video autoPlay={true} className="w-full h-auto">
      <source src={value.src} type={value.type} />
      Your browser does not support the videos.
    </video>
  );
}