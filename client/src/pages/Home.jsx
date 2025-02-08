import { Link } from "react-router-dom"
import { CloudUpload, FileText } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

function Home() {
  const name = localStorage.getItem("name");
  
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-400 dark:to-teal-400 text-transparent bg-clip-text animate-gradient">
            AWS Cloud Services
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl max-w-2xl">
            {name && <span className="font-bold">{`Welcome, ${name}!`}</span>}
            {name && <br />}
            Securely store, manage, and access your files from anywhere
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Link to="/upload" className="group">
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <CloudUpload className="w-6 h-6 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  Upload Files
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Upload new files to your cloud storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white">
                  Start Upload
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/files" className="group">
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 dark:hover:shadow-teal-400/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <FileText className="w-6 h-6 text-teal-500 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  View Files
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Access and manage your uploaded files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                  Browse Files
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Home

