import { cn } from "@/lib/utils";
import Image from "next/image";

const Section = ({ children, title, slogan, description, buttonText, buttonLink, reverse, darkerBackground, id }: { children?: React.ReactNode, title?: string, description?: string, slogan?: string, buttonText?: string, buttonLink?: string, reverse?: boolean, darkerBackground?: boolean, id: string }) => {
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
            width={360}
            height={360}
            src={"https://scontent-tpe1-1.xx.fbcdn.net/v/t1.15752-9/462588551_935893201849706_3741715274595253031_n.png?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_ohc=7A5W5FKMtGsQ7kNvgHn8loP&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&oh=03_Q7cD1QG0nVS2ZjZEH_o0vLzJcQdtqEbj5Z-493RTQokttg1KKQ&oe=677E4E82"}
            alt={"Example"}
          />
        </div>
      </div>
      
    </section>
  );
};

export default Section;
