import ProductCard from "./ProductCard";

const ShopCarousel = ({ items }: { items: Item[] }) => {
  return (
    <>
      <div className="w-full carousel rounded-box border border-primary bg-base-200 text-base-content">
        {items &&
          items.map((item, index) => {
            let features = [];
            if (item.features != undefined && item.features !== "") {
              features = item.features.split(",");
            }

            return (
              <div
                key={index}
                id={`item-${index + 1}`}
                className="carousel-item w-full h-full text-center relative"
              >
                <ProductCard item={item} features={features} />
              </div>
            );
          })}
      </div>

      <div className="flex justify-center w-full py-2 gap-2">
        {items &&
          items.map((item, index) => (
            <a
              key={index + 1}
              href={`#item-${index + 1}`}
              className="btn btn-xs"
            >
              {index + 1}
            </a>
          ))}
      </div>
    </>
  );
};

export default ShopCarousel;
