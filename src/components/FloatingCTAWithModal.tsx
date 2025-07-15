'use client'
import React, { useState } from "react";
import FloatingCTA from "./FloatingCTA";
import AddPlayerModal from "./modal/AddPlayerModal";

export default function FloatingCTAWithModal({ onSubmit }: { onSubmit: (data: { id : "" , name: string; image: string }) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingCTA onClick={() => setOpen(true)} />
      <AddPlayerModal open={open} onClose={() => setOpen(false)} onSubmit={onSubmit} />
    </>
  );
}
