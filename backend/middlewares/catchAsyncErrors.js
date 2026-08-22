// backend/middlewares/catchAsyncErrors.js

/**
 * 🎯 ASYNC ERROR HANDLER
 *
 * This middleware wraps async controller functions
 * and catches any errors that occur during execution.
 *
 * WITHOUT this: Every controller needs try/catch blocks
 * WITH this: Errors are automatically passed to error handler
 *
 * 📝 HOW IT WORKS:
 *    1. Takes an async function
 *    2. Returns a new function
 *    3. Executes the async function
 *    4. If error occurs → passes to next()
 *
 * 🔄 USAGE:
 *    // Instead of:
 *    exports.getUser = async (req, res, next) => {
 *      try {
 *        const user = await User.findById(req.params.id);
 *        res.json(user);
 *      } catch (error) {
 *        next(error);
 *      }
 *    };
 *
 *    // Use:
 *    exports.getUser = catchAsyncErrors(async (req, res, next) => {
 *      const user = await User.findById(req.params.id);
 *      res.json(user);
 *    });
 */

export default (controllerFunction) => (req, res, next) =>
  Promise.resolve(controllerFunction(req, res, next)).catch(next);
