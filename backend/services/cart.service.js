// services/cart.service.js
export const validateCartItems = async (cart) => {
    let hasChanges = false;

    for (const item of cart.items) {
        const dbVariant = item.productId.variants?.find(v => v.sku === item.variant.sku);

        if (!dbVariant || !dbVariant.isActive) {
            return {
                error: {
                    type: 'VARIANT_UNAVAILABLE',
                    message: `${item.title} is no longer available`
                }
            };
        }

        if (dbVariant.stock < item.quantity) {
            return {
                error: {
                    type: 'INSUFFICIENT_STOCK',
                    message: `${item.title} has only ${dbVariant.stock} in stock`
                }
            };
        }


        if (item.variant.price !== dbVariant.price) {
            item.variant.price = dbVariant.price;
            hasChanges = true;
        }

        item.variant.stock = dbVariant.stock;
        item.variant.isActive = dbVariant.isActive;
    }

    if (hasChanges) {
        await cart.save();
    }

    return { error: null, hasChanges };
};