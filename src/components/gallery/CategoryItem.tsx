import Image from "next/image";
import Link from "next/link";
import { truncate } from "@/lib/utils";

type Props = {
  gallery: Gallery;
  inCategory?: boolean;
};

const GalleryCategoryItem = ({ gallery, inCategory }: Props) => {
  let inCat = false;
  if (inCategory != undefined) {
    inCat = inCategory;
  }
  const catHref =
    "/gallery/category/" +
    gallery.GalleryCategory?.id +
    "/" +
    gallery.GalleryCategory?.slug;

  const previewEntry: Entry =
    gallery.Entry[Math.floor(Math.random() * gallery?.Entry.length)];
  
  return (
    <div className="rounded border-2 border-primary bg-base-300 p-4 overflow-hidden shadow-xl text-center">
      {previewEntry.thumb.trim() === "" ? (
        <Image
          src={`/images/galleries/${previewEntry.path}`}
          width={100}
          height={100}
          className="w-100 h-100"
          alt={"entry-" + previewEntry.id}
        />
      ) : (
        <Image
          src={`/images/thumbnails/${previewEntry.thumb}`}
          width={100}
          height={100}
          className="w-100 h-100"
          alt={"entry-" + previewEntry.id}
        />
      )}

      <div className="font-bold text-xl mb-2">
        <Link
          href={"/gallery/gallery/" + gallery.id + "/" + gallery.slug}
          className="text-base-content"
        >
          {gallery.title}
        </Link>
      </div>

      {!inCat && (
        <div className="text-base-content text-base">
          In:
          <Link href={catHref} className="text-base-content">
            {gallery.GalleryCategory.name}
          </Link>
        </div>
      )}

      {gallery.description && (
        <div className="text-base-content text-base">{truncate(gallery.description)}</div>
      )}

      {gallery.Tags && (
        <div className="px-6 pt-4 pb-2">
          {gallery.Tags.map((tag: Tags, index: number) => (
            <span
              key={index}
              className="inline-block bg-accent rounded-full px-3 py-1 text-sm font-semibold text-accent-content mr-2 mb-2"
            >
              {tag.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryCategoryItem;
