

//Update User Cartdata : /api/cart/update

import User from "../models/User.js"

// export const updateCart = async (req,res)=>{
//     try {
//         const {userId } = req.user.id;
//         const {cartItems} = req.body
//         await User.findByIdAndUpdate(userId , {cartItems})
//         res.json({success : true , message: "Cart Updated"})
        
//     } catch (error) {
//         console.log(error.message);                                                                         
//         res.json({success:false , message:error.message});
//     }
// }

export const updateCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { cartItems } = req.body;
  
      console.log("User ID:", userId);
      console.log("Cart Items to update:", cartItems);
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { cartItems },
        { new: true }
      );
  
      console.log("Updated User from DB:", updatedUser);
  
      res.json({ success: true, message: "Cart Updated" });
  
    } catch (error) {
      console.log("Error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  