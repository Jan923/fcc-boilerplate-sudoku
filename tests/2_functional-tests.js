const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzleString1 = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
let validSolution1 = '473891265851726394926345817568913472342687951197254638734162589685479123219538746';
let invalidInput = '1.5%.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let tooLongInput = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..';
let validInput2 = '115..2284..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Functional Tests', () => {

suite('POST /api/solve', () => {

   test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done){
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: validPuzzleString1})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.solution, validSolution1);
         done();
      })
   })

   test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done){
      chai.request(server)
      .post('/api/solve')
      .send({})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Required field missing');
         done();
      })
   })

   test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done){
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: invalidInput})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Invalid characters in puzzle');
         done();
      })
   })

   test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done){
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: tooLongInput})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
         done();
      })
   })

   test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done){
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: validInput2})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Puzzle cannot be solved');
         done();
      })
   })
   
})

suite('POST /api/check', () => {

   test('Check a puzzle placement with all fields: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'A1', value: '3'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.valid, true);
         done();
      })
   })

   test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'A1', value: '1'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.valid, false);
         assert.equal(res.body.conflict.length, 1);
         done();
      })
   })

   test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'A1', value: '7'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.valid, false);
         assert.isAtLeast(res.body.conflict.length, 2);
         done();
      })
   })

   test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'F2', value: '7'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.valid, false);
         assert.equal(res.body.conflict.length, 3);
         done();
      })
   })

   test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: '', value: ''})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Required field(s) missing');
         done();
      })
   })
 
   test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: '%3', value: '1'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Invalid coordinate');
         done();
      })
   })

   test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'A32', value: '1'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Invalid coordinate');
         done();
      })
   })

   test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'O3', value: '1'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Invalid coordinate');
         done();
      })
   })

   test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done){
      chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString1, coordinate: 'A1', value: '10'})
      .end(function (err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.error, 'Invalid value');
         done();
      })
   })
   
})
  
});

