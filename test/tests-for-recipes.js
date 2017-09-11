'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const{app, runServer, closeServer} = require('../server');
const should = chai.should;
chai.use(chaiHttp);

describe('Recipes', function() {
  
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return recipes on GET', function(){
    return chai.request(app)
      .get('/recipes')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item){
          item.should.be.a('object');
          item.should.have.all.keys(
            'name', 'ingredients', 'id'
          );
        });
      });
  });

  it('should add recipe on POST', function(){
    const newRecipe = {name: 'macNcheese', ingredients: ['noodles', 'milk', 'butter', 'cheese']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(
          'name', 'ingredients', 'id'
        );
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newRecipe, {id:res.body.id}));
      });
  });

  it('should update recipe on PUT', function(){
    const modRecipe = {name: 'modRecipe', ingredients: ['ingred1', 'ingred2']};
    return chai.request(app)
      .get('/recipes')
      .then(function(res){
        modRecipe.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${modRecipe.id}`)
          .send(modRecipe);
      })
      .then(function(res){
        res.should.have.status(204);
      });
  });

  it('should delete recipe on DELETE', function(){
    return chai.request(app)
      .get('/recipes')
      .then(function(res){
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res){
        res.should.have.status(204);
      });
  });

});