import { useState, useEffect } from "react";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  // Fetch files
  useEffect(() => {
    axios.get("http://localhost:5000/files").then((res) => {
      console.log(res.data);
      setFiles(res.data);
    });
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    try {
        if (!file) return;
        console.log(file);
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("http://localhost:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        setFile(null);
        // window.location.reload();

    } catch (error) {
        console.error("Upload Error:", error);
    }
  };

  // Handle file download
  const handleDownload = (id) => {
    window.open(`http://localhost:5000/download/${id}`, "_blank");
  };

  // Handle file delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/delete/${id}`);
    setFiles(files.filter((file) => file._id !== id));
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
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="ml-2 bg-blue-500 text-white px-4 py-2">Upload</button>

      <ul className="mt-4">
        <li className="flex justify-between items-center p-2 border">
          <span>Name</span>
          <span>Type</span>
          <span>Size</span>
          <span>Upload Date</span>
          <span>Actions</span>
        </li>
        {files.map((file) => (
          <li key={file.id} className="flex justify-between items-center p-2 border">
            <span>{file.name}</span>
            <span>{file.type}</span>
            <span>{formatFileSize(file.size)}</span>
            <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
            <div>
              <button onClick={() => handleDownload(file.id)} className="bg-green-500 text-white px-2 py-1 mr-2">Download</button>
              <button onClick={() => handleDelete(file.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
