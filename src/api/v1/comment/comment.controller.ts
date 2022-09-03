import { RequestHandler } from 'express';
import that from './comment.service'
const { createCommentService }  = that
export const createComment : RequestHandler = async (req, res, next) => {
    try {
        const { body, reviewId, parentId, author, userId} = req.body

    }
    catch (err) {
        
    }
}