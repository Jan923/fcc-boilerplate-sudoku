class SudokuSolver {

  validate(puzzleString) {
    if(!puzzleString){
      return 'Required field missing'
    }
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long'
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return 'Invalid characters in puzzle'
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const rowValues = puzzleString.slice(rowIndex * 9, rowIndex * 9 + 9).split('');
    if (rowValues[column - 1] === value) {
      return true;
    }
    return !rowValues.includes(value)
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = column - 1;
    const colValues = puzzleString.split('').filter((_, i) => i % 9 === colIndex);
    if (colValues[row.charCodeAt(0) - 'A'.charCodeAt(0)] === value) {
      return true;
    }
    return !colValues.includes(value)
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor((row.charCodeAt(0) - 'A'.charCodeAt(0)) / 3);
    const regionCol = Math.floor((column - 1) / 3);
    const regionValues = puzzleString.split('').filter((_, i) => {
      const rowIndex = Math.floor(i / 9);
      const colIndex = i % 9;
      return rowIndex >= regionRow * 3 && rowIndex < regionRow * 3 + 3 && colIndex >= regionCol * 3 && colIndex < regionCol * 3 + 3;
    });
    if (regionValues[row.charCodeAt(0) - 'A'.charCodeAt(0) * 9 + column - 1] === value) {
      return true;
    }
    return !regionValues.includes(value)
  }

  solve(puzzleString) {
    let puzzle = puzzleString.split('');
    let solution = [];
    let index = 0;

    const solvePuzzle = (index, tempPuzzle = puzzle) => { 
      if (index === puzzle.length) {
        return puzzle.join('');
        //return true; // Success!
      }

      if (puzzle[index] !== '.') {
        // If cell has existing value, move to the next
        return solvePuzzle(index + 1, tempPuzzle); 
      }

      // Optimized Value Selection:
      // Calculate the number of potential values for each number (1-9)
      let potentialValues = {};
      for (let i = 1; i <= 9; i++) {
        potentialValues[i.toString()] = 0;
      }

      const row = Math.floor(index / 9);
      const col = index % 9;

      for (let i = 1; i <= 9; i++) {
        const value = i.toString();
        const tempPuzzleString = tempPuzzle.join(''); 

        if (this.checkRowPlacement(tempPuzzleString, String.fromCharCode(row + 'A'.charCodeAt(0)), col + 1, value) && 
            this.checkColPlacement(tempPuzzleString, String.fromCharCode(row + 'A'.charCodeAt(0)), col + 1, value) && 
            this.checkRegionPlacement(tempPuzzleString, String.fromCharCode(row + 'A'.charCodeAt(0)), col + 1, value)) {
          potentialValues[value]++; 
        }
      }

      // Sort potentialValues by number of potential values (least to most)
      let sortedValues = Object.entries(potentialValues).sort((a, b) => a[1] - b[1]); 

      // Try values in order of least constraints first
      for (let [value, count] of sortedValues) {
        let tempPuzzleString = tempPuzzle.join(''); 

        if (this.checkRowPlacement(tempPuzzleString, String.fromCharCode(row + 'A'.charCodeAt(0)), col + 1, value) && 
            this.checkColPlacement(tempPuzzleString, String.fromCharCode(row + 'A'.charCodeAt(0)), col + 1, value) && 
            this.checkRegionPlacement(tempPuzzleString, String.fromCharCode(row + 'A'.charCodeAt(0)), col + 1, value)) { 

          tempPuzzle[index] = value; 

          if (solvePuzzle(index + 1, tempPuzzle)) { 
            solution.push(value);
            puzzle[index] = value;
            //console.log(puzzle);
            return true; 
          } else {
            // If the recursive call returns false, revert the change
            tempPuzzle[index] = '.'; 
          } 
        }
      }
      return false; // No valid value found for this index
    }

    return solvePuzzle(0) ? puzzle.join('') : false;
  }
}

module.exports = SudokuSolver;

