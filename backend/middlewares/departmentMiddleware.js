export const checkDepartmentAccess = (req, res, next) => {
  try {
    const user = req.user;
    
    // Super Admin has access to everything
    if (user.role === 'superadmin') {
      return next();
    }

    // If user has managed categories, set the filter
    if (user.managedCategories && user.managedCategories.length > 0) {
      req.departmentFilter = {
        key: { $in: user.managedCategories }
      };
    } else {
      // No managed categories. 
      // We won't block here with 403, but we'll let the controller return empty data.
      // This prevents UI errors if a user is just set up without categories yet.
      console.warn(`User ${user.email} has no managed categories.`);
    }

    next();
  } catch (error) {
    console.error('Department Middleware Error:', error);
    res.status(500).json({ message: 'Server error checking permissions' });
  }
};
