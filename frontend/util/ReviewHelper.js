export const getDisplayedHelpfulCount = (helpfulArray, currentUser, isHelpful) => {
    const hasUser = helpfulArray.includes(currentUser?.id);
    if (isHelpful && !hasUser) return helpfulArray.length + 1;
    if (!isHelpful && hasUser) return helpfulArray.length - 1;
    return helpfulArray.length;
};