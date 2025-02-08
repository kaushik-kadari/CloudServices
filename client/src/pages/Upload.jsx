"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CloudUpload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import axios from "axios"

function Upload() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle") 
  const [existingFiles, setExistingFiles] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchExistingFiles()
  }, [])

  const fetchExistingFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/files")
      setExistingFiles(res.data)
    } catch (error) {
      console.error("Fetch Error:", error)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    // console.log(file)
    // console.log(existingFiles)

    // Check for duplicate file
    const isDuplicate = existingFiles.some((existingFile) => (existingFile.name + '.' + existingFile.type) == file.name)
    if (isDuplicate) {
      setStatus("error")
      return
    }

    setStatus("uploading")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setExistingFiles([...existingFiles, res.data])
    } catch (error) {
      console.error("Upload Error:", error)
    }

    setStatus("success")
    setFile(null)
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <CloudUpload className="w-6 h-6 text-blue-400" />
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-slate-800 dark:text-slate-200">
                Select File
              </Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null)
                  setStatus("idle")
                }}
                className="bg-slate-800 border-slate-700 text-slate-200 
             file:bg-slate-700 file:text-white file:border-none 
             file:rounded-lg file:px-4 file:py-1 file:mr-5 
             hover:file:bg-slate-600"
                disabled={status === "uploading"}
              />
            </div>

            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {file && existingFiles.some((existingFile) => (existingFile.name + '.' + existingFile.type) === file.name)
                    ? "A file with this name already exists. Please choose a different file."
                    : "Upload failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>File uploaded successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className={`flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white ${
                  !file || status === "uploading" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
                disabled={!file || status === "uploading"}
              >
                {status === "uploading" ? "Uploading..." : "Upload"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/files")}
                className="text-slate-100 hover:bg-red-400 bg-red-500 hover:text-slate-100"
                disabled={!file || status === "uploading"}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default Upload

