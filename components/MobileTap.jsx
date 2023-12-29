import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
const MobileTap = (props) => {
  if (isMobile)
    return (
      <motion.button
        whileTap={{ scale: 0.85 }}
        {...props}
      >
        {props.children}
      </motion.button>
    );
  else return <button {...props}>{props.children}</button>;
};

export default MobileTap;
