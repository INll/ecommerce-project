import { motion } from "framer-motion";
import { React, useEffect, useContext } from 'react';

export default function backdrop({ onClick, children }) {

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
      <ul id="backdrop" className="flex justify-evenly gap-[12.5rem] w-100% md:pt-3 w-[100vw] pb-[70vh] z-10">
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