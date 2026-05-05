"use client";
import { getCategoryBySlug, getFilters } from "@/lib/api/categories";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBars } from "react-icons/fa";
import { faX } from "@fortawesome/free-solid-svg-icons";
import FiltersSkeleton from "@/app/UI/Skeletons/FiltersSkeleton";
import {
  parseCategoryFilters,
  filtersToSearchParams,
} from "@/lib/util/ParseCategoryFilters";
import useDebounced from "@/lib/hooks/useDebounced";

const SORT_OPTIONS = [
  { key: "A-Z", value: "title" },
  { key: "Z-A", value: "-title" },
  { key: "Price (asc)", value: "defaultVariant.price" },
  { key: "Price (des)", value: "-defaultVariant.price" },
  { key: "Rating (asc)", value: "avgRating" },
  { key: "Rating (dec)", value: "-avgRating" },
];

export default function Filters({ slug, initialFilters }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersData, setFiltersData] = useState(null);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedMin = useDebounced(activeFilters.price.min);
  const debouncedMax = useDebounced(activeFilters.price.max);

  const isFirstRender = useRef(true);

  // Fetch category → filters metadata
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const category = await getCategoryBySlug(slug);

        if (category?.data?._id) {
          const filters = await getFilters(category.data._id);
          setFiltersData(filters);

          // ✅ Re-parse URL with real min/max prices now that we know them
          setActiveFilters(parseCategoryFilters(searchParams, filters));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) loadData();
  }, [slug]);

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender.current = false;
      return;
    }

    if (!filtersData) return;

    const currentMin =
      parseInt(searchParams.get("defaultVariant.price[gte]")) ||
      filtersData.price.min;
    const currentMax =
      parseInt(searchParams.get("defaultVariant.price[lte]")) ||
      filtersData.price.max;

    const minChanged = debouncedMin !== currentMin;
    const maxChanged = debouncedMax !== currentMax;

    if (minChanged || maxChanged) {
      const newFilters = {
        ...activeFilters,
        price: {
          min: debouncedMin,
          max: debouncedMax,
        },
      };

      // Update URL without calling setActiveFilters again (already in sync)
      const queryString = filtersToSearchParams(newFilters);
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }
  }, [debouncedMin, debouncedMax]);

  const updateURL = (filters) => {
    const queryString = filtersToSearchParams(filters);

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    const newFilters = {
      ...activeFilters,
      sort: sortValue,
    };
    setActiveFilters(newFilters);
    updateURL(newFilters);
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
    const resetFilters = {
      sort: "title",
      price: { min: filtersData.price.min, max: filtersData.price.max },
      attributes: {},
      variants: {},
      status: "active",
    };
    setActiveFilters(resetFilters);
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
    return <FiltersSkeleton />;
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
          <h2 className="text-xl font-bold text-primary-text">Sorting</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-primary-text hover:text-gray-700"
            aria-label="Close filters"
          >
            <FontAwesomeIcon icon={faX} className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-8">
          <div className="space-y-4">
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-black focus:outline-none"
              onChange={handleSort}
            >
              {SORT_OPTIONS.map(({ key, value }, index) => (
                <option key={index} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-text">Filters</h2>
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
                  min={0}
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
