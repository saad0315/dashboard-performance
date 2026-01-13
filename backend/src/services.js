const cloudinary = require("cloudinary")
console.log(process.env.CLOUD_API_KEY);
cloudinary.config({ 
    cloud_name: 'ddvtgfqgv', 
    api_key: '816883953748325', 
    api_secret: 'VxqOTlyDQbnjI69lA5iEq8GcF7I'  
  });
exports.imageUpload = (path , folder)=>{
    return cloudinary.v2.uploader.upload(path, {folder}).then((data)=>{
    
        return {url: data.url, public_id :data.public_id}
    }).catch((err)=>{
        console.log("error");
    })
    
}
exports.imageDelete = async(public_id) =>{
    await cloudinary.v2.uploader.destroy(public_id , function(error,result){
        console.log(error,result);
    })
}

exports.documentUpload = (path , folder ,resource_type, format)=>{
    return cloudinary.v2.uploader.upload(path, {folder,  resource_type , format }).then((data)=>{
    
        return {url: data.url, public_id :data.public_id}
    }).catch((err)=>{
        console.log("error");
    })
    
}
