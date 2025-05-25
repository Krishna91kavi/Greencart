import mongoose from "mongoose";
import User from './User.js'

const orderSchema = new mongoose.Schema({
      userId:{type:mongoose.Schema.Types.ObjectId , required:true , ref:'User'},
      items:[{
        product:{type:mongoose.Schema.Types.ObjectId , required:true , ref:'Product'},
        quantity:{type:Number , required:true  }
      }],
      amount:{type:Number , required:true },
      address:{type:String , required:true, ref:'Address' },
      status :{type:String ,default: 'Order Placed' },
      paymentType:{type:String , required:true },
      isPaid:{type:Boolean , required:true, default: false }
    
    },{timestamps: true})
    
 const Order = mongoose.models.order || mongoose.model('order',orderSchema)
    
 export default Order;