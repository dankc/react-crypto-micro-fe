import type { HTMLAttributes } from 'react';

export default function SearchIcon(props?: HTMLAttributes<unknown>) {
  return (
    <svg
      version="1.1"
      baseProfile="basic"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="1000px"
      height="1000px"
      viewBox="0 0 1000 1000"
      fill="#000"
      {...props}
    >
      <path
        transform="matrix(1.0030090270812437,0,0,1.0030090270812437,0,1)"
        d="M 985 841 L 809 665 C 850 599 874 520 874 437 C 874 196 678 0 437 0 C 196 0 0 196 0 437 C 0 678 196 874 437 874 C 522 874 601 850 668 807 L 844 983 C 854 994 872 994 883 983 L 985 881 C 996 870 996 852 985 841 z M 127 437 C 127 266 266 127 437 127 C 608 127 747 266 747 437 C 747 608 608 747 437 747 C 266 747 127 608 127 437 z"
      />
    </svg>
  );
}
