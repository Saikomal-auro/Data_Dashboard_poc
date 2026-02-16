"use client";
import { useState, useCallback, useEffect } from "react";

export function useMobileChat(defaultHeight: number = 50) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHeight, setChatHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const startY = e.clientY;
    const startHeight = chatHeight;

    const handleDrag = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.min(
        Math.max(startHeight + (deltaY / window.innerHeight) * 100, 20),
        90
      );
      setChatHeight(newHeight);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  }, [chatHeight]);

  return {
    isChatOpen,
    setIsChatOpen,
    chatHeight,
    setChatHeight,
    isDragging,
    handleDragStart,
  };
}