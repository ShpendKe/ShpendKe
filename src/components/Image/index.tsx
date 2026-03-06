import React, { CSSProperties } from 'react';

interface CenteredImageProps {
  src: string;
  caption: string;
  width?: number | string;
  maxWidth?: number | string;
  style?: CSSProperties;
  className?: string;
  imageSource?: string;
}

export default function CenteredImage({
  src,
  width,
  maxWidth = '100%',
  caption,
  style = {},
  className,
  imageSource
}: CenteredImageProps): React.JSX.Element {
  const imageStyle: CSSProperties = {
    display: 'block',
    margin: '0 auto',
    maxWidth: maxWidth,
    width: width || 'auto',
    height: 'auto',
    ...style
  };

  const containerStyle: CSSProperties = {
    textAlign: 'center',
    margin: '2rem 0'
  };

  const captionStyle: CSSProperties = {
    fontSize: '0.9em',
    color: 'var(--ifm-color-emphasis-600)',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  };

  return (
    <div style={containerStyle} className={className}>
      <img src={src} alt={caption} style={imageStyle} />
      {caption && <div style={captionStyle}>{imageSource && <a href={imageSource}>{caption}</a>} {!imageSource && caption}</div>}
    </div>
  );
}