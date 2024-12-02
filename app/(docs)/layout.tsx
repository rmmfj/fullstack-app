import Link from "next/link";

const DocsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4">
    {/* 返回按鈕 */}
    <div className="mt-6">
      <Link
        href='/login'
        className="text-indigo-500 hover:underline"
        >
        返回
      </Link>
    </div>
    <div className="overflow-scroll mt-2 mb-6 px-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      {children}
    </div>
  </div>;
}

export default DocsLayout;