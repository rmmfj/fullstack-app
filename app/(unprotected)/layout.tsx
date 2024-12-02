"use server";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";

export default async function UnprotectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-grow w-full h-[93vh] bg-gray-100 text-gray-800'>
      <div className='flex-1 h-full flex flex-col overflow-y-scroll items-center justift-center'>
        <Suspense fallback={<LoadingSpinner size={48} className="h-full text-indigo-400" />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
