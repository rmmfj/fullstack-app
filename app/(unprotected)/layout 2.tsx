"use server";

export default async function UnprotectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-grow w-full h-[93vh] bg-gray-100 text-gray-800'>
      <div className='flex-1 flex flex-col overflow-y-scroll'>{children}</div>
    </div>
  );
}
