"use client";

import { motion } from "framer-motion";
import { WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedTextCharacter from "../animated-text-character";
import People from "../illustrations/people";
import { Button } from "../ui/button";

const HeroSection = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login"); // Navigate to the /upload route
  };
  return (
    <section className='md:h-[75vh] h-fit py-32 text-gray-800 relative flex md:flex-row flex-col-reverse  items-center justify-center bg-cover bg-center md:gap-24 gap-8 px-10'>
      <div className='relative z-10 md:text-start text-center'>
        <h1 className='flex text-2xl md:text-4xl font-bold mb-4 animate-fade-in-up'>
          <AnimatedTextCharacter text='輕鬆找到屬於你的' />
          <div className="text-indigo-400">時尚風格</div>
        </h1>
        <AnimatedTextCharacter
          className='border-l-4 border-black md:pl-4 pl-2 text-sm md:text-lg mb-16 max-w-3xl mx-auto animate-fade-in-up animation-delay-300'
          text='一鍵找到最適合您的穿搭靈感'
        />
        <motion.div className="flex items-center justify-center w-full" initial={{ scale: 0 }} whileInView={{ scale: 1 }}>
          <Button
            className='bg-indigo-200 hover:bg-indigo-300 text-white animate-fade-in-up animation-delay-600 py-6 px-10 border-r-4 border-b-4 border-indigo-500'
            onClick={handleClick}
          >
            <WandSparkles className='text-indigo-600 mr-2 h-4 w-4' />
            <motion.span
            initial={{ x: 200, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            className='animate-[pulse_0.8s_ease-out_infinite] bg-gradient-to-r from-indigo-600 to-indigo-700 text-lg bg-clip-text text-transparent'
          >
            立即體驗
          </motion.span>
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <People className='md:w-[30rem] w-[15rem]' />
      </motion.div>
    </section>
  );
};

export default HeroSection;
