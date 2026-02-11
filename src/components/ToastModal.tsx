import { type MouseEvent, type ReactNode, type Ref, useRef } from 'react';

interface Props {
  isActive: boolean;
  toggleFn: (arg: boolean) => void;
  asideRef?: Ref<HTMLElement>;
  children: ReactNode;
}

export default function ToastModal({ isActive, toggleFn, asideRef, children }: Props) {
  const backdrop = useRef<HTMLDivElement | null>(null);

  function closeToast(event: MouseEvent<HTMLDivElement>) {
    if (event.target === backdrop.current) toggleFn(false);
  }

  return (
    <div className={`${isActive ? 'absolute' : 'static'} top-0 right-0 bottom-0 left-0 z-1`} ref={backdrop} onClick={closeToast}>
      <aside
        ref={asideRef}
        className={`w-85/100 md:w-xs max-h-[calc(100%-var(--header-height,0))] h-full p-4 fixed bottom-0 right-0 bg-[#242424] shadow-[-5px_0_10px_black] transition-transform duration-200 ease-in-out ${!isActive && 'translate-x-full'}`}
        tabIndex={isActive ? 0 : -1}
      >
        {children}
      </aside>
    </div>
  );
}
