"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Archive, House, Menu, ScanSearch, Shirt, TextSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthButton from "./auth-button";
import AvatarMenu from "./avatar-menu";

const BRAND_NAME = '一鍵穿新';

const LandingPageHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("scroll", controlNavbar);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [lastScrollY]);

  return (
    <header className='z-50'>
      <motion.div
        className={cn(
          "z-50 fixed w-full top-0 left-0 font-semibold bg-gray-100 bg-opacity-50 flex p-4 py-2 gap-4 h-[7vh] items-center justify-between",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
        initial={false}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
      >
        <Link href='/'>
          <div className='flex items-center jusifty-center'>
            <Image
              src='/content/logo.svg'
              alt='Brand Logo'
              width={64}
              height={64}
            />
            <p className='text-lg text-gray-800'>
              {BRAND_NAME}
            </p>
          </div>
        </Link>
      </motion.div>
    </header>
  );
};

const routes = [
  {
    pathnames: ['/home'],
    tabLabel: '首頁',
    icon: <House className="w-4 h-4" />,
  },
  {
    pathnames: ['/upload', '/history', '/recommendation'],
    tabLabel: '穿搭推薦',
    icon: <Shirt className="w-4 h-4" />,
  },
  {
    pathnames: ['/search', ],
    tabLabel: '文字搜尋',
    icon: <TextSearch className="w-4 h-4" />,
  },
  {
    pathnames: ['/image-search', ],
    tabLabel: '以服搜服',
    icon: <ScanSearch className="w-4 h-4" />,
  },
  {
    pathnames: ['/closet', ],
    tabLabel: '我的衣櫃',
    icon: <Archive className="w-4 h-4" />,
  },
];

const match = (pathname: string, pathnames: string[]) => {
  for (const p of pathnames) {
    if (pathname.includes(p))
      return true;
  }
  return false;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    (async () => {
      const supabase = createClient();
      const {
        data: { user: userResponse },
      } = await supabase.auth.getUser();
      if (userResponse) {
        setUser(userResponse);
        console.log('userResponse', userResponse)
      }
    })();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  const pathname = usePathname();
  console.log(pathname);
  if (pathname === "/" || pathname === "/privacypolicy" || pathname === "/termsofservice") return <LandingPageHeader />;

  return (
    <header>
      <div className='w-full font-semibold bg-gray-100 border-solid border-t-2 flex p-0 pt-2 pb-0 p-4 h-[7vh] items-center justify-between'>
        <div className='flex gap-4 items-center justify-center'>
          {
            isMobile
              ? <div className="font-normal">{BRAND_NAME}</div>
              : <>
              {
                routes.map(route => {
                  return <Link
                    key={route.tabLabel}
                    href={route.pathnames[0]}
                  >
                    <div className={cn("text-gray-400 flex items-center justify-center gap-2 font-normal py-2 px-4", match(pathname, route.pathnames) && 'border-t-2 border-indigo-400 bg-gray-200 text-gray-800')}>
                      {route.icon}
                      {route.tabLabel && <p>
                        {route.tabLabel}
                      </p>}
                    </div>
                  </Link>
                })
              }
            </>
          }
        </div>
        {
          isMobile && <Sheet open={isVisible}>
            <SheetTrigger asChild>
              <Button onClick={() => setIsVisible(true)} variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent className='w-[70vw] flex flex-col gap-6 justify-between bg-gray-100 pt-10'>
              <nav className='flex flex-col gap-4 mt-8'>
                <SheetTitle className="text-center text-gray-700">{BRAND_NAME}</SheetTitle>
                {
                  routes.map(route => {
                    return <Link
                      onClick={() => setIsVisible(false)}
                      key={route.pathnames[0]}
                      href={route.pathnames[0]}
                    >
                      <div
                        className={cn("text-gray-400 flex items-center justify-center gap-2 font-normal py-3 px-4 text-xl", match(pathname, route.pathnames) && 'border-t-2 border-indigo-400 bg-gray-200 text-gray-800')}
                      >
                        {route.icon}
                        <p>
                          {route.tabLabel}
                        </p>
                      </div>
                    </Link>
                  })
                }
              </nav>
              <div className="w-full flex flex-col gap-6 items-center justify-center">
                <Separator className="bg-gray-400" />
                { user ? <AvatarMenu isMobile={true} /> : <AuthButton isMobile={true} /> }
              </div>
            </SheetContent>
          </Sheet>
        }
       
        {!isMobile &&
          <div className="flex flex-reverse">
            {
              user 
              ? <AvatarMenu />
              : <AuthButton />
            }
          </div>
        }
        
      </div>
    </header>
  );
};

export default Header;
