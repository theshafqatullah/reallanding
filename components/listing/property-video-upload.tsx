"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  UploadIcon,
  XIcon,
  VideoIcon,
  PlayCircleIcon,
  Loader2Icon,
  FileVideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedVideo {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
  uploading?: boolean;
  progress?: number;
  error?: string;
  thumbnail?: string;
}

interface PropertyVideoUploadProps {
  videos: UploadedVideo[];
  onVideosChange: (videos: UploadedVideo[]) => void;
  onUpload: (file: File) => Promise<{ fileId: string; fileUrl: string }>;
  maxVideos?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

export function PropertyVideoUpload({
  videos,
  onVideosChange,
  onUpload,
  maxVideos = 5,
  maxFileSize = 100, // 100MB default for videos
  acceptedTypes = ["video/mp4", "video/webm", "video/quicktime"],
  disabled = false,
}: PropertyVideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      const remainingSlots = maxVideos - videos.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxVideos} videos allowed`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);
      if (acceptedFiles.length > remainingSlots) {
        toast.warning(`Only uploading ${remainingSlots} videos. Maximum ${maxVideos} allowed.`);
      }

      // Validate files
      const validFiles: File[] = [];
      for (const file of filesToUpload) {
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${maxFileSize}MB limit`);
          continue;
        }
        if (!acceptedTypes.includes(file.type)) {
          toast.error(`${file.name} is not a supported video type`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);

      // Upload files sequentially
      const uploadedVideos: UploadedVideo[] = [...videos];

      for (const file of validFiles) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const tempVideo: UploadedVideo = {
          id: tempId,
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          uploading: true,
          progress: 0,
        };

        uploadedVideos.push(tempVideo);
        onVideosChange([...uploadedVideos]);

        try {
          const { fileId, fileUrl } = await onUpload(file);

          // Update the temp video with actual data
          const index = uploadedVideos.findIndex((vid) => vid.id === tempId);
          if (index !== -1) {
            uploadedVideos[index] = {
              ...tempVideo,
              id: fileId,
              url: fileUrl,
              uploading: false,
              progress: 100,
            };
            onVideosChange([...uploadedVideos]);
          }
        } catch (error) {
          console.error("Upload error:", error);
          // Remove failed upload
          const index = uploadedVideos.findIndex((vid) => vid.id === tempId);
          if (index !== -1) {
            uploadedVideos.splice(index, 1);
            onVideosChange([...uploadedVideos]);
          }
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setIsUploading(false);
    },
    [videos, maxVideos, maxFileSize, acceptedTypes, onUpload, onVideosChange, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": acceptedTypes.map((t) => `.${t.split("/")[1]}`),
    },
    disabled: disabled || isUploading || videos.length >= maxVideos,
    maxFiles: maxVideos - videos.length,
  });

  const removeVideo = (videoId: string) => {
    const newVideos = videos.filter((vid) => vid.id !== videoId);
    onVideosChange(newVideos);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          disabled || videos.length >= maxVideos
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <VideoIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-sm text-primary">Drop the videos here...</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop videos here, or click to browse
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || videos.length >= maxVideos}
            >
              Choose Videos
            </Button>
          </>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          MP4, WEBM, MOV up to {maxFileSize}MB each. Maximum {maxVideos} videos.
        </p>
        <p className="text-xs text-muted-foreground">
          {videos.length}/{maxVideos} videos uploaded
        </p>
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={cn(
                "relative flex items-center gap-4 p-4 border rounded-lg",
                video.uploading && "opacity-70"
              )}
            >
              {/* Video Thumbnail/Preview */}
              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {video.uploading ? (
                  <Loader2Icon className="h-6 w-6 text-muted-foreground animate-spin" />
                ) : (
                  <>
                    <video
                      src={video.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                    />
                    <PlayCircleIcon className="h-8 w-8 text-white/80 drop-shadow-lg z-10" />
                  </>
                )}
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileVideoIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm font-medium truncate">{video.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(video.size)}
                </p>
                {video.uploading && (
                  <div className="mt-2">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${video.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading...
                    </p>
                  </div>
                )}
              </div>

              {/* Video Number */}
              <div className="text-xs text-muted-foreground">
                #{index + 1}
              </div>

              {/* Remove Button */}
              {!video.uploading && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeVideo(video.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <VideoIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No videos uploaded yet. Videos help your listing stand out!
          </p>
        </div>
      )}
    </div>
  );
}

export default PropertyVideoUpload;
