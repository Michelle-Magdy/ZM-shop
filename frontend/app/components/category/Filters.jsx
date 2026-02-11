"use client";
import { getCategoryBySlug, getFilters } from "@/lib/api/categories";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Fitlers({ slug }) {
  const searchParams = useSearchParams();
  console.log(searchParams);

  const [filtersData, setFiltersData] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    price: { min: 0, max: Infinity },
    attributes: {},
    variants: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // 1. Fetch the category first
        const category = await getCategoryBySlug(slug);

        // 2. Check if category exists before moving on
        if (category?.data?._id) {
          // 3. Use the ID from the first result to fetch filters
          const filters = await getFilters(category.data._id);
          setFiltersData(filters);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  // build active filters from url
  useEffect(() => {
    if (!filtersData) return;

    const filters = {
      price: null,
      attributes: {},
      variants: {},
    };

    // parse price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filters.price = {
        min: minPrice ? parseInt(minPrice) : filtersData.price.min,
        min: maxPrice ? parseInt(maxPrice) : filtersData.price.max,
      };
    }
  }, [filtersData, searchParams]);

  return <>Hello</>;
}
