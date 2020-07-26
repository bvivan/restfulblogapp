const bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  mongoose   = require("mongoose"),
	  express    = require("express"),
	  app        = express();

//APP CONFIG

mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG

const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})
const Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/", (req, res) => {
	res.redirect("/blogs")
})

app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			console.log("Error!");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//NEW ROUTES
app.get("/blogs/new", (req,res) => {
	res.render("new");
});

//CREATE ROUTES
app.post("/blogs", (req,res) => {
	// req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});


//SHOW ROUTES
app.get("/blogs/:id", (req,res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog})
		}
	});
});


// EDIT ROUTES
app.get("/blogs/:id/edit", (req,res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTES
app.put("/blogs/:id", (req,res) => {
	// req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	}
)});


// DELETE ROUTES
app.delete("/blogs/:id", (req, res) => {
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	})
	// redirect somewhere
});

app.listen(3000, () => {
	console.log("There you go!")
});