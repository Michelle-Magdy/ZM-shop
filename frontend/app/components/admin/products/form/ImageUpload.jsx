// src/components/admin/products/form/ImageUpload.jsx
"use client";

import { useRef, useState } from "react";
import { Upload, X, Star, GripVertical } from "lucide-react";
import Image from "next/image";
import { IMAGES_BASE_URL } from "@/lib/apiConfig";

export const ImageUpload = ({
  images, // Array of { file?: File, url: string, id?: string } or string (legacy)
  onImagesChange, // (images: Array<{file?: File, url: string}>) => void
  onCoverChange, // (cover: {file?: File, url: string}) => void
  coverImage, // Current cover: {file?: File, url: string} or string (legacy)
  maxImages = 5,
  isCover = false,
  isEdit = false,
}) => {
  const fileInputRef = useRef(null);

  // Helper to normalize image to object format
  const normalizeImage = (img) => {
    if (typeof img === "string") return { url: img };
    if (img && typeof img === "object") return img;
    return { url: "" };
  };

  // Helper to get display URL
  const getDisplayUrl = (img) => {
    const normalized = normalizeImage(img);
    if (normalized.url?.startsWith("blob:") || normalized.url.includes("media-amazon")) 
      return normalized.url;
    if (isEdit && normalized.url && !normalized.file) {
      return `${IMAGES_BASE_URL}/products/${normalized.url}`;
    }
    return normalized.url;
  };

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);

    // Create object URLs for preview
    const newImageObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    if (isCover) {
      // Cover mode: replace single image
      onImagesChange(newImageObjects.slice(0, 1));
      onCoverChange(newImageObjects[0]);
    } else {
      // Gallery mode: append up to max
      const currentImages = Array.isArray(images) ? images : [];
      const combined = [...currentImages, ...newImageObjects].slice(
        0,
        maxImages,
      );
      onImagesChange(combined);

      // Auto-set first image as cover if no cover exists
      const currentCover = normalizeImage(coverImage);
      if (!currentCover.url && combined.length > 0) {
        onCoverChange(combined[0]);
      }
    }
  };

  const handleRemove = (index) => {
    const currentImages = Array.isArray(images) ? images : [];
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // If we removed the cover, set new cover
    const removedImage = normalizeImage(currentImages[index]);
    const currentCover = normalizeImage(coverImage);

    if (removedImage.url === currentCover.url) {
      onCoverChange(newImages[0] || { url: "" });
    }
  };

  const handleSetCover = (image) => {
    onCoverChange(image);
  };

  // Drag and drop handlers
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const currentImages = Array.isArray(images) ? [...images] : [];
    const [dragged] = currentImages.splice(dragIndex, 1);
    currentImages.splice(index, 0, dragged);

    onImagesChange(currentImages);
    setDragIndex(index);
  };

  const displayImages = isCover
    ? coverImage
      ? [normalizeImage(coverImage)]
      : []
    : Array.isArray(images)
      ? images.map(normalizeImage)
      : [];

  const coverNormalized = normalizeImage(coverImage);

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-(--color-badge)/50 rounded-xl p-8 text-center cursor-pointer hover:border-(--color-primary)/50 transition-colors"
      >
        <Upload
          className="mx-auto mb-3 text-(--color-secondary-text)"
          size={32}
        />
        <p className="text-sm font-medium">
          {isCover ? "Upload cover image" : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-(--color-secondary-text) mt-1">
          PNG, JPG up to 5MB
          {!isCover && ` (${displayImages.length}/${maxImages})`}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={!isCover}
          onChange={handleFilesSelect}
          className="hidden"
        />
      </div>

      {/* Image Grid */}
      {displayImages.length > 0 && (
        <div
          className={`grid gap-3 ${isCover ? "grid-cols-1" : "grid-cols-4 sm:grid-cols-6"}`}
        >
          {displayImages.map((image, index) => {
            const displayUrl = getDisplayUrl(image);
            const isCurrentCover = coverNormalized.url === image.url;

            return (
              <div
                key={`${image.url}-${index}`}
                draggable={!isCover}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={() => setDragIndex(null)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${
                  isCurrentCover
                    ? "border-(--color-primary)"
                    : "border-(--color-badge)/30"
                } ${dragIndex === index ? "opacity-50" : ""}`}
              >
                {displayUrl && (
                  <Image
                    src={displayUrl}
                    alt={`Product ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}

                {/* Cover Badge */}
                {isCurrentCover && (
                  <div className="absolute top-1 left-1 bg-(--color-primary) text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    Cover
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isCover && !isCurrentCover && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(image);
                      }}
                      className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg"
                      title="Set as cover"
                    >
                      <Star size={16} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>

                {!isCover && (
                  <div className="absolute bottom-1 right-1 p-1 bg-black/30 text-white rounded opacity-0 group-hover:opacity-100">
                    <GripVertical size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
