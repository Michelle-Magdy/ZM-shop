export function getCategoryTree(slug, categories, path) {
    for (let i = 0; i < categories.length; i++) {
        path.push(categories[i].slug);
        if (categories[i].slug === slug) return path;

        if (categories[i].subcategories.length > 0) {
            const res = getCategoryTree(
                slug,
                categories[i].subcategories,
                path,
            );
            if (res) return res;
        }

        path.pop();
    }

    return null;
}
