import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

type UploadInteraction = "click" | "drop" | "change";

export const FileUpload = ({
  onChange,
  onRemove,
  onRequireAuth,
  files: controlledFiles,
}: {
  onChange?: (files: File[]) => void;
  onRemove?: () => void;
  onRequireAuth?: (interaction: UploadInteraction, files?: File[]) => Promise<boolean> | boolean;
  files?: File[];
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (controlledFiles === undefined) return;
    setFiles(controlledFiles);
  }, [controlledFiles]);

  const requestAuth = (interaction: UploadInteraction, candidateFiles?: File[]) => {
    if (!onRequireAuth) {
      return true as const;
    }

    try {
      const result = onRequireAuth(interaction, candidateFiles);

      if (typeof result === "boolean") {
        console.debug("[FileUpload] auth check completed", {
          interaction,
          allowed: result,
          fileCount: candidateFiles?.length ?? 0,
        });
        return result;
      }

      console.debug("[FileUpload] auth check pending", {
        interaction,
        fileCount: candidateFiles?.length ?? 0,
      });

      return Promise.resolve(result)
        .then((allowed) => {
          console.debug("[FileUpload] auth promise resolved", { interaction, allowed });
          return allowed;
        })
        .catch((error) => {
          console.error("[FileUpload] auth promise rejected", { interaction, error });
          return false;
        });
    } catch (error) {
      console.error("[FileUpload] auth check threw", { interaction, error });
      return false as const;
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    console.debug("[FileUpload] accepting files", {
      names: newFiles.map((file) => file.name),
      count: newFiles.length,
    });
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    onRemove && onRemove();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: (acceptedFiles, fileRejections, event) => {
      const authResult = requestAuth("drop", acceptedFiles);

      const prevent = () => {
        event.preventDefault();
        event.stopPropagation?.();
      };

      if (authResult === true) {
        console.debug("[FileUpload] drop permitted", { count: acceptedFiles.length });
        handleFileChange(acceptedFiles);
        return;
      }

      if (authResult === false) {
        console.debug("[FileUpload] drop blocked; auth required");
        prevent();
        return;
      }

      authResult.then((allowed) => {
        if (!allowed) {
          console.debug("[FileUpload] drop denied after async auth");
          prevent();
          return;
        }

        console.debug("[FileUpload] drop allowed after async auth", { count: acceptedFiles.length });
        handleFileChange(acceptedFiles);
      });
    },
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.label
        htmlFor="file-upload-handle"
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onClickCapture={(event) => {
            const authResult = requestAuth("click");

            if (authResult === true) {
              console.debug("[FileUpload] click permitted");
              return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (authResult === false) {
              console.debug("[FileUpload] click blocked; auth required");
              return;
            }

            authResult.then((allowed) => {
              if (!allowed) {
                console.debug("[FileUpload] click denied after async auth");
                return;
              }

              console.debug(
                "[FileUpload] auth completed after click; user must click again to open picker"
              );
            });
          }}
          onChange={async (e) => {
            const pendingFiles = Array.from(e.target.files || []);
            const authResult = requestAuth("change", pendingFiles);

            if (authResult === true) {
              handleFileChange(pendingFiles);
              return;
            }

            if (authResult === false) {
              console.debug("[FileUpload] change blocked; auth required");
              e.target.value = "";
              return;
            }

            const allowed = await authResult;
            if (!allowed) {
              console.debug("[FileUpload] change denied after async auth");
              e.target.value = "";
              return;
            }

            handleFileChange(pendingFiles);
          }}
          className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0"
          accept="audio/mpeg,audio/wav,audio/aac,audio/ogg,audio/flac,audio/x-aiff"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload your audio
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Click to upload, or drag and drop your music. Max 50MB. MP3, WAV, AAC, OGG, FLAC, or AIFF.
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-neutral-900/50 backdrop-blur-sm flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "border border-neutral-800"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <div className="flex items-center gap-2">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-400 bg-neutral-800 shadow-input"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                      <button
                        onClick={handleRemove}
                        className="p-1 rounded-full hover:bg-red-500/20 transition-colors group/remove"
                      >
                        <X className="w-4 h-4 text-neutral-400 group-hover/remove:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-neutral-800"
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.label>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
} 
