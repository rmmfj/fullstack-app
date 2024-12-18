"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const FeatureCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <motion.div
      whileInView={{ scale: 1 }}
      className='md:w-[24rem] hover:shadow-lg w-full bg-gray-50 rounded-xl p-6 transition-all duration-300 ease-in-out flex flex-col gap-2'
    >
      <div className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 '>
        <h2 className='text-xl font-bold mb-2'>{title}</h2>
      </div>
      <div className='text-base mb-8 text-gray-600'>{description}</div>
      <div className='w-full flex items-center justify-center'>{children}</div>
    </motion.div>
  );
};

export default FeatureCard;
