import axios from "axios";
//https://api.cloudinary.com/v1_1/${cloudName}/image/upload

const uploadToCloudinary = async (imageFile, preset)=>{
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append("file",imageFile);
    formData.append("upload_preset",preset);

    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,formData);

    return response.data.secure_url;
}

export default uploadToCloudinary;