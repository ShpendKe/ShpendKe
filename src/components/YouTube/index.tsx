import React from 'react';

function YouTubeEmbed({ videoId, title = 'YouTube video player', width = 560, height = 315 }) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const aspectRatioPadding = (height / width) * 100 + '%'; // Calculate aspect ratio for responsive container

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: aspectRatioPadding, // For 16:9, this would be '56.25%'
        height: 0,
        overflow: 'hidden',
        maxWidth: '100%',
        backgroundColor: 'black', // Placeholder background
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  );
}

export default YouTubeEmbed;