const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// GET all galleries for homepage
router.get('/', async (req, res) => {
    try {
      const dbPostData = await Post.findAll({
        attributes: [
            'id',
            'title',
            "post_content",
            'created_at'      
          ],
          include: [
            {
              model: Comment,
              attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
            {
              model: User,
              attributes: ['username']
            }
        ],
      });
  
      const posts = dbPostData.map((post) =>
        post.get({ plain: true })
      );
      // pass a single post object into the homepage template
      res.render('homepage', { 
        posts,
        loggedIn: req.session.loggedIn 
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});


router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

module.exports = router;
