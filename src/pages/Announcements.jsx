import React, { useState } from "react";
import Loader from "../components/Loader";

function Announcements() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="page-section">
      <div className="page-eyebrow-row">
        <span className="text-eyebrow">Announcements</span>
      </div>

      <div className="announcements-wrap">
        {loading && (
          <div className="announcements-loader">
            <Loader text="Fetching announcements..." />
          </div>
        )}
        <img
          src="https://github.com/Shubhajeetgithub/photos/blob/main/nalanda.jpeg?raw=true"
          alt="Nalanda announcements board"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`announcements-img ${loading ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
}

export default Announcements;
