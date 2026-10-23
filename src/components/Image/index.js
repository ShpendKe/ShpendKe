import React from 'react';
export default function CenteredImage({ src, width, maxWidth = '100%', caption, style = {}, className, imageSource }) {
    const imageStyle = {
        display: 'block',
        margin: '0 auto',
        maxWidth: maxWidth,
        width: width || 'auto',
        height: 'auto',
        ...style
    };
    const containerStyle = {
        textAlign: 'center',
        margin: '2rem 0'
    };
    const captionStyle = {
        fontSize: '0.9em',
        color: 'var(--ifm-color-emphasis-600)',
        marginTop: '0.5rem',
        fontStyle: 'italic'
    };
    return (<div style={containerStyle} className={className}>
      <img src={src} alt={caption} style={imageStyle}/>
      {caption && <div style={captionStyle}>{imageSource && <a href={imageSource}>{caption}</a>} {!imageSource && caption}</div>}
    </div>);
}
