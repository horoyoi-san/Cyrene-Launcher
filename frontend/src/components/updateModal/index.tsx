import { motion } from "framer-motion"

interface UpdateModalProps {
  isOpen: boolean
  title: string
  message: string
  buttons: {
    text: string
    onClick: () => Promise<void> | void
    variant?: "primary" | "error" | "outline"
  }[]
  onClose: () => void
}

export default function UpdateModal({ isOpen, title, message, buttons, onClose }: UpdateModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-5xl 
bg-base-100/20 backdrop-blur-lg 
text-base-content 
rounded-xl 
border border-white/20 
shadow-xl shadow-purple-500/10
">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="btn btn-circle btn-md btn-error absolute right-3 top-3"
          onClick={onClose}
        >
          ✕
        </motion.button>

        <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
          <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
            {title}
          </h3>
        </div>

        <div className="px-6 pb-6">
          <div className="mb-6">
            <p className="text-accent text-lg">{message}</p>
          </div>

          <div className="flex justify-end gap-3">
            {buttons.map((btn, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn ${btn.variant === "primary"
                    ? "btn-primary bg-gradient-to-r from-orange-200 to-red-400 border-none"
                    : btn.variant === "error"
                      ? "btn-error"
                      : "btn-outline btn-error"
                  }`}
                onClick={btn.onClick}
              >
                {btn.text}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
