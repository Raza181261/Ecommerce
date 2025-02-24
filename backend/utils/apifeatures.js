// class ApiFeatures{
//     constructor(query, queryStr){
//         this.query = query,
//         this.queryStr = queryStr
//     }

//     search(){
//         const keyword = this.queryStr.keyword ? {
//             name:{
//                 $regex: this.queryStr.keyword,
//                 $options: "i"
//             }
//         }:{};

//         //console.log(keyword);

//         this.query = this.query.find({...keyword})
//         return this;
//     }

//     filter(){
//         const queryCopy = {...this.queryStr}
//         //removing some fileds for category

//         const removeFields = ["keyword", "page", "limit"]
//         removeFields.forEach((key) => delete queryCopy[key])

//         //filter for price and rating

//         let queryStr = JSON.stringify(queryCopy)
//         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

//         this.query = this.query.find(JSON.parse(queryStr));
        
//        // this.query = this.query.find(queryCopy)
//         return this;
//     }

//     pagination(resultPerPage){
//         const currentPage = Number(this.queryStr.page) || 1;
//         const skip = resultPerPage * (currentPage - 1);

//         this.query = this.query.limit(resultPerPage).skip(skip);

//         return this
//     }
// }

// module.exports = ApiFeatures

const { json } = require("express");

class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr
    }
    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{};
        console.log(keyword)
        this.query=this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy={...this.queryStr}
        // removing some fields for categorey
        const removeFields=["keyword","page","limit"]
        removeFields.forEach(key=> delete queryCopy[key])
        // filter for pricing 
        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)/g,key=>`$${key}`)
        this.query=this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page) || 1
;
const skip= resultPerPage*(currentPage-1)
this.query=this.query.limit(resultPerPage).skip(skip)
return this
}
}
module.exports=ApiFeatures