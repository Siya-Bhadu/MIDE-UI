import React from "react";

type ButtonVariant = "primary" | "success" | "danger" | "secondary";

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;      // choose from preset styles
  padding?: string;
  borderRadius?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  padding = "10px",
  borderRadius = "5px",
  disabled = false,
  onClick,
}) => {
  // map variants to color palettes
  const backgroundMap: Record<ButtonVariant, string> = {
    primary: "#007bff",   // blue
    success: "#28a745",   // green
    danger: "#dc3545",    // red
    secondary: "#6c757d", // gray
  };

  const backgroundColor = backgroundMap[variant];

  return (
    <button
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#b0b0b0" : backgroundColor,
        color: "white",
        padding,
        border: "none",
        borderRadius,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background-color 0.2s ease",
      }}
      onClick={!disabled ? onClick : undefined}
      onMouseOver={e => (e.currentTarget.style.opacity = "0.8")}
      onMouseOut={e => (e.currentTarget.style.opacity = disabled ? "0.6" : "1")}
    >
      {label}
    </button>
  );
};

export default Button;
