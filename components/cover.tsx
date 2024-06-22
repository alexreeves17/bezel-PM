"use client";
import Image              from "next/image";
import { useParams }      from "next/navigation";
import { useMutation }    from "convex/react";
import { ImageIcon, X }   from "lucide-react";
import { useCoverImage }  from "@/app/hooks/use-cover-image";
import { api }            from "@/convex/_generated/api";
import { Id }             from "@/convex/_generated/dataModel";
import { useEdgeStore }   from "@/lib/edgestore";
import { cn }             from "@/lib/utils";
import { Button }         from "@/components/ui/button";
import { Skeleton }       from "@/components/ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({
  url,
  preview
}: CoverImageProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      });
      removeCoverImage({
        id: params.documentId as Id<"documents">,
      });
    }
  }

  return (
  /* Adjust  cover image area if cover exists */
    <div className={cn(
      "relative w-full h-[35vh] group",
      !url && "h-[12vh]",
      url && "bg-muted"
    )}>
{/* Display cover image for all viewers */}
    {!!url && (
      <Image
        src={url}
        fill
        alt="Cover"
        className="object-cover"
      />
    )}
{/* Only allow doc owner to change or remove cover*/}
      {url && !preview && (
        <div className="opacity-100 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
      {/* Replace cover button */}
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon />
            Change Cover
          </Button>
      {/* Remove button */}
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X />
            Remove
          </Button>
        </div>
        )}
    </div>
  )
}