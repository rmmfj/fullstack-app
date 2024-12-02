"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Archive, House, Menu, ScanSearch, Shirt, TextSearch, WandSparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthButton from "./auth-button";
import AvatarMenu from "./avatar-menu";

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

  const menuItems = [
    { href: "#overview", label: "價值" },
    { href: "#recommendation-feature", label: "穿搭推薦" },
    { href: "#text-search-feature", label: "文字搜尋" },
    { href: "#image-search-feature", label: "以服搜服" },
    { href: "#testimonial", label: "用戶回饋" },
  ];

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
        <div className='flex gap-4'>
          <Link href='/'>
            <WandSparkles className='text-indigo-400' />
          </Link>
          <p className='text-lg'>
            會不會<span className='text-indigo-400'>穿搭</span>啊
          </p>
        </div>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent className='w-[40vw] bg-gray-100/80'>
              <nav className='flex flex-col gap-4 mt-8'>
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className='text-lg font-medium cursor-pointer'
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <div className='flex gap-4 font-light'>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
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
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    (async () => {
      const supabase = createClient();
      const {
        data: { user: userResponse },
      } = await supabase.auth.getUser();
      setUser(userResponse);
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
  if (pathname === "/") return <LandingPageHeader />;

  return (
    <header>
      <div className='font-semibold bg-gray-100 border-solid border-t-2 flex p-0 pt-2 pb-0 p-4  gap-4 h-[7vh] items-center justify-between'>
        <div className='flex gap-4 items-center justify-center'>
          {
            !isMobile && <>
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
          isMobile && <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent className='w-[50vw] bg-gray-100'>
              <nav className='flex flex-col gap-4 mt-8'>
                {user && <AvatarMenu />}
                {
                  routes.map(route => {
                    return <Link
                      key={route.pathnames[0]}
                      href={route.pathnames[0]}
                    >
                      <div
                        className={cn("text-gray-400 flex items-center justify-center gap-2 font-normal py-2 px-4", match(pathname, route.pathnames) && 'border-t-2 border-indigo-400 bg-gray-200 text-gray-800')}
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
            </SheetContent>
          </Sheet>
        }
        {!isMobile && (user ? <AvatarMenu /> : <AuthButton />)}
      </div>
    </header>
  );
};

export default Header;
