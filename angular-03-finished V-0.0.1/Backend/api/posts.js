const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


//  Multer Config
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){    
            error = null;
        }
        cb(error, './images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});


// Bring All Model Here
const Post = require('../models/post');

router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content:req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
   post.save()
   .then(createPost => {
       return res.status(201).json({
           success: true,  message: 'Post added successfully',
           post:{
               ...createPost,
               id: createPost._id,    
           }
    });
   }).catch(err => {
       res.status(500).json({
           message: 'Creating a post failed!'
       })
   }); 
});


router.get('', (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find()
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    postQuery
    .then(postDoc => {
        fetchedPosts = postDoc;
        return Post.countDocuments();
    })
    .then(count => {
        return res.status(200).json({
            posts: fetchedPosts,
            message: 'Post fatched successfully!',
            maxPosts: count
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Fetching posts failed!"
        })
    });
});


router.put('/:id', checkAuth, multer({storage: storage}).single('image'),  (req, res) => {
    
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    } 
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(updateDoc =>{
        if(updateDoc.nModified > 0){
            res.status(200).json({success: true, message: 'Update successful!'});
        }else{
            res.status(401).json({success: false, message: 'Not authorized for update post!'});
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Couldn't update post!"
        })
    })
});


router.get('/:id', checkAuth, (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post not found!'})
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Fetching post failed!"
        })
    });
});


router.delete('/:id',checkAuth, (req, res) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(deleteDoc => {
        if(deleteDoc.n > 0){
            res.status(200).json({success: true, message: 'Post deleted!'});
        }else{
            res.status(401).json({success: false, message: 'Not authorized for delete post!'});
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Fetching posts failed!"
        })
    });; 
});


module.exports = router;