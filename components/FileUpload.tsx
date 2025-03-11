"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { IconCloudUpload, IconFile, IconFileText, IconTable, IconFilePlus } from "@tabler/icons-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isUploading: boolean
}

export default function FileUpload({ onFileSelect, isUploading }: FileUploadProps) {
  const [isDropzoneOpen, setIsDropzoneOpen] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
        setIsDropzoneOpen(false)
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt", ".fasta"],
      "application/pdf": [".pdf"],
    },
    disabled: isUploading,
    maxFiles: 1,
  })

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "csv":
        return <IconTable className="h-6 w-6 text-green-400" />
      case "txt":
      case "fasta":
        return <IconFileText className="h-6 w-6 text-blue-400" />
      case "pdf":
        return <IconFile className="h-6 w-6 text-red-400" />
      default:
        return <IconFilePlus className="h-6 w-6 text-gray-400" />
    }
  }

  return (
    <>
      <div className="mb-3 flex items-center">
        <motion.button
          type="button"
          onClick={() => setIsDropzoneOpen((prev) => !prev)}
          disabled={isUploading}
          className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconCloudUpload className="h-5 w-5 text-primary" />
          <span>Upload genomic file</span>
        </motion.button>

        <div className="ml-4 text-xs text-muted-foreground">Supported: CSV, FASTA, TXT, PDF</div>
      </div>

      <AnimatePresence>
        {isDropzoneOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-card/30"
              }`}
            >
              <input {...getInputProps()} />

              <motion.div
                animate={{
                  y: isDragActive ? [-10, 0, -10] : 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isDragActive ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "loop",
                }}
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <IconCloudUpload className="h-12 w-12 text-primary/70" />
                    {isDragActive && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 0 10px rgba(59, 130, 246, 0.1)",
                            "0 130,246,0)",
                            "0 0 0 10px rgba(59, 130, 246, 0.1)",
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              {isDragActive ? (
                <p className="text-primary">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-foreground mb-1">Drag & drop a genomic file here, or click to select</p>
                  <p className="text-xs text-muted-foreground">For analysis of genomic data and oncology research</p>

                  <div className="mt-4 flex justify-center space-x-6">
                    <div className="flex flex-col items-center">
                      {getFileIcon("csv")}
                      <span className="text-xs mt-1 text-muted-foreground">CSV</span>
                    </div>
                    <div className="flex flex-col items-center">
                      {getFileIcon("txt")}
                      <span className="text-xs mt-1 text-muted-foreground">TXT/FASTA</span>
                    </div>
                    <div className="flex flex-col items-center">
                      {getFileIcon("pdf")}
                      <span className="text-xs mt-1 text-muted-foreground">PDF</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

