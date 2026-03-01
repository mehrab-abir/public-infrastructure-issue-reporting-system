export const checkRouteHit = (req,res,next)=>{
    console.log("Route was hit");
    next();
}