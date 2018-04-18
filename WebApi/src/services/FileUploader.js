import multer from 'multer'
import ErrorResponse from '../utils/ErrorResponse'

const MAX_FILE_SIZE_MB = 512 
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const upload = multer({
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES, 
        files: 1        
    }
})

const uploader = (req, res, next) => upload.any() (req, res, err => {        
    if (err) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                res.status(400).json(new ErrorResponse(`File is too large (> ${MAX_FILE_SIZE_MB} Mb)`))    
                break            
            default:
                res.status(500).json(new ErrorResponse(err.message))
        }        
    } else {  
        const files = req.files

        if (!files || files.length === 0 || files.some(f => !f.buffer)) {
            res.status(400).json(new ErrorResponse('No files are attached or some attachments are empty'))
            return
        }         

        next()
    }
})

export default uploader 