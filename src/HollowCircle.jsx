import React, { useState } from 'react';
import {
  validHex,
  hexToHsva,
  hsvaToHex,
  color as handleColor,
} from '@uiw/color-convert';
import Interactive from '@uiw/react-drag-event-interactive';
import Point from './Point';
import './HollowCircle.css';

const TAU = Math.PI * 2;

const HUE_GRADIENT_CLOCKWISE =
  'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)';
const HUE_GRADIENT_ANTICLOCKWISE =
  'conic-gradient(red, magenta, blue, aqua, lime, yellow, red)';

function getWheelDimensions({ width = 0 }) {
  const r = width / 2;
  return {
    width,
    radius: r,
    cx: r,
    cy: r,
  };
}

function getHandleRange({ width = 0 }) {
  return width / 2;
}

const mod = (a, n) => ((a % n) + n) % n;

const dist = (x, y) => Math.sqrt(x * x + y * y);

function translateWheelAngle(props, angle, invert) {
  const wheelAngle = props.angle || 0;
  const direction = props.direction;
  // inverted and clockwisee
  if (invert && direction === 'clockwise') angle = wheelAngle + angle;
  // clockwise (input handling)
  else if (direction === 'clockwise') angle = 360 - wheelAngle + angle;
  // inverted and anticlockwise
  else if (invert && direction === 'anticlockwise')
    angle = wheelAngle + 180 - angle;
  // anticlockwise (input handling)
  else if (direction === 'anticlockwise') angle = wheelAngle - angle;
  return mod(angle, 360);
}

function getWheelHandlePosition(props, hsv) {
  const { cx, cy } = getWheelDimensions(props);
  const handleRange = getHandleRange(props);
  const handleAngle =
    (180 + translateWheelAngle(props, hsv.h, true)) * (TAU / 360);
  const handleDist = (hsv.s / 110) * handleRange;
  const direction = props.direction === 'clockwise' ? -1 : 1;

  const rerule = {
    x: cx + handleDist * Math.cos(handleAngle) * direction,
    y: cy + handleDist * Math.sin(handleAngle) * direction,
  };

  return {
    x: cx + 90 * Math.cos(handleAngle) * direction,
    y: cy + 90 * Math.sin(handleAngle) * direction,
  };

  return rerule;
}

function getWheelValueFromInput(props, x, y) {
  const { cx, cy } = getWheelDimensions(props);
  const handleRange = getHandleRange(props);
  x = cx - x;
  y = cy - y;
  // Calculate the hue by converting the angle to radians
  const hue = translateWheelAngle(props, Math.atan2(-y, -x) * (360 / TAU));
  // Find the point's distance from the center of the wheel
  // This is used to show the saturation level
  const handleDist = Math.min(dist(x, y), handleRange);
  return {
    h: Math.round(hue),
    s: Math.round((100 / handleRange) * handleDist),
  };
}

export default (props) => {
  const {
    prefixCls = 'w-color-wheel',
    radius = 0,
    pointer,
    className,
    style,
    width = 200,
    height = 200,
    direction = 'anticlockwise',
    angle = 180,
    color,
    onChange,
    ...other
  } = props;

  const hsva =
    typeof color === 'string' && validHex(color)
      ? hexToHsva(color)
      : color || {};
  const hex = color ? hsvaToHex(hsva) : '';
  const positions = getWheelHandlePosition({ width }, hsva);
  const comProps = {
    top: '0',
    left: '0',
    color: hex,
  };
  const handleChange = (interaction, event) => {
    console.log(interaction);

    const result = getWheelValueFromInput(
      { width },
      width - interaction.x,
      height - interaction.y
    );

    let handleHsva = {
      h: result.h,
      s: result.s,
      v: hsva.v,
      a: hsva.a,
    };

    if (result.s < 88) {
      // return;
      handleHsva = {
        h: result.h,
        s: 88,
        v: hsva.v,
        a: hsva.a,
      };
    }

    onChange && onChange(handleColor(handleHsva));
  };
  return (
    <Interactive
      className={[prefixCls, className || ''].filter(Boolean).join(' ')}
      {...other}
      style={{
        ...style,
        position: 'relative',
        width,
        height,
      }}
      onMove={handleChange}
      onDown={handleChange}
    >
      {React.createElement(Point, {
        prefixCls,
        style: {
          zIndex: 1,
          transform: `translate(${positions.x}px, ${positions.y}px)`,
        },
        ...comProps,
      })}
      {/* <div class="circle1"><div class="white"></div></div> */}
      <div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          background:
            direction === 'anticlockwise'
              ? HUE_GRADIENT_CLOCKWISE
              : HUE_GRADIENT_ANTICLOCKWISE,
          transform: `rotateZ(${angle + 90}deg)`,
          inset: 0,
        }}
      >
        <div class="white"></div>
      </div>
      {/* <div
        style={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'radial-gradient(circle closest-side, #fff, transparent)',
          inset: 0,
        }}
      /> */}
      {/* <div
        style={{
          backgroundColor: '#000',
          borderRadius: '50%',
          position: 'absolute',
          inset: 0,
          opacity: typeof hsva.v === 'number' ? 1 - hsva.v / 100 : 0,
        }}
      /> */}
    </Interactive>
  );
};
