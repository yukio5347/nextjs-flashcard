export default function ProgressBar({ molecule, denominator }: { molecule: number; denominator: number }) {
  return (
    <div className='relative flex items-center mt-5 w-full bg-gray-400 rounded-full h-6 text-center'>
      <div className='absolute right-0 left-0 text-sm text-white'>
        {molecule} / {denominator}
      </div>
      <div className='bg-sky-500 h-6 rounded-full' style={{ width: `${(molecule / denominator) * 100}%` }}></div>
    </div>
  );
}
