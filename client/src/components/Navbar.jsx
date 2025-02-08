import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { CloudIcon, LogOut, LogIn, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const login = localStorage.getItem("login");

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("login");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <CloudIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            AWS Cloud Services
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {login && (
            <Link
              to="/upload"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Upload
            </Link>
          )}
          {login && (
            <Link
              to="/files"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Files
            </Link>
          )}
          <Button
            variant="ghost"
            className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {/* <span className="ml-2">{isDarkMode ? "Light Mode" : "Dark Mode"}</span> */}
          </Button>
          {!login && (
            <Link
              to="/login"
            >
            <Button
              variant="ghost"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            </Link>
          )}
          {login && (
            <Button
              variant="ghost"
              className="text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
