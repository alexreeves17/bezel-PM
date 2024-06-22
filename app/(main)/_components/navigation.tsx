"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useRef, ElementRef, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trashbox } from "./trash-box";
import { useSearch } from "@/app/hooks/use-search";
import { useSettings } from "@/app/hooks/use-settings";
import { Navbar } from "./navbar";


export const Navigation = () => {
    const router = useRouter();
    const search = useSearch();
    const settings = useSettings();
    const params = useParams();
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);


//Check if user is on Mobile. If true, then hide sidebar. If isMobile state changes, reset and display sidebar again
    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

//Recognize when user is holding mouse1 down, and listen for two events: 1, mouse movement (left/right), and 2, release of mouse1
    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove",handleMouseMove);
        document.addEventListener("mouseup",handleMouseUp);
    };

//Adjust the sidebar display width while user is holding mouse1 and moving left/right. Set min/max boundaries 
    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100%-${newWidth})`);
        }
    }

//List for release of mouse1. When user releases mouse1, stop resizing, and remove event listeners
    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

//Create function to reset width to original. Set max width for mobile to 240px, else 100% of screen minus 240px. Set timeout for 300ms
    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : "calc(100%-240px)"
            );
            navbarRef.current.style.setProperty(
                "left",
                isMobile ? "100%" : "240px"
            );
            setTimeout(() => setIsResetting(false), 300);
        }
    }

//Create function to collapse sidebar width to 0. Set timeout for 300ms
    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width","100%");
            navbarRef.current.style.setProperty("left","0");
            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const handleCreate = () => {
        const promise = create({title: "Untitled"})
            .then((documentId) => router.push(`/documents/${documentId}`))
        toast.promise(promise, {
            loading: "Creating a new doc...",
            success: "Created a new doc",
            error: "Failed to create a new doc"
        })
    }

    return (
        <>
            <aside
             //Set sidebar style
                ref={sidebarRef}
                className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                {/*Create sidebar collapse button*/}
                <div
                    onClick={collapse}
                    role="button"
                    className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6"/>
                </div>


                <div>
                    <UserItem />
                    <Item
                        label="Settings"
                        icon={Settings}
                        onClick={settings.onOpen}
                    />

                    <Item
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={search.onOpen}
                    />

                    <Item
                        onClick={handleCreate}
                        label="New doc"
                        icon={PlusCircle}
                        />
                </div>

                <div className="mt-4">
                    <DocumentList />
                    <Item
                        onClick={handleCreate}
                        icon={Plus}
                        label="Add Doc"
                    />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 w-72"
                            side={isMobile ? "bottom" : "right"}>
                                <Trashbox />
                        </PopoverContent>
                    </Popover>
                </div>

                {/*Create sidebar boundary for resizing*/}
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>


            {/*Navbar*/}
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                <nav className="bg-transparent px-3 py-2 w-full">
                {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                </nav>
                )}
            </div>


        </>
    )
}