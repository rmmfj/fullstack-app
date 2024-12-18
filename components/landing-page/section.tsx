import { cn } from "@/lib/utils";
import Image from "next/image";

const Section = ({ children, title, slogan, description, buttonText, buttonLink, reverse, darkerBackground, id, screenshotUrl }: { children?: React.ReactNode, title?: string, description?: string, slogan?: string, buttonText?: string, buttonLink?: string, reverse?: boolean, darkerBackground?: boolean, id: string, screenshotUrl: string }) => {
  return (
    <section id={id} className={cn('px-10 py-16 flex flex-col gap-12 items-center', darkerBackground ? 'bg-gray-100' : 'bg-gray-50')}>
      <div className={cn('w-full flex md:px-[5rem]  md:items-start items-center justify-center gap-32 mx-auto px-4', reverse ? 'md:flex-row-reverse flex-col' : 'md:flex-row flex-col')}>
        <div className='text-start w-fit flex flex-col gap-6'>
          <h2 className='text-3xl font-bold'>{ title }</h2>
          <h3 className='text-3xl font-bold'>{ slogan }</h3>
          <span className='w-full text-gray-600 text-lg'>
            {
              description?.split('\n').map(line => {
                return <p key={`line-${line}`}>
                  {line}
                </p>;
              })
            }
          </span>
        </div>
        <div className='flex-1 flex flex-col md:flex-row gap-12 items-center justify-center'>
          {/* { children } */}
          <Image
            width={480}
            height={480}
            src={screenshotUrl}
            className="h-full"
            alt={"Example"}
          />
        </div>
      </div>
      
    </section>
  );
};

export default Section;
