import express,{Request,Response} from 'express';
import { Brain } from '../models/db';
import { User } from '../models/db';
import usermiddleware from '../middlewares/usermiddleware'
import crypto from 'crypto';
const brainRoute = express.Router();


interface CustomRequest extends Request {
    userId?: {
        id_: string;
    };
}
brainRoute.post('/add',usermiddleware,async (req:CustomRequest, res: Response, next: express.NextFunction) => {
	try {

        const userId = req.userId ?? "" ;
        const { contentType , contentLink , title , description , tags , manualContent} = req.body;
        
        const braincraeted = await Brain.create({
            user : userId,
            contentType,
            contentLink,
            title,
            description,
            tags,
            manualContent,
        });

        if(braincraeted){
            res.status(201).json({
                message : "Brain Created",
                braincraeted
            })
        } else {    
            res.status(500).json({
                message : "Internal Server Error"
            })
        }
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }   
})

brainRoute.get('/user',usermiddleware,async (req: CustomRequest , res : Response) => {    
    try{
        const userId = req.userId ?? "" ;
        const Allbrain = await Brain.find({user : userId});
        res.status(200).json(Allbrain);
    }catch(error){
            console.error(error)
    }
})

brainRoute.put('/update/:id',usermiddleware,async ( req: CustomRequest, res : Response)=>{
    try{
        const userId = req.userId ?? "" ;
        const {id} = req.params;
        const { contentType , contentLink , title , description , tags , manualContent} = req.body;
      
        const brainUpdate = await Brain.findByIdAndUpdate(
            {_id: id, 
                user :userId
            },{
            contentType,
            contentLink,
            title,
            description,
            tags,
            manualContent,
            },{
            new : true
            }
    );

        if(brainUpdate){
            res.status(200).json({
                message : "Brain Updated",
                brainUpdate
            })
    }
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

brainRoute.delete('/delete/:id',usermiddleware,async (req: CustomRequest, res : Response) => {
    try{
        const userId = req.userId ?? "" ;
        const {id} = req.params;
        const brainDelete = await Brain.findByIdAndDelete({_id: id, user :userId});
        if(brainDelete){
            res.status(200).json({
                message : "Brain Deleted",
                brainDelete
            })
        }
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }   
})


const generateShareableLink = (brainId: string): string => {
    const hash = crypto.randomBytes(16).toString('hex'); 
    return `${process.env.APP_URL}/shared/${brainId}/${hash}`;
};

brainRoute.put('/share/:id',usermiddleware,async (req: CustomRequest, res : Response) => {  
    try{
        const userId = req.userId ?? "" ;
        const {id} = req.params;
        const brainShared = await Brain.findOne({
            _id: id,
            user : userId
        })
        if(!brainShared){
            res.status(404).json({
                message : "Brain Not Found"
            })
            return;
        } else {
            brainShared.isShared = true;
              brainShared.shareableLink = generateShareableLink(brainShared._id.toString());
        }
        await brainShared.save();
        res.status(200).json({
            message : "Brain Shared",
            brainShared
        })
    }catch(error){  
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

brainRoute.get('/search',usermiddleware),async ( req : CustomRequest , res : Response) => {
    try {
         const userId = req.userId ?? "";
         const {contentType, title ,  tags} = req.query;
        
         let serachCriteria : any = {user: userId};

         if ( contentType ) {
            serachCriteria.contentType = contentType;
         }

         if ( title) {
            serachCriteria.title = {$regex : title, $options : 'i'};
         }

         if (tags) {
            const tagArray = Array.isArray(tags )
         }

    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export default brainRoute;

