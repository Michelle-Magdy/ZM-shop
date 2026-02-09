import ProductCard from "../home/ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="">
      {products.data.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
