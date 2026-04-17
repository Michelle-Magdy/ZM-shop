// src/components/admin/products/form/ImageUpload.jsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, Star, GripVertical } from "lucide-react";
import Image from "next/image";

export const ImageUpload = ({
  images,
  coverImage,
  onImagesChange,
  onCoverChange,
  maxImages = 8,
}) => {
  const [dragIndex, setDragIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    // TODO: Upload files to server and get URLs
    // For now, create object URLs
    const newImages = files.map((file) => URL.createObjectURL(file));
    onImagesChange([...images, ...newImages].slice(0, maxImages));
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    if (coverImage === images[index]) {
      onCoverChange(newImages[0] || "");
    }
  };

  const handleSetCover = (image) => {
    onCoverChange(image);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newImages = [...images];
    const dragged = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, dragged);

    onImagesChange(newImages);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-(--color-primary-text)">
        Product Images
        <span className="text-(--color-error) ml-1">*</span>
      </label>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-(--color-badge)/50 rounded-xl p-8 text-center cursor-pointer hover:border-(--color-primary)/50 hover:bg-(--color-primary)/5 transition-colors"
      >
        <Upload
          className="mx-auto mb-3 text-(--color-secondary-text)"
          size={32}
        />
        <p className="text-sm text-(--color-primary-text) font-medium">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-(--color-secondary-text) mt-1">
          PNG, JPG up to 5MB each ({images.length}/{maxImages})
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-move group ${
                coverImage === image
                  ? "border-(--color-primary)"
                  : "border-(--color-badge)/30"
              } ${dragIndex === index ? "opacity-50" : ""}`}
            >
              <Image
                src={image}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Cover Badge */}
              {coverImage === image && (
                <div className="absolute top-1 left-1 bg-(--color-primary) text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  Cover
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {coverImage !== image && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetCover(image);
                    }}
                    className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
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
                  className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                  title="Remove"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drag Handle */}
              <div className="absolute bottom-1 right-1 p-1 bg-black/30 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-(--color-secondary-text)">
        Drag to reorder. First image is automatically set as cover unless
        changed.
      </p>
    </div>
  );
};
