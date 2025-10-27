import React from "react";
// Justin: I have updated this class to use Typescript for type checknig

type SidebarResizerProps = {
  collapsed: boolean;
  siderWidth: number;
  setSiderWidth: React.Dispatch<React.SetStateAction<number>>;
  min?: number; // optional
  max?: number; // optional
};

const SidebarResizer: React.FC<SidebarResizerProps> = ({
  collapsed,
  siderWidth,
  setSiderWidth,
  min = 200,
  max = 400,
}) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = siderWidth;

    const onMouseMove = (ev: MouseEvent) => {
      if (collapsed) return;
      const newWidth = startWidth + (ev.clientX - startX);
      if (newWidth >= min && newWidth <= max) {
        setSiderWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return <div onMouseDown={handleMouseDown} className="sidebar-drag-handle" />;
};

export default SidebarResizer;
