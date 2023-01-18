import { motion } from "framer-motion";

import React from 'react'

export default function index({ children }) {
  return (
    <div className="absolute top-[100%] flex justify-evenly">
      {/* gap-[xx rem] sets position of modal */}
      <ul className="flex justify-evenly gap-[12.5rem] w-100% md:pt-3 w-[100vw]">
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
