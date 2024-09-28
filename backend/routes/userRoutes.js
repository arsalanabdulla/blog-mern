const {Router}=require('express')
const {register,login,getUser,changeAvatar,editUser,getAuthors}=require('../controllers/userController')
const authMiddleware=require('../middleware/authMiddleware')

const router=Router()

router.post('/register',register)
router.post('/login',login)
router.get('/:id',getUser)
router.get('/',getAuthors)
router.post('/change-avatar',authMiddleware,changeAvatar)
router.patch('/edit-user',authMiddleware,editUser)

module.exports=router