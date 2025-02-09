const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
}

export { asyncHandler }

//using try-catch {better understanding}
// const asynHandler2 = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             res.status(500).json({
//                 message: error.message,
//                 success: false
//             });
//         }
//     }
// }

