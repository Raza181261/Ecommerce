const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")


//Register a user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a sample id",
            url: "ProfileURL"
        },
    });

    sendToken(user, 201, res) 

});

 //loginUser

 exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password ", 400))
    }

    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendToken(user, 200, res) 

});

//Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message:"Logged Out"
    });
});
 
//Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }
    //Get resetPassword Token
    const resetToken = user.getRestPasswordToken()
    await user.save({validateBeforeSave: false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have 
    not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email send to ${user.email} successfully`,
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;


        await user.save({validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500))

        // Reset password portion is incomplete Due to gamil isssue
    }
})

//Get user detail

exports.getUserDetailed = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user,
    })
})

// update  user password

exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Old Password is invalide ", 400))
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not Match ", 400))
    }

    user.password = req.body.newPassword

    await user.save()

    sendToken(user, 200, res) 
})

// update  user profile

exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    };

    //we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success:true
    });  
});

//Get all users(admin)

exports.getAllUser = catchAsyncErrors(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
});


//Get single user(admin)

exports.getSingleUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHandler(`User does not exits with id ${req.params.id}`)
        )
    }

    res.status(200).json({
        success:true,
        user,
    });
});

//Update User Role---admin
exports.updateUserRole = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };


    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    if(!user){
        return next(
            new ErrorHandler(`User does not exist with id ${req.params.id}`,400)
        );
       }

    res.status(200).json({
        success:true
    });  
});


//Delete User ---admin
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
    
    const user = await User.findById(req.params.id);
   //we will remove cloudinary

   if(!user){
    return next(
        new ErrorHandler(`User does not exist with id ${req.params.id}`,400)
    );
   }
   
   //await user.removeOne()
   await user.deleteOne();

    res.status(200).json({
        success:true
    });  
});