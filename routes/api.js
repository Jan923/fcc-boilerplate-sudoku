'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value){
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      if (solver.validate(puzzle) !== true) {
        res.json({ error: solver.validate(puzzle)});
        return;
      }
      const row = coordinate.split('')[0];
      const col = coordinate.split('')[1];
      if (!value.match(/^[1-9]$/)) {
        res.json({ error: 'Invalid value' });
        return;
      } else if (coordinate.length !== 2 || !row.match(/[A-I]/i) || !col.match(/[1-9]/)) {
        res.json({ error: 'Invalid coordinate' });
        return; 
      }

      let index = (row.charCodeAt(0) - 'A'.charCodeAt(0)) * 9 + (col - 1);
        if (puzzle[index] == value) {
          res.json({ valid: true });
          return;
        }
      
        if (solver.checkRowPlacement(puzzle, row, col, value) && solver.checkColPlacement(puzzle, row, col, value) && solver.checkRegionPlacement(puzzle, row, col, value)) {
           res.json({ valid: true })
        } else {
          let conflict = [];
          if (!solver.checkRowPlacement(puzzle, row, col, value)){
            conflict.push('row')
          }
          if (!solver.checkColPlacement(puzzle, row, col, value)){
            conflict.push('column')
          }
          if (!solver.checkRegionPlacement(puzzle, row, col, value)){
            conflict.push('region')
          }
          res.json({ valid: false, conflict })
        }
      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (solver.validate(puzzle) !== true) {
        res.json({ error: solver.validate(puzzle)});
        return;
      }
      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({error: 'Puzzle cannot be solved'});
      }
      return res.json({solution});
    });
};
