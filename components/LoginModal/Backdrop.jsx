import { motion } from "framer-motion";
import { React, useEffect } from 'react';

export default function Backdrop({ onClick, children }) {

  function handleEscape(e) {
    if (e.key === 'Escape') {
      onClick();
    }
  };

  // Detect global keypress events and toggled off modal if active
  useEffect(() => {
    window.addEventListener('keydown', handleEscape, []);
    return () => {
      window.removeEventListener('keydown', handleEscape, []);
    }
  })


  return (
    <div 
      className="absolute top-[100%] flex justify-evenly"
      onClick={onClick}
    >
      {/* gap-[xx rem] sets horizontal position of modal */}
      {/* Has an overlay outside of modal when active. Prevents first click-through but Google does this too so. */}
      {/* The ul element IS THE ONE that fires click events */}
      <ul id="backdrop" className="flex justify-evenly sm:gap-[15%] lg:gap-[12.5rem] md:pt-3 sm:w-[97vw] md:w-[95vw] lg:w-[98vw] pb-[70vh] z-">
        <div className="hidden sm:block"></div>
        <div className="hidden sm:block"></div>
        <div></div>
        <motion.div
        className="wrapper z-10 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        >
          { children }
        </motion.div>
      </ul>
    </div>
  )
}