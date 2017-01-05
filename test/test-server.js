const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);


describe('Blog Posts', function() {
	// add hooks to async start server before running and close when complete
	before(function() {
		return runServer;
	});
	after(function() {
		return closeServer;
	});
	
	// make requests and examine res body 
	it('should list current blog posts on GET', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);

				const expectedKeys = ['title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(post) {
					post.should.be.a('object');
					post.should.include.keys(expectedKeys);
				});
			});
	});

	it('should add a blog post on POST', function() {
	    const newPost = {title: 'New Post', content: 'This is the text for my new post', author: 'Jane Doe', publishDate: 'July 31, 1980'};
	    return chai.request(app)
	      	.post('/blog-posts')
	      	.send(newPost)
	      	.then(function(res) {
		      	res.should.have.status(201);
		        res.should.be.json;
		        res.body.should.be.a('object');
		        res.body.should.include.keys('title', 'content', 'author', 'publishDate');
		        res.body.id.should.not.be.null;

		        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
	      	});
	  	});

	it('should update blog post on PUT', function() {
	    const updateData = {
	      title: 'Updated Post', 
	      content: 'This is the updated text for my updated post', 
	      author: 'Jane Doe', 
	      publishDate: 'October 31, 1981'
	    };

	    return chai.request(app)
	      // first have to get so we have an idea of object to update
	      	.get('/blog-posts')
	      	.then(function(res) {
	        	updateData.id = res.body[0].id;

	        	return chai.request(app)
	          	.put(`/blog-posts/${updateData.id}`)
	          	.send(updateData);
	      	})

	      	.then(function(res) {
		        res.should.have.status(200);
		        res.should.be.json;
		        res.body.should.be.a('object');
		        res.body.should.deep.equal(updateData);
	      	});
  	});

  	it('should delete blog post on DELETE', function() {
    	return chai.request(app)
     	.get('/blog-posts')
      	.then(function(res) {
        	deleteData.id = res.body[0].id;

        	return chai.request(app)
        	.delete(`/blog-posts/${deleteData.id}`);
      	})
      	
      	.then(function(res) {
        	res.should.have.status(204);
      	});
  	});
})