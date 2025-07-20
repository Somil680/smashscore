'use client'
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

// Example avatar list (replace with your actual avatar asset paths)
const AVATARS = Array.from(
  { length: 9 }, // Assuming you have more images, you can increase this length
  (_, i) => `/profileImage/i${i + 1}.png`
)

export interface AddPlayerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; image: string }) => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState(AVATARS[0]);
  console.log("🚀 ~ image:", image)
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
    onSubmit({ name: name.trim(), image })
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" rounded-2xl p-0 overflow-hidden bg-black m-4">
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Add Player</DialogTitle>
          {/* <DialogClose asChild>
            <button
              aria-label="Close"
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={onClose}
              type="button"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6"/></svg>
            </button>
          </DialogClose> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-6">
          <div>
            <label htmlFor="player-name" className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400 text-base bg-white dark:bg-[#171717]"
              required
              autoFocus
            />
            {touched && !name.trim() && (
              <span className="text-xs text-red-500 mt-1 block">Name is required.</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Choose Avatar</label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Live Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">Preview</span>
                <Image
                  src={image}
                  alt="Selected avatar preview"
                                  className="w-20 h-20 rounded-full border-4 border-lime-400 bg-white object-cover shadow-md"
                                  width={80}
                                    height={80}
                />
              </div>
              {/* Avatar Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-4 gap-2 max-h-32 sm:max-h-40 overflow-y-auto pr-1">
                {AVATARS.map((img) => (
                  <button
                    key={img}
                    type="button"
                    className={`rounded-full border-2  transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      image === img
                        ? "border-lime-400 ring-2 ring-lime-300"
                        : "border-transparent hover:border-blue-400"
                    }`}
                    onClick={() => setImage(img)}
                  >
                    <Image
                      src={img}
                      alt="Avatar option"
                            className="w-10 h-10 rounded-full object-cover"
                            width={40}
                            height={40}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-semibold rounded-lg py-2.5 mt-2 shadow-lg hover:scale-[1.03] transition-transform text-base"
          >
            Add Player
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayerModal;
