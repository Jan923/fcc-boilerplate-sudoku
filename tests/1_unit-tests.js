const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let validInput1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let result1 = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
let invalidInput = '1.5%.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let tooLongInput = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..';
let validInput2 = '115..2284..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let validInput3 = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
let result3 = '218396745753284196496157832531672984649831257827549613962415378185763429374928561';

suite('Unit Tests', () => {

suite('string input tests', () => {

  test('Logic handles a valid puzzle string of 81 characters', function(done){
    assert.equal(solver.validate(validInput1), true);
    done();
  })

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done){
    assert.equal(solver.validate(invalidInput), 'Invalid characters in puzzle');
    done();
  })

  test('Logic handles a puzzle string that is not 81 characters in length', function(done){
    assert.equal(solver.validate(tooLongInput), 'Expected puzzle to be 81 characters long');
    done();
  })
  
})

suite('row placement tests', () => {

  test('Logic handles a valid row placement', function(done){
    assert.equal(solver.checkRowPlacement(validInput1, 'A', 2, '3'), true);
    done();
  })

  test('Logic handles a invvalid row placement', function(done){
    assert.equal(solver.checkRowPlacement(validInput1, 'A', 2, '2'), false);
    done();
  })
  
})

suite('column placement tests', () => {

  test('Logic handles a valid column placement', function(done){
    assert.equal(solver.checkColPlacement(validInput1, 'A', 2, '3'), true);
    done();
  })

  test('Logic handles a invalid column placement', function(done){
    assert.equal(solver.checkColPlacement(validInput1, 'A', 2, '9'), false);
    done();
  })
  
})

suite('region placement tests', function(done){

  test('Logic handles a valid region (3x3 grid) placement', function(done){
    assert.equal(solver.checkRegionPlacement(validInput1, 'A', 2, '3'), true);
    done();
  })

  test('Logic handles a invalid region (3x3 grid) placement', function(done){
    assert.equal(solver.checkRegionPlacement(validInput1, 'A', 2, '6'), false);
    done();
  })
  
})

suite('puzzle string solver tests', () => {

  test('Valid puzzle strings pass the solver', function(done){
    assert.equal(solver.solve(validInput1), result1);
    done();
  })

  test('Invalid puzzle strings fail the solver', function(done){
    assert.equal(solver.solve(validInput2), false);
    done();
  })

  test('Solver returns the expected solution for an incomplete puzzle', function(done){
    assert.equal(solver.solve(validInput3), result3);
    done();
  })
  
})

});
