'use client'
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";

// Example avatar list
const AVATARS = Array.from(
  { length: 9 },
  (_, i) => `/profileImage/i${i + 1}.png`
)

export interface AddPlayerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { id: "", name: string; image: string }) => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState(AVATARS[0]);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setName("");
      setImage(AVATARS[0]);
      setTouched(false);
    }
  }, [open]);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    onSubmit({ id: "", name: name.trim(), image })
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 overflow-hidden bg-slate-950/95 backdrop-blur-xl border-slate-800/50 max-w-md"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
      >
        {/* Corner Accents */}
        <div 
          className="absolute top-0 right-0 w-5 h-5"
          style={{ background: 'linear-gradient(135deg, transparent 50%, #06b6d4 50%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-5 h-5"
          style={{ background: 'linear-gradient(-45deg, transparent 50%, #8b5cf6 50%)' }}
        />

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div 
              className="p-2"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <DialogTitle className="text-xl font-bold font-mono uppercase tracking-wider text-white">
              Add Player
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 flex flex-col gap-6">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="player-name" 
              className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2"
            >
              Player Name <span className="text-red-400">*</span>
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter player name"
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:ring-0 focus:outline-none transition-all"
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
              required
              autoFocus
            />
            {touched && !name.trim() && (
              <span className="text-xs text-red-400 mt-1 block font-mono">[ ERROR ] Name is required.</span>
            )}
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Select Avatar
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Live Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-slate-500 uppercase">Preview</span>
                <motion.div
                  animate={{ boxShadow: ['0 0 20px rgba(6, 182, 212, 0.3)', '0 0 30px rgba(139, 92, 246, 0.3)', '0 0 20px rgba(6, 182, 212, 0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                  style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                    padding: '3px',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  }}
                >
                  <Image
                    src={image}
                    alt="Selected avatar preview"
                    className="w-20 h-20 object-cover bg-slate-900"
                    style={{
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                    }}
                    width={80}
                    height={80}
                  />
                </motion.div>
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-4 gap-2 max-h-32 sm:max-h-40 overflow-y-auto pr-1 flex-1">
                {AVATARS.map((img) => (
                  <motion.button
                    key={img}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative transition-all focus:outline-none ${
                      image === img
                        ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950"
                        : "hover:ring-1 hover:ring-slate-600"
                    }`}
                    style={{
                      clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    }}
                    onClick={() => setImage(img)}
                  >
                    <Image
                      src={img}
                      alt="Avatar option"
                      className="w-10 h-10 object-cover bg-slate-800"
                      style={{
                        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                      }}
                      width={40}
                      height={40}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-slate-950 font-bold font-mono uppercase tracking-wider text-base"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
            }}
          >
            Add Player
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerModal;
