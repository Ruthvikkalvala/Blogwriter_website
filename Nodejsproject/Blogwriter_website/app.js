//express framework
const express = require('express');

const morgan = require('morgan')

const mongoose = require('mongoose')
const Blog = require('./Models/blog');


//express app
const app = express();

//connect mongodb
const db = 'mongodb+srv://blogninja:Test1234@blognode.l90gr3o.mongodb.net/Blogger?retryWrites=true&w=majority'
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
             .then((result) => (console.log('connected to db')))
             .then((result) => app.listen(2000))
             .catch((err) => console.log(err));



        
//register view engine

app.set('view engine', 'ejs');





//middleware and static files.
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); 



//routes
app.get('/',(req,res) =>
{
    res.redirect('/blogs');
});


app.get('/about',(req,res) =>
{
    //res.send('<p>about page </p>');
    res.render('about',{title: 'About'});
});

//blog routes
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});
  
  app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { blogs: result, title: 'All Blogs' });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
  
    blog.save()
      .then(result => {
        res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
  });
    
  //to get blog details
  app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });
  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });


//404
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
