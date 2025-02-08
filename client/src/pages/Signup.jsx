"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { UserPlus } from "lucide-react"
import axios from "axios"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [error, setError] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(false)

    const formData = {
      name,
      email,
      password,
    }

    try {
      const res = await axios.post("http://localhost:5000/signup", formData)
      // console.log(res.data)
      setMessage(res.data.message)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Signup Error:", error)
      setError(true)
      setMessage(error.response.data.message)
    }
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <UserPlus className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {message && (
              <Alert variant={error ? "destructive" : "default"}>
                <AlertDescription className={`text-center ${error ? "text-red-700" : "text-green-700"}`}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
            >
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-center text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 dark:text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>

      </Card>
      
    </main>
  )
}

export default Signup

