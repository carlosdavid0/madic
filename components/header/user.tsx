"use client";

import { useEffect, useState } from "react";

export function User() {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        {/* Avatar skeleton */}
        <div className="h-[35px] w-[35px] rounded-full bg-zinc-700/50 animate-pulse" />

        {/* Name skeleton */}
        <div className="h-[14px] w-[80px] rounded-md bg-zinc-700/50 animate-pulse hidden lg:block" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src="https://github.com/carlosdavid0.png"
        alt="User"
        width={35}
        height={35}
        className="rounded-full"
      />
      <span className="text-md font-normal hidden lg:block">Carlos David</span>
    </div>
  );
}
