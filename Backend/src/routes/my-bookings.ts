import express,{Request,Response} from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
const router=express.Router();

router.get("/",verifyToken,async(req: Request,res:Response)=>{
    try{
        const hotel=await Hotel.find({
            bookings:{
                $elemMatch:{userId:req.userId}
            },
        });
        const result=hotel.map((hotels)=>{
            const userBookings = hotels.bookings.filter(
                (booking) => booking.userId === req.userId);
            
            const hotelWithUserBookings: HotelType = {
                ...hotels.toObject(),
                bookings: userBookings,
                };
            return hotelWithUserBookings;
        });
        res.status(200).send(result);

    }catch(error){
        console.log(error);
        res.status(500).json({message:"unable to fetch bookings"});
    }
});
export default router;
