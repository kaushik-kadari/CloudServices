import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, useTheme } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Upload from "./pages/Upload"
import Files from "./pages/Files"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ProtectedRoute from "./ProtectedRoute"
// import Sample from "./Sample"

function AppContent() {
  const { isDarkMode } = useTheme()
  const login = localStorage.getItem("login")

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/files" element={<Files />} />
          </Route>
          {/* <Route path="/" element={<Sample />} /> */}
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App

