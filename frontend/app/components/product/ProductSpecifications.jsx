import { memo } from "react";

export default memo(function ProductSpecifications({ product }) {
    const attrDefinitionsMap =
        product.attributeDefinitions?.reduce((acc, def) => {
            acc[def.key] = def;
            return acc;
        }, {}) || {};

    return (
        <>
            {product.attributes?.length > 0 && (
                <div className="bg-(--color-card) rounded-xl p-6 shadow-sm border border-badge">
                    <h3 className="text-lg font-bold text-(--color-primary-text) mb-4">
                        Specifications
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.attributes.map((attr) => {
                            const definition = attrDefinitionsMap[attr.key];
                            return (
                                <div key={attr.key} className="space-y-1">
                                    <dt className="text-sm text-secondary-text">
                                        {definition?.displayName || attr.key}
                                    </dt>
                                    <dd className="text-sm font-semibold text-(--color-primary-text)">
                                        {attr.displayValue || attr.value}
                                        {definition?.unit &&
                                            !attr.displayValue?.includes(
                                                definition.unit,
                                            ) && (
                                                <span className="text-secondary-text font-normal ml-1">
                                                    {definition.unit}
                                                </span>
                                            )}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            )}
        </>
    );
});
