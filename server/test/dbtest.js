"use strict";

var db = require('../dbConfig.js');
var expect = require('chai').expect;

describe("Tests for neo4j database", function(){

	// test beer object
	var beerObj = {
		lables: {
			large: 'http://darrylscouch.com/wp-content/uploads/2013/05/Mystery_Beer.png',
			icon: 'http://blogs.citypages.com/food/beer%20thumbnail.jpg',
			medium: 'http://foodimentaryguy.files.wordpress.com/2014/09/chromblog-thermoscientific-com.jpg'
		},
		name: 'testBeer',
		ibu: 'testIbu',
		abv: 'testAbv',
		description: 'This beer is for test.',
	};

	var user = {
		body: {
			username: 'testUser',
			password: '123'
		}
	};

	describe("Test for beer node", function(){
		this.timeout(15000);
		// delete the test beer after testing
		after(function(done){
			db.query('MATCH (b:Beer {name: {name}}) DELETE b;', beerObj, function(err, result){
				done(err);
			});
		});


		it("Should create a new beer", function(done){
			expect(db).to.have.property('createBeerNode');
			db.createBeerNode(beerObj, function(){
				db.query("MATCH (b:Beer {name: {name}, ibu: {ibu}, abv: {abv}, description: {description}}) RETURN b;",
					beerObj,
					function(err, result){
						if(err){
							done(err);
						}else{
							expect(result).to.not.be.empty;
							var beernode = result[0].b._data.data;
							expect(result).to.have.length(1);
							expect(beernode).to.have.property('imgUrl',
								'http://darrylscouch.com/wp-content/uploads/2013/05/Mystery_Beer.png');
							expect(beernode).to.have.property('iconUrl',
								'http://blogs.citypages.com/food/beer%20thumbnail.jpg');
							expect(beernode).to.have.property('medUrl',
								'http://foodimentaryguy.files.wordpress.com/2014/09/chromblog-thermoscientific-com.jpg');
							done();
						}
					});
			});
		});

		it("Should get an existing beer", function(done){
			db.getOneBeer(beerObj.name, function(beer){
				expect(beer).to.be.ok;
				expect(beer).to.have.property('name','testBeer');
				done();
			});
		});
	});

	describe('Test for user', function(){
		this.timeout(15000);

		var user2 = {
			body: {
				username: "testUser2",
				password: "123"
			}
		}

		var beerObj2 = {
			name: "testBeer2"
		}

		before(function(done){
			db.createBeerNode(beerObj, function(){
				db.createBeerNode(beerObj2, function(){
					db.query("Create (u:User {username: {username}, password: {password}})", user2.body, function(err){
						if(err) throw err;
						db.query('MATCH (u:User),(b:Beer)\nWHERE u.username=({username}) AND b.name=({beername})\nMERGE (u)-[l:Likes {rating: ({rating})}]->(b)',
							{username: user2.body.username, beername: beerObj.name, rating: 3},
							function(err){
								if(err) throw err;
								db.query('MATCH (u:User),(b:Beer)\nWHERE u.username=({username}) AND b.name=({beername})\nMERGE (u)-[l:Likes {rating: ({rating})}]->(b)',
									{username: user2.body.username, beername: beerObj2.name, rating: 3},
									function(err){
										if(err) throw err;
										done();
									}
								);
							}
						);
					});
				});
			});
		});

		after(function(done){
			db.query('MATCH (u:User {username: {username}}) - [r] - (b) DELETE u, r', user.body, function(err, result){
				if(err) throw err;
				db.query('MATCH (u:User {username: {username}}) - [r] - (b) DELETE u, r', user2.body, function(err, result){
					if(err) throw err;
					db.query('MATCH (b:Beer {name: {name}}) DELETE b;', beerObj, function(err, result){
						if(err) throw err;
						db.query('MATCH (b:Beer {name: {name}}) DELETE b;', beerObj2, function(err, result){
							if(err) throw err;
							done();
						});
					});
				});
			});
		});

		it("Should generate a new user", function(done){
			db.addUserToDatabaseIfUserDoesNotExist(user, function(result){
				db.query('MATCH (u:User {username:{username}}) return u', user.body, function(err, result){
					if(err) throw err;
					var matchedUser = result[0].u._data.data;
					expect(matchedUser).to.have.property('username', 'testUser');
					done();
				});
			});
		});

		it("Should generate like relationship", function(done){
			var beer = {beername: beerObj.name};
			db.generateLikes(user.body, beer, 4, function(err){
				if(err) throw err;
				db.query("MATCH (u:User {username: {username}}) - [r:Likes] - (b:Beer {name: {beername}}) return r",
					{username: user.body.username, beername: beer.beername},
					function(err, result){
						if(err) throw err;
						var likes = result[0].r._data.data;
						expect(likes).to.have.property('rating', 4);
						done();
					}
				);
			})
		});


		it("Should generate similarity relationship", function(done){
			db.generateSimilarity(user.body, function(err){
				if(err) throw err;
				db.query("MATCH (u1:User {username: {username}}) - [r: Similarity] - (u2:User) RETURN r", user.body, function(err, result){
					if(err) throw err;
					var similarity = result[0].r._data.data;
					expect(similarity).to.have.property('similarity');
					done();
				});
			})
		});

		it("Should generate recommendations to user", function(done){
			db.generateRecommendation(user.body, function(err, result){
				if(err) throw err;
				expect(result).to.have.length(1);
				var recommendatonBeer = result[0];
				expect(recommendatonBeer).to.have.property('Recommendation', 3);
				done();
			});
		});
	});
})