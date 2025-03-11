"use client"

import { motion } from "framer-motion"
import { IconBrain } from "@tabler/icons-react"

export default function Loader() {
  return (
    <div className="flex items-start space-x-2 max-w-[80%]">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
        <IconBrain className="h-5 w-5 text-primary" />
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex space-x-2">
          <motion.div className="flex space-x-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 rounded-full bg-primary/70"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: dot * 0.2,
                }}
              />
            ))}
          </motion.div>

          <div className="text-sm text-muted-foreground">Processing...</div>
        </div>
      </div>
    </div>
  )
}

