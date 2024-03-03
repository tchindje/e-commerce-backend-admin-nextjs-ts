// components/ImagePreview.tsx
import React from "react";
import Image from "next/image";
import { ItemInterface, ReactSortable } from "react-sortablejs";

type Props = {
  images: any;
  setImages: any;
};

const ImagesPreview = ({ images, setImages }: Props) => {
  console.log(images, "images preview");

  return (
    <ReactSortable
      list={images}
      setList={setImages}
      className="flex flex-wrap gap-1"
    >
      {images.map((image: any) => {
        const src = image;
        return (
          <div key={image}>
            <Image
              src={`/upload/images/${src}`}
              alt={image}
              className="rounded-lg w-24 h-24"
              width={100}
              height={100}
            />
          </div>
        );
      })}
    </ReactSortable>
  );
};

export default ImagesPreview;
