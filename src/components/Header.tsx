import OkxIcon from '@/components/icons/OkxLogo.tsx';

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto mb-14">
      <h1 className="text-center font-bold font-8-bit tracking-tighter [font-size:clamp(46px,10vw,96px)]">
        Crypto Tracker
        <span className="flex items-center justify-center text-lg tracking-normal font-base">
          Powered by <OkxIcon className="w-16 h-16 ml-[1ch] fill-white" />
        </span>
      </h1>
    </header>
  );
}
