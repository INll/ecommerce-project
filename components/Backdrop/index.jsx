import { motion } from "framer-motion";
import { React, useEffect, useContext } from 'react';
import { LoginFormContext } from '../Contexts/LoginFormContext';

export default function backdrop({ onClick, children, loginTemp, saveLoginInfo }) {

  // Detect global keypress events and toggled off modal if active
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        onClick();
      }
    } , true)
  })

  return (
    <div 
      className="absolute top-[100%] flex justify-evenly"
      onClick={onClick}
    >
      {/* gap-[xx rem] sets horizontal position of modal */}
      {/* Has an overlay outside of modal when active. Prevents first click-through but Google does this too so. */}
      <ul className="flex justify-evenly gap-[12.5rem] w-100% md:pt-3 w-[100vw] pb-[70vh] z-10">
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