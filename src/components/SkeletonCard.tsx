import { motion } from "framer-motion";

const shimmer =
  "rounded-[1.8rem] border border-[#efe2cf] bg-white p-5 shadow-sm overflow-hidden";

const SkeletonCard = () => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 0%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div 
      className={shimmer}
      variants={shimmerVariants}
      animate="animate"
      style={{
        backgroundImage: "linear-gradient(90deg, #f3e6d3 0%, #f7ebda 50%, #f3e6d3 100%)",
        backgroundSize: "200% 100%",
      }}
    >
      <motion.div 
        className="aspect-square rounded-[1.4rem] bg-[#f3e6d3]"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="mt-5 space-y-3">
        <motion.div 
          className="h-3 w-24 rounded-full bg-[#f3e6d3]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div 
          className="h-8 w-2/3 rounded-full bg-[#f7ebda]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="h-4 w-full rounded-full bg-[#f7ebda]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div 
          className="h-4 w-5/6 rounded-full bg-[#f7ebda]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <div className="mt-6 flex gap-2">
        <motion.div 
          className="h-10 flex-1 rounded-full bg-[#f3e6d3]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="h-10 flex-1 rounded-full bg-[#f7ebda]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
      </div>
      <motion.div 
        className="mt-6 h-12 rounded-full bg-[#efe2cf]"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
      />
    </motion.div>
  );
};

export default SkeletonCard;
