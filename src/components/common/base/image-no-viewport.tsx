import { useState } from 'react';
import Image from 'next/image';

interface IP {
  options: any;
  src: string;
  fallbackSrc?: string;
}

export function ImageOptimize(props: IP) {
  const { src, fallbackSrc = '/no-image.jpg', options } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      width={256}
      height={256}
      priority
      {...options}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

ImageOptimize.defaultProps = {
  fallbackSrc: '/no-image.jpg'
};

export default ImageOptimize;
