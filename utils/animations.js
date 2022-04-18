const ease = [0.175, 0.85, 0.42, 0.96];

export const overlayVariants = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  transition: { ease }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  transition: { ease }
};

export const sideModalVariants = {
  hidden: { opacity: 0, x: 100, transition: { duration: 0.1 } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  transition: { ease }
};

export const menuVariants = {
  hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  transition: { ease }
};
