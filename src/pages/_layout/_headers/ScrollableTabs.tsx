import React, { useState, useRef } from "react";
import { Tabs, Tab, IconButton, Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const ScrollableTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (tabRef.current) {
      const scrollAmount = 150;
      tabRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <Box display="flex" alignItems="center" width="100%">
      {/* Nút lùi */}
      <IconButton onClick={() => handleScroll("left")}>
        <ChevronLeft />
      </IconButton>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue: number) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        ref={tabRef}
        sx={{ flexGrow: 1 }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <Tab key={index} label={`Tab ${index + 1}`} />
        ))}
      </Tabs>

      {/* Nút tiến */}
      <IconButton onClick={() => handleScroll("right")}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default ScrollableTabs;
