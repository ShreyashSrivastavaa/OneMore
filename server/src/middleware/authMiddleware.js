import { ApiError } from '../utils/errors.js';

export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return next(new ApiError(401, 'UNAUTHORIZED', 'Authentication required. Please sign in to access this feature.'));
};

export const optionalAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.user = req.user;
  } else {
    req.user = null;
  }
  return next();
};
