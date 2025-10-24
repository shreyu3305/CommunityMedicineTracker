import React from 'react';

interface DotsLoaderProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({ className, style }) => {
  return (
    <div 
      className={`dots-container ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        ...style
      }}
    >
      <div className="dot" style={dotStyles} />
      <div className="dot" style={dotStyles} />
      <div className="dot" style={dotStyles} />
      <div className="dot" style={dotStyles} />
      <div className="dot" style={dotStyles} />
      
      <style>
        {`
          .dots-container .dot {
            height: 20px;
            width: 20px;
            margin-right: 10px;
            border-radius: 10px;
            background-color: #b3d4fc;
            animation: pulse 1.5s infinite ease-in-out;
          }
          
          .dots-container .dot:last-child {
            margin-right: 0;
          }
          
          .dots-container .dot:nth-child(1) {
            animation-delay: -0.3s;
          }
          
          .dots-container .dot:nth-child(2) {
            animation-delay: -0.1s;
          }
          
          .dots-container .dot:nth-child(3) {
            animation-delay: 0.1s;
          }
          
          .dots-container .dot:nth-child(4) {
            animation-delay: 0.3s;
          }
          
          .dots-container .dot:nth-child(5) {
            animation-delay: 0.5s;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.8);
              background-color: #b3d4fc;
              box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
            }
          
            50% {
              transform: scale(1.2);
              background-color: #6793fb;
              box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
            }
          
            100% {
              transform: scale(0.8);
              background-color: #b3d4fc;
              box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
            }
          }
        `}
      </style>
    </div>
  );
};

const dotStyles: React.CSSProperties = {
  height: '20px',
  width: '20px',
  marginRight: '10px',
  borderRadius: '10px',
  backgroundColor: '#b3d4fc',
  animation: 'pulse 1.5s infinite ease-in-out'
};

export default DotsLoader;
