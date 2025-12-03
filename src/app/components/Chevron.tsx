"use client";

import { m } from "framer-motion";

type ChevronProps = {
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export default function Chevron({ hovered, onMouseEnter, onMouseLeave, onClick }: ChevronProps) {
  return (
    <m.div
      className={`fixed bottom-8 left-0 right-0 mx-auto w-fit z-[100] cursor-pointer p-4 ${hovered ? 'text-amber-800' : 'text-amber-600'}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
      whileHover={{ scale: 1.1, color: '#d97706' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid="chevron"
    >
      <m.div
        className={`flex justify-center ${hovered ? 'opacity-100' : 'opacity-40'}`}
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      >
        <m.svg
          className="w-20 h-20"
          viewBox="0 0 102 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ y: 0 }}
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M47.9783 43.1672L23.936 19.125L29.9455 13.1155L50.983 34.153L72.0205 13.1155L78.03 19.125L53.9878 43.1672C53.1908 43.964 52.11 44.4116 50.983 44.4116C49.8561 44.4116 48.7753 43.964 47.9783 43.1672Z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M47.9783 65.1672L23.936 41.125L29.9455 35.1155L50.983 56.153L72.0205 35.1155L78.03 41.125L53.9878 65.1672C53.1908 65.964 52.11 66.4116 50.983 66.4116C49.8561 66.4116 48.7753 65.964 47.9783 65.1672Z" fill="currentColor"/>
        </m.svg>
      </m.div>
    </m.div>
  );
}
