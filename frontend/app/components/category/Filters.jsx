"use client";
import { getCategoryBySlug, getFilters } from "@/lib/api/categories";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBars } from "react-icons/fa";
import { faX } from "@fortawesome/free-solid-svg-icons";
import FiltersSkeleton from "@/app/UI/Skeletons/FiltersSkeleton";

export default function Filters({ slug }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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
          console.log(filters);
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
      price: {
        min: filtersData.price.min,
        max: filtersData.price.max,
      },
      attributes: {},
      variants: {},
    };

    // parse price range
    const minPrice = searchParams.get("price[gte]");
    const maxPrice = searchParams.get("price[lte]");
    if (minPrice || maxPrice) {
      filters.price = {
        min: minPrice ? parseInt(minPrice) : filtersData.price.min,
        max: maxPrice ? parseInt(maxPrice) : filtersData.price.max,
      };
    }
    // attributes
    searchParams.forEach((value, key) => {
      const attributeMatch = key.match(/^attributes\[(.+)\]$/);
      if (attributeMatch) {
        const attrKey = attributeMatch[1];
        filters.attributes[attrKey] = value.split(",");
      }
      // attributes[ram]=8GB,16GB
    });

    // variants
    searchParams.forEach((value, key) => {
      const variantMatch = key.match(/^variants\[(.+)\]$/);
      if (variantMatch) {
        const variantKey = variantMatch[1];
        filters.variants[variantKey] = value.split(",");
      }
    });

    setActiveFilters(filters);
  }, [filtersData, searchParams]);

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    // set price
    if (filters.price) {
      params.set("price[gte]", filters.price.min.toString());
      params.set("price[lte]", filters.price.max.toString());
    }
    //set attributes
    if (filters.attributes) {
      Object.entries(filters.attributes).forEach(([key, values]) => {
        if (values.length > 0)
          params.set(`attributes[${key}]`, values.join(","));
      });
    }
    //set variants
    if (filters.variants) {
      Object.entries(filters.variants).forEach(([key, values]) => {
        if (values.length > 0) params.set(`variants[${key}]`, values.join(","));
      });
    }
    const queryString = params.toString();
    console.log(queryString);

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handlePriceChange = (min, max) => {
    const newFilters = {
      ...activeFilters,
      price: {
        min: isNaN(min) ? filtersData.price.min : min,
        max: isNaN(max) ? filtersData.price.max : max,
      },
    };
    setActiveFilters(newFilters);
    updateURL(newFilters);
  };

  const handleAttributeToggle = (key, value) => {
    const current = activeFilters.attributes[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = {
      ...activeFilters,
      attributes: {
        ...activeFilters.attributes,
        [key]: updated,
      },
    };
    setActiveFilters(newFilters);
    updateURL(newFilters);
  };

  const handleVariantToggle = (key, value) => {
    const current = activeFilters.variants[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = {
      ...activeFilters,
      variants: {
        ...activeFilters.variants,
        [key]: updated,
      },
    };
    setActiveFilters(newFilters);
    updateURL(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      priceRange: null,
      attributes: {},
      variants: {},
    });
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.priceRange ||
      Object.values(activeFilters.attributes).some((v) => v.length > 0) ||
      Object.values(activeFilters.variants).some((v) => v.length > 0)
    );
  };

  if (isLoading) {
    <FiltersSkeleton />;
  }

  if (!filtersData) return null;

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary:hover transition-colors"
        aria-label="Open filters"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filters Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
           bg-background
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          z-50 lg:z-0
          overflow-y-auto
          border-r border-primary
          p-6
          min-w-3/4
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-text">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-primary-text hover:text-gray-700"
            aria-label="Close filters"
          >
            <FontAwesomeIcon icon={faX} className="w-6 h-6" />
          </button>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="w-full mb-6 px-4 py-2 text-sm text-primary-text border border-primary rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Clear All Filters
          </button>
        )}

        {/* Price Range Filter */}
        {filtersData.price && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-primary-text mb-4">
              Price Range
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-primary-text block mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  min={filtersData.price.min}
                  max={filtersData.price.max}
                  value={activeFilters.price?.min || filtersData.price.min}
                  onChange={(e) =>
                    handlePriceChange(
                      parseInt(e.target.value),
                      activeFilters.price?.max || filtersData.price.max,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-primary-text block mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  min={filtersData.price.min}
                  max={filtersData.price.max}
                  value={activeFilters.price?.max || filtersData.price.max}
                  onChange={(e) =>
                    handlePriceChange(
                      activeFilters.price?.min || filtersData.price.min,
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-secondary-text">
                EGP {activeFilters.priceRange?.min || filtersData.price.min} -
                EGP {activeFilters.priceRange?.max || filtersData.price.max}
              </div>
            </div>
          </div>
        )}

        {/* Attributes Filters */}
        {filtersData.attributes &&
          Object.entries(filtersData.attributes).map(([key, attribute]) => (
            <div key={key} className="mb-8">
              <h3 className="text-sm font-semibold text-primary-text mb-4">
                {attribute.displayName}
              </h3>
              <div className="space-y-2">
                {attribute.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={
                        activeFilters.attributes[key]?.includes(option) || false
                      }
                      onChange={() => handleAttributeToggle(key, option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-secondary-text font-bold group-hover:font-normal">
                      {option}
                      {/* {attribute.type === "number" && " mAh"} */}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

        {/* Variants Filters */}
        {filtersData.variants &&
          Object.entries(filtersData.variants).map(([key, variant]) => (
            <div key={key} className="mb-8">
              <h3 className="text-sm font-semibold text-primary-text mb-4">
                {variant.displayName}
              </h3>
              <div className="space-y-2">
                {variant.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={
                        activeFilters.variants[key]?.includes(option) || false
                      }
                      onChange={() => handleVariantToggle(key, option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-secondary-text font-bold group-hover:font-normal">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
      </aside>
    </>
  );
}
