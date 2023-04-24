export default function Card({
  className = '',
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className={`${className} p-5 w-full h-80 flex items-center justify-center rounded-lg`} onClick={onClick}>
      {children}
    </button>
  );
}
