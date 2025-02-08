"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, Download, Trash2, File } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import axios from "axios";

function Files() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/files");
      setFiles(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      setFiles(files.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleDownload = async (id) => {
    try {
      window.open(`http://localhost:5000/download/${id}`, "_blank");
    } catch (error) {
      console.error("Download Error:", error);
    }
  };

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`; // Bytes
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`; // Kilobytes
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; // Megabytes
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`; // Gigabytes
    }
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900 dark:text-slate-100">
            Your Files
          </CardTitle>
          <Button
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            onClick={() => navigate("/upload")}
          >
            <CloudUpload className="w-4 h-4 mr-2" />
            Upload More Files
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-100 hover:dark:bg-slate-800/50">
                  <TableHead className="text-slate-900 dark:text-slate-100">
                    Name
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-100">
                    Type
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-100">
                    Size
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-100">
                    Uploaded
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-100">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow
                    key={file.id}
                    className="hover:bg-slate-100 hover:dark:bg-slate-800/50"
                  >
                    <TableCell className="text-slate-300">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <File className="w-4 h-4 text-blue-400" />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {file.type}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {formatFileSize(file.size)}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDownload(file.id)}
                          className="text-blue-400 hover:text-blue-400 hover:bg-blue-400/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-400 hover:text-red-400 hover:bg-red-400/10" 
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default Files;
