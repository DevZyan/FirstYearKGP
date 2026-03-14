import React from "react";

export default function Loader({ size = 40, text = "Loading..." }) {
  return (
    <div className="loader-wrap">
      <div className="loader-ring" style={{ width: size, height: size }} />
      <span className="loader-text">{text}</span>
    </div>
  );
}
