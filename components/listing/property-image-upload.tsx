"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  UploadIcon,
  XIcon,
  ImageIcon,
  StarIcon,
  GripVerticalIcon,
  Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
  isMain: boolean;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

interface PropertyImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  onUpload: (file: File) => Promise<{ fileId: string; fileUrl: string }>;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

export function PropertyImageUpload({
  images,
  onImagesChange,
  onUpload,
  maxImages = 40,
  maxFileSize = 10, // 10MB default
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  disabled = false,
}: PropertyImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempImage: UploadedImage = {
      id: tempId,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      isMain: images.length === 0, // First image is main
      uploading: true,
      progress: 0,
    };

    // Add temp image to show preview
    onImagesChange([...images, tempImage]);

    try {
      const { fileId, fileUrl } = await onUpload(file);
      
      // Update with actual uploaded data
      const uploadedImage: UploadedImage = {
        ...tempImage,
        id: fileId,
        url: fileUrl,
        uploading: false,
        progress: 100,
      };

      return uploadedImage;
    } catch (error) {
      console.error("Upload error:", error);
      // Remove failed upload
      onImagesChange(images.filter((img) => img.id !== tempId));
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);
      if (acceptedFiles.length > remainingSlots) {
        toast.warning(`Only uploading ${remainingSlots} images. Maximum ${maxImages} allowed.`);
      }

      // Validate files
      const validFiles: File[] = [];
      for (const file of filesToUpload) {
        if (file.size > maxFileSize * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${maxFileSize}MB limit`);
          continue;
        }
        if (!acceptedTypes.includes(file.type)) {
          toast.error(`${file.name} is not a supported image type`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);
      
      // Upload files sequentially to avoid overwhelming the server
      const uploadedImages: UploadedImage[] = [...images];
      
      for (const file of validFiles) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const tempImage: UploadedImage = {
          id: tempId,
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          isMain: uploadedImages.length === 0,
          uploading: true,
          progress: 0,
        };

        uploadedImages.push(tempImage);
        onImagesChange([...uploadedImages]);

        try {
          const { fileId, fileUrl } = await onUpload(file);
          
          // Update the temp image with actual data
          const index = uploadedImages.findIndex((img) => img.id === tempId);
          if (index !== -1) {
            uploadedImages[index] = {
              ...tempImage,
              id: fileId,
              url: fileUrl,
              uploading: false,
              progress: 100,
            };
            onImagesChange([...uploadedImages]);
          }
        } catch (error) {
          console.error("Upload error:", error);
          // Remove failed upload
          const index = uploadedImages.findIndex((img) => img.id === tempId);
          if (index !== -1) {
            uploadedImages.splice(index, 1);
            onImagesChange([...uploadedImages]);
          }
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setIsUploading(false);
    },
    [images, maxImages, maxFileSize, acceptedTypes, onUpload, onImagesChange, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": acceptedTypes.map((t) => `.${t.split("/")[1]}`),
    },
    disabled: disabled || isUploading || images.length >= maxImages,
    maxFiles: maxImages - images.length,
  });

  const removeImage = (imageId: string) => {
    const newImages = images.filter((img) => img.id !== imageId);
    // If removed image was main, set first remaining as main
    if (newImages.length > 0 && !newImages.some((img) => img.isMain)) {
      newImages[0].isMain = true;
    }
    onImagesChange(newImages);
  };

  const setMainImage = (imageId: string) => {
    const newImages = images.map((img) => ({
      ...img,
      isMain: img.id === imageId,
    }));
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          disabled || images.length >= maxImages
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <UploadIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-sm text-primary">Drop the images here...</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop images here, or click to browse
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || images.length >= maxImages}
            >
              Choose Files
            </Button>
          </>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, WEBP up to {maxFileSize}MB each. Maximum {maxImages} images.
        </p>
        <p className="text-xs text-muted-foreground">
          {images.length}/{maxImages} images uploaded
        </p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2",
                image.isMain ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border",
                image.uploading && "opacity-70"
              )}
            >
              {/* Image */}
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />

              {/* Loading Overlay */}
              {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2Icon className="h-8 w-8 text-white animate-spin" />
                </div>
              )}

              {/* Main Badge */}
              {image.isMain && !image.uploading && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                  <StarIcon className="h-3 w-3" />
                  Main
                </div>
              )}

              {/* Image Number */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Hover Actions */}
              {!image.uploading && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isMain && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setMainImage(image.id)}
                      className="h-8"
                    >
                      <StarIcon className="h-4 w-4 mr-1" />
                      Set Main
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                    className="h-8"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Drag Handle */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVerticalIcon className="h-5 w-5 text-white drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No images uploaded yet. The first image will be set as the main listing image.
          </p>
        </div>
      )}
    </div>
  );
}

export default PropertyImageUpload;
