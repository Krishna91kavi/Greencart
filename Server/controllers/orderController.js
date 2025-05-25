import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe"
import User from "../models/User.js";
import mongoose from 'mongoose';

//place Order Cod : /api/order/cod
export const placeOrderCOD = async (req ,res ) => {
     try {
        
        const userId = req.user?.id;  // Ensure req.user is being set
      
        const {items, address} = req.body;
        if(!address || items.length === 0 ){
            return res.json({success:false , message:"Invalid data"})
        }
    //calculate amount using items
    let amount = await items.reduce(async (acc , item)=>{
        const product = await Product.findById(item.product);
        return (await acc) + product.offerPrice * item.quantity;
    },0)
    //calculate Tax charger (2%)
    amount +=Math.floor(amount * 0.02);

    await Order.create({
        userId,
        items,
        amount,
        address,
        paymentType:"COD",
    });
        return res.json({success:true, message:"Order Placed Successfully"})

     } catch (error) {
        return res.json({success:false , message:error.message})
     }
}
//place Order Cod : /api/order/stripe
export const placeOrderStripe = async (req ,res ) => {
    try {
        console.log("Creating order for userId:", userId);

       const userId = req.user?.id;  // Ensure req.user is being set
       const {items, address} = req.body;
       const{origin} = req.headers;

       if(!address || items.length === 0 ){
           return res.json({success:false , message:"Invalid data"})
       }

       let productData = [];
   //calculate amount using items
   let amount = await items.reduce(async (acc , item)=>{
       const product = await Product.findById(item.product);
       productData.push({
        name : product.name,
        price : product.offerPrice,
        quantity : item.quantity ,
       });
       return (await acc) + product.offerPrice * item.quantity;
   },0)
   //calculate Tax charger (2%)
   amount +=Math.floor(amount * 0.02);

  const order =   await Order.create({
       userId,
       items,
       amount,
       address,
       paymentType:"Online",
   });

   //Stripe gateway initilaze

   const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

   //create line items for stripe
   const line_items = productData.map((item)=>{
       return{
       price_data:{  
       currency:"usd",
       product_data : {
           name:item.name,
       },
       unit_amount : Math.floor(item.price + item.price * 0.02) * 100 
       },
       quantity: item.quantity
   }
   })
   // create session
   const session = await stripeInstance.checkout.sessions.create({
       line_items ,
       mode:"payment",
       success_url : `${origin}/loader?next=my-orders`,
       cancel_url : `${origin}/cart`,
       metadata:{
           orderId:order._id.toString(),
           userId,

       }
   })
    //    return res.json({success:true, url:session})
          return res.json({success:true, url:session.url});

    } catch (error) {
       return res.json({success:false , message:error.message})
    }
}

//stripe webhooks to verify payments :/stripe
export const stripeWebhooks = async (req,res) =>{
    //stripe gateway initilize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];
    let event ;
    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        res.status(400).send(`Webhook Error : ${error.message}`)
    }

    //handle event 
    switch (event.type){
        case "payment_intent.succeeded":{
            const payment_intent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            });
            const {orderId,userId} = session.data[0].metadata;

            //Mark Payment paid 
            await Order.findByIdAndUpdate(orderId,{isPaid:true})
            //clear use cart
            await User.findByIdAndUpdate(userId , {cartItems:{}});
            break;
        }
        case "payment_intent.payment_failed":{
            const payment_intent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            });
            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;

        }    

        default:
            console.log(`Unhandled Error type ${event.type}`)
            break;
    }
    res.json({received:true})


}
 




//Get Order by User ID : /api/order/user

export const getUserOrders = async (req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id) // ✅ Pull user ID from token-authenticated user

        const orders = await Order.find({
            userId ,
            $or:[{paymentType:"COD"}, {isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1})
        res.json({success:true,orders});

    } catch (error) {
        return res.json({success:false , message:error.message})
    }
}
// get all Orders(seller/ admin) :/api/order/seller

export const getAllOrders = async (req,res)=>{
    try {
        const orders = await Order.find({
            $or:[{paymentType:"COD"}, {isPaid:true}]

        }).populate("items.product address").sort({createdAt: -1});
        res.json({success:true, orders});

    } catch (error) {
        return res.json({success:false , message:error.message})
    }
}