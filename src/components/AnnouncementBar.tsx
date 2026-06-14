import React from "react";

interface AnnouncementBarProps {
  message: string;
}

export default function AnnouncementBar({ message }: AnnouncementBarProps) {
  if (!message) return null;
  
  return (
    <div id="announcement-bar" className="bg-pink-brand text-white text-[11px] py-2 px-4 text-center font-sans tracking-widest uppercase font-extrabold animate-pulse">
      {message}
    </div>
  );
}
