export function getStatistic(arr) {
    const getCategory = arr => arr.reduce((allCategory, note) => {
        allCategory.push(note.category);
        return allCategory;
    }, [])

    const categories = getCategory(arr);
    const getCategoriesStats = (acc, category) => {
        if (!acc.hasOwnProperty(category)) {
            acc[category] = 0;
        }
        acc[category] += 1;
        return acc
    }
    const countCategories = categories => categories.reduce(getCategoriesStats, {});
    const statistic = countCategories(categories);
    return statistic;
}
