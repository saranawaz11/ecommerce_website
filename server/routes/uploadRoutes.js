import express from 'express'
import multer from 'multer'
import streamifier from 'streamifier'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router();
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// using Multer memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('image'), async(req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message: 'No file Uploaded'})
        }
        // function to handle the stream to upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if(result){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })
                // use streamifier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }
        // call the streeamUpload function
        const result = await streamUpload(req.file.buffer)
        // respond with uploaded image
        res.json({url: result.secure_url, public_id: result.public_id})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server Error'})
    }
})

export default router