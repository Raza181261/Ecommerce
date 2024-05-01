const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


// Create Product -- Admin
exports.createProduct = catchAsyncErrors(
    async(req, res) => {
        
        req.body.user = req.user.id
       // console.log(req.body);
        const product = await Product.create(req.body);
    
        res.status(201).json({
            success:true,
            product
        })
    }
)



// Get all product
// exports.getAllproducts = catchAsyncErrors(async (req, res) => {

//     const resultPerPage = 8;
//     const productsCount = await Product.countDocuments();

//     const apiFeatures = new ApiFeatures(Product.find(),req.query)
//     .search()
//     .filter()
    
//     let products = await apiFeatures.query;

//     let filteredProductsCount = products.length;

//     apiFeatures.pagination(resultPerPage)

//     products = await apiFeatures.query
//     res.status(200).json({
//         success:true,
//         products,
//         productsCount,
//         resultPerPage,
//         filteredProductsCount,
//     })
   
     
// })
// exports.getAllproducts = catchAsyncErrors(async (req, res) => {
//     const resultPerPage = 8;

//     // Execute the query to get all products
//     const products = await Product.find();

//     // Get the total count of products
//     const productsCount = products.length;

//     // Apply search and filter based on the request query
//     const apiFeatures = new ApiFeatures(products, req.query)
//         .search()
//         .filter();

//     // Get the filtered products after search and filter
//     const filteredProducts = apiFeatures.query;

//     // Get the count of filtered products
//     const filteredProductsCount = filteredProducts.length;

//     // Perform pagination
//     apiFeatures.pagination(resultPerPage);
//     const paginatedProducts = apiFeatures.query;

//     // Send response
//     res.status(200).json({
//         success: true,
//         products: paginatedProducts,
//         productsCount,
//         resultPerPage,
//         filteredProductsCount,
//     });
// });
// exports.getAllproducts = catchAsyncErrors(async (req, res) => {
//     const resultPerPage = 8;

//     // Execute the query to get all products
//     const products = await Product.find();

//     // Get the total count of products
//     const productsCount = products.length;

//     // Instantiate ApiFeatures object
//     const apiFeatures = new ApiFeatures(products, req.query);

//     // Apply search and filter based on the request query
//     apiFeatures.search().filter();

//     // Get the filtered products after search and filter
//     const filteredProducts = apiFeatures.query;

//     // Get the count of filtered products
//     const filteredProductsCount = filteredProducts.length;

//     // Perform pagination
//     apiFeatures.pagination(resultPerPage);
//     const paginatedProducts = apiFeatures.query;

//     // Send response
//     res.status(200).json({
//         success: true,
//         products: paginatedProducts,
//         productsCount,
//         resultPerPage,
//         filteredProductsCount,
//     });
// });
// get all product 
exports.getAllproducts=catchAsyncErrors( async(req,res)=>{
    const resultPerPage=8;
    
    const apiFeature= new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const productCount=await Product.countDocuments()
    const products=await apiFeature.query


    res.status(200).json({
        success:true,
        products,
        productCount
    })
})



// Get Product detail
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success:true,
        product,
    })
})

// Product Update -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })
})


//Delete Products

exports.deleteProduct = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    // await product.remove();
    await product.deleteOne()

    res.status(200).json({
        success:true,
        message:"Product Delete successfully"
    })

})

//Create new review and update the review

exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
    const{rating, comment, productId} = req.body

    const review = {
        user: req.body._id,
        name: req.body.name,
        rating:Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user.toString()
    );

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user.toString())
            (rev.rating = rating), (rev.comment = comment)
        })
        
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    };

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = avg
    / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success:true
    })
})

//Get all Reviews of a products

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    });
});

//Delete Reviews

exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const ratings = avg/ reviews.length
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId,
         {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success:true
    })
})