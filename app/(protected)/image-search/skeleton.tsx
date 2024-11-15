"use client";

const Skeleton = () => (
  <div className='animate-pulse flex-1 flex flex-col items-center justify-center h-auto gap-4'>
    <div className='w-80 h-4 bg-gray-300 rounded'></div>
    <div className='w-80 h-80 bg-gray-300 rounded-lg'></div>
    <div className='w-80 h-4 bg-gray-300 rounded'></div>
  </div>
);

export default Skeleton;
