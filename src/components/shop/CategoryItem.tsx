import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import ShopButtons from "./ShopButtons";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ShopCategoryItem = ({ item }: { item: Item }) => {
  const { data: session, status } = useSession();
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="shop-item-container border rounded text-center p-2 mb-2">
        <div className="row">
          <div className="col">
            <Link href={`/shop/item/${item.id}/${item.slug}/`}>
              {item.name}
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {formatPrice(item.price, session?.user.subtype as number)}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Image
              className="shop-item-image"
              src={`/images/shop/${item.image}`}
              width={100}
              height={100}
              alt={item.name}
            />
          </div>
        </div>
        <Link
          href={`/shop/category/${item.Category.id}/${item.Category.slug}/`}
        >
          {item.Category.name}
        </Link>
        <div className="row">
          <div className="col">&nbsp;</div>
        </div>
        <ShopButtons item={item} view="category" />
      </div>
    </div>
  );
};

export default ShopCategoryItem;
