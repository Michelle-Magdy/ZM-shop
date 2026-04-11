import User from "../models/user.model.js";

export const getMonthlyUsersStats = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const stats = await User.aggregate([
        // Match non-deleted users once
        { $match: { isDeleted: { $ne: true } } },

        // Lookup all roles for each user
        {
            $lookup: {
                from: 'roles',
                localField: 'roles',
                foreignField: '_id',
                as: 'userRoles'
            }
        },

        // Project computed fields
        {
            $project: {
                isActive: {
                    $and: [
                        { $ne: ['$isDeleted', true] },
                        { $ne: ['$isSuspended', true] }
                    ]
                },
                isNewThisMonth: {
                    $gte: ['$createdAt', startOfMonth]
                },
                isNewLastMonth: {
                    $and: [
                        { $gte: ['$createdAt', startOfLastMonth] },
                        { $lte: ['$createdAt', startOfMonth] }
                    ]
                },
                isAdmin: {
                    $in: ['admin', '$userRoles.name']
                }
            }
        },

        // Group all stats
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: {
                    $sum: { $cond: ['$isActive', 1, 0] }
                },
                newThisMonth: {
                    $sum: { $cond: ['$isNewThisMonth', 1, 0] }
                },
                newLastMonth: {
                    $sum: { $cond: ['$isNewLastMonth', 1, 0] }
                },
                admins: {
                    $sum: { $cond: ['$isAdmin', 1, 0] }
                }
            }
        }
    ]);

    const result = stats[0] || {
        total: 0,
        active: 0,
        newThisMonth: 0,
        newLastMonth: 0,
        admins: 0
    };

    return result;
}