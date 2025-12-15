import type { HTMLAttributes } from 'react';

export default function MenuIcon(props?: HTMLAttributes<unknown>) {
  return (
    <svg
      version="1.1"
      baseProfile="basic"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="1000px"
      height="1000px"
      viewBox="0 0 1000 1000"
      fill="#000000"
      {...props}
    >
      <path
        transform="matrix(3.0395136778115504,0,0,3.0395136778115504,0,0)"
        d="M 0 0 L 328 0 L 328 82 L 0 82 L 0 0 M 0 123 L 328 123 L 328 205 L 0 205 L 0 123 M 0 246 L 328 246 L 328 328 L 0 328 L 0 246"
      />
    </svg>
  );
}
