"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItems } from "./user-items";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const documents = useQuery(api.documents.get);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [isResetting, setIsReseting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  //sidebar disappears on mobile
  useEffect(() => {
    if (isMobile) {
        collapse();
    } else {
        resetWidth();
    }
  }, [isMobile])

  //pathname changes
  useEffect(() => {
    if (isMobile) {
        collapse();
    }
  }, [pathname, isMobile]);

  //check if the sidebar is collapsed
  const handleMouseDown = ( event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  //resize the sidebar
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    //how much can use resize
    if (newWidth < 240) newWidth = 240; //minimum
    if (newWidth > 480) newWidth = 480; //maximum

    if (sidebarRef.current && navbarRef.current) {
        sidebarRef.current.style.width = `${newWidth}px`;
        navbarRef.current.style.setProperty("left", `${newWidth}px`);
        navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
    
  }

  //stop resizing
  const handleMouseUp = (event: MouseEvent) => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  //resetting width by clicking on the scroller
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsReseting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
      navbarRef.current.style.setProperty("left", isMobile ? "0" : "240px");

      setTimeout(() => setIsReseting(false), 300);
    }
  }

  //collapse the sidebar
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
        setIsCollapsed(true);
        setIsReseting(true);

        sidebarRef.current.style.width = "0";
        navbarRef.current.style.setProperty("width", "100%");
        navbarRef.current.style.setProperty("left", "0");
        setTimeout(() => setIsReseting(false), 300);
    }
  }

  return (
    <> {/* ✅ Fragment opened here */}
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar bg-secondary h-full overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          ref={navbarRef}
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition cursor-pointer",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItems />
        </div>

        <div className="mt-4">
          {documents?.map((document) => (
            <p key={document._id}>
              {document.title}
            </p>
          ))}
        </div>

        <div 
            onMouseDown={handleMouseDown}
            onClick={resetWidth}
        
            className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
      </aside>

      <div ref = {navbarRef}
           className={cn(
            "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
            isResetting && "transition-all ease-in-out duration-300",
            isMobile && "w-full left-0"
           )}
      >
        <nav className= "bg-trasparent px-3 py-2 w-full">
            {isCollapsed && <MenuIcon onClick={resetWidth} role="Button" className= "h-6 w-6 text-muted-foreground"/>}
        </nav>
        
      </div>
    </>
  );
};
