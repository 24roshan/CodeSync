import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
    >
      {isDark ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
