import React from 'react';

const Loader = ({ shape}) => {
  return (
    <div
      className={`loader inline-block relative ${
        shape === 'triangle' ? 'w-12 h-12' : 'w-11 h-11'
      } mx-4`}
    >
      {/* Dot */}
      <div
        className={`absolute w-[6px] h-[6px] bg-[#5628ee] rounded-full ${
          shape === 'triangle'
            ? 'top-[37px] left-[21px] animate-dotTriangle'
            : 'top-[37px] left-[19px] animate-dotRect'
        }`}
        style={{ transform: shape === 'triangle' ? 'translate(-10px, -18px)' : 'translate(-18px, -18px)' }}
      />

      {/* SVG Shape */}
      <svg className="w-full h-full" viewBox={shape === 'triangle' ? '0 0 86 80' : '0 0 80 80'}>
        {shape === 'circle' && (
          <circle
            cx="40"
            cy="40"
            r="32"
            className="fill-none stroke-[#2f3545] stroke-[10px] stroke-linecap-round stroke-linejoin-round animate-pathCircle"
            style={{ strokeDasharray: '150 50 150 50', strokeDashoffset: 75 }}
          />
        )}
        {shape === 'triangle' && (
          <polygon
            points="43 8 79 72 7 72"
            className="fill-none stroke-[#2f3545] stroke-[10px] stroke-linecap-round stroke-linejoin-round animate-pathTriangle"
            style={{ strokeDasharray: '145 76 145 76', strokeDashoffset: 0 }}
          />
        )}
        {shape === 'square' && (
          <rect
            x="8"
            y="8"
            width="64"
            height="64"
            className="fill-none stroke-[#2f3545] stroke-[10px] stroke-linecap-round stroke-linejoin-round animate-pathRect"
            style={{ strokeDasharray: '192 64 192 64', strokeDashoffset: 0 }}
          />
        )}
      </svg>
    </div>
  );
};

export default Loader;