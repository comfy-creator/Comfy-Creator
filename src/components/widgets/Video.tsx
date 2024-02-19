type VideoProps = {
  value: {
    src: string;
    type: string;
  };
};

export function Video({ value }: VideoProps) {
  return (
    <video autoPlay={true} style={{ width: '100%', height: 'auto' }}>
      <source src={value.src} type={value.type} />
      Your browser does not support the videos.
    </video>
  );
}
