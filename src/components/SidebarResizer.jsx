const SidebarResizer = ({ collapsed, siderWidth, setSiderWidth }) => {
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = siderWidth;

    const onMouseMove = (e) => {
      if (collapsed) return;
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 200 && newWidth < 400) {
        setSiderWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return <div onMouseDown={handleMouseDown} className="sidebar-drag-handle" />;
};

export default SidebarResizer;
