import jwt from 'jsonwebtoken';
import prisma from './prisma.js';

export function generateTokenandSetCookie(userId, res){
    const token = jwt.sign({userId},"codikssecret",{
        expiresIn: '15d',
    });

    res.cookie("user",token,{
        maxAge: 15*24*60*60*1000,

    });
}
export async function protectRoute(req,res,next){
    try {
        const token = req.cookies.user;
        if(!token) return res.status(401).json({msg:"Unauthorized or no token provided"});
        const decoded = jwt.verify(token,"codikssecret");
        if(!decoded) return res.status(401).json({msg:"Unauthorized or Invalid token"});

        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });

    }
}