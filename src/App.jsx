import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const App = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = window.localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [isDark, theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const navItems = [
    { id: 1, name: "Home", route: "/" },
    { id: 2, name: "TimeTable", route: "/TimeTable" },
    { id: 3, name: "Announcements", route: "/Announcements" },
    { id: 4, name: "Resources", route: "/Resources" },
  ];

  return (
    <div className="app-root">
      <div className="noise-overlay" />

      <header className="site-header">
        <div className="header-inner">
          <div className="header-eyebrow">IIT Kharagpur · AIML</div>
          <h1 className="header-title">
            <span className="title-main">AI</span>
            <span className="title-year">2024</span>
          </h1>
          <p className="header-subtitle">Department of Artificial Intelligence</p>
          <div className="header-rule" />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle light/dark theme"
        >
          <span className="toggle-icon">{isDark ? <SunIcon /> : <MoonIcon />}</span>
          <span className="toggle-label">{isDark ? "Light" : "Dark"}</span>
        </button>
      </header>

      <nav className="site-nav">
        {navItems.map((item) => (
          <NavLink
            to={item.route}
            key={item.id}
            className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="nav-divider" />

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
