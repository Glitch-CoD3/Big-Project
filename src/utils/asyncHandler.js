// const asyncHandler= (reqHandler)=>{
//     (req, res, next)=>{
//         return Promise.resolve(  reqHandler(req, res, next)  ).catch(   (err)=> next(err)   )
//     }
// }




//we can also write it like this
const asyncHandler= (reqHandler)=>{
     async (req, res, next)=>{
        try {
            await reqHandler(req, res, next);
        } catch (error) {
            res.status(err.code || 500).json( { success: false, message: err.message || "Internal Server Error" } );
        }
     }
}

export {asyncHandler}