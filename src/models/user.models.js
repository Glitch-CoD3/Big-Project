import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";     //jwt package for token generation.
import bcrypt from "bcrypt";       //bcrypt package for password hashing.

const userSchema= new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,

        },

        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
            
        },
        
        avatar: {
            type: String,  //cloudinary string
            required: true,

        },

        coverImage: {
            type: String,  //cloudinary string
        },

        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],

        },

        refreshTokens: {
            type: String,
        }

        
    }, {timestamps:true})



    //password encryption before saving user document
userSchema.pre("save", async function(next){
    if(!this.modifiedPaths("password")) return next();

    this.passsword= bcrypt.hash(this.password, 10);
    next();
})


//comapre password method for login validation 
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}
export const User= mongoose.model("User", userSchema)

