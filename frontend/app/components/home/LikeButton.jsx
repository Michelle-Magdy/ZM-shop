"use client";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  function toggleLike() {
    setLiked(() => !liked);
  }
  let cssClass;
  if (liked) {
    cssClass =
      " bg-white rounded-full w-7 h-7 shadow-lg flex justify-center items-center p-1 hover:cursor-pointer absolute top-2 right-2 transition-all duration-300 ease-in-out";
  } else {
    cssClass =
      "bg-white dark:bg-primary rounded-full w-7 h-7 shadow-lg flex justify-center items-center p-1 hover:cursor-pointer absolute top-2 right-2 lg:-right-10 transition-all duration-300 ease-in-out group-hover:right-2";
  }
  return (
    <button className={cssClass} onClick={toggleLike}>
      {liked && <FaHeart className="hover:cursor-pointer text-primary" />}
      {!liked && <FaRegHeart />}
    </button>
  );
}
