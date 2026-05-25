export const getCurrentUser = (req, res) => {
    try{
        if(!req.user){
            return res.status(404).json({message: "User not found"})
        }
        res.json({user: req.user})
    }
    catch(err){
        res.status(500).json({message: "Internal server error"})
    }
}