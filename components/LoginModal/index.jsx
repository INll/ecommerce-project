import { motion } from "framer-motion";
import React from 'react';
import Backdrop from '../Backdrop/index';
import LoginForm from '../LoginForm/index';


// Define multiple stages as one 'variant' object
const dropIn = {
  hidden: {
    y: '-10vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 2,
      type: 'spring',
      damping: 90,
      stiffness: 2200,
    },
  },
  exit: {
    y: '-2vh',
    opacity: 0,
    transition: {
      duration: 2,
      type: 'spring',
      damping: 90,
      stiffness: 2200,
    },
  }
}

export default function index({ handleClose }) {
  return (
  <Backdrop>
    <motion.div
      onClick={(e) => e.stopPropagation()}
      key='modal'
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={dropIn}
    >
      <LoginForm
        onClick={handleClose}
      />
    </motion.div>
  </Backdrop>
  )
}