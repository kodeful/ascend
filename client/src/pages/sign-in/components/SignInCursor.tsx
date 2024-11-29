import React, { useEffect, useRef } from "react";
import { alpha, Box, useTheme } from "@mui/material";

import { useCursorStore } from "./CursorStore";

let mouse = useCursorStore.getState().mouse;
const CursorFollow = () => {
  const theme = useTheme();
  const followerRef = useRef<any>(null);

  useEffect(() => {
    let currentX = useCursorStore.getState().mouse.x;
    let currentY = useCursorStore.getState().mouse.y;

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      currentX += (mouse.x - currentX) * 0.065;
      currentY += (mouse.y - currentY) * 0.065;

      if (followerRef.current) {
        followerRef.current.style.left = `${currentX}px`;
        followerRef.current.style.top = `${currentY}px`;
      }

      requestAnimationFrame(animate); // Recursive animation loop
    };

    document.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      useCursorStore.getState().setMouse(mouse);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Box
      ref={followerRef}
      sx={{
        position: "fixed",
        width: "100px",
        height: "100px",
        opacity: 0.5,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1,
        backdropFilter: "blur(10px)",
        transform: "translate(-50%, -50%)",

        animation: "pulse-cursor 9s infinite",
        "@keyframes pulse-cursor": {
          "0%": {
            width: "100px",
            height: "100px",
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            boxShadow: `0px 0px 20px ${alpha(theme.palette.primary.main, 0.7)}`,
          },
          "50%": {
            width: "120px",
            height: "120px",
            backgroundColor: alpha(theme.palette.primary.main, 0.5),
            boxShadow: `0px 0px 30px ${alpha(theme.palette.primary.main, 1)}`,
          },
          "100%": {
            width: "100px",
            height: "100px",
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            boxShadow: `0px 0px 20px ${alpha(theme.palette.primary.main, 0.7)}`,
          },
        },
      }}
    />
  );
};

export default CursorFollow;
