const asyncHandler= (requestHandler)=>{
    return (req, res, next)=>{
            Promise.resolve(  requestHandler(req, res, next)  ).catch(   (err)=> next(err)   )
    }
}

export {asyncHandler}



























//we can also write it like this
// const asyncHandler= (reqHandler)=>{
//      async (req, res, next)=>{
//         try {
//             await reqHandler(req, res, next);
//         } catch (error) {
//             res.status(err.code || 500).json( { success: false, message: err.message || "Internal Server Error" } );
//         }
//      }
// }