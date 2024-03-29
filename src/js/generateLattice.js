import {currentLattice, rule, canvas, size, latSize, ruleNum, boundaryCon} from './displayLattice.js';
import {cell} from './cellClass.js';
import {alterRule, alterRuleNum} from './displayLattice.js';
//let imports = require("displayLattice.js");
//console.log(imports);

//Generates rule array based on input rule number.
export function ruleNumToRule(ruleNum) {
  //Converts rule number to binary represented as an array of 0s and 1s.
  //console.log(ruleNum)
  let neoRule = new Array();
  let ruleNumCopy = ruleNum;
  for(let i = 0; i < 8; i++)
  {
    neoRule[i] = ruleNumCopy % 2;
    ruleNumCopy = Math.floor(ruleNumCopy / 2);
  }
  alterRule(neoRule);
  console.log(rule)
  return rule
}

//Generates the next lattice based on the current one, the rule, and the boundary condition.
export function generateLattice(currentLattice, rule, boundaryCon, rowIndex, size) {
  	let newLattice = new Array();
  	let startDif = (latSize * size) / 2;
  	let center = canvas.width / 2;
  	let startX = center - startDif;
	//If boundary condition is periodic:
    if (boundaryCon == 1) {
		//Iterate over length of new lattice
		for(let i = 0; i < currentLattice.length; i++) {
			newLattice.push(new cell (size, size, startX + i * size, rowIndex * size, 0))
			//If this is the first cell, access the last cell from previous timestep
			//If this is the last cell, access the first cell from previous timestep
			//Otherwise, access the above three cells normally.
			if (i == 0) {
				newLattice[i].setColor(rule[(currentLattice[currentLattice.length - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
			else if (i == (currentLattice.length - 1)) {
				newLattice[i].setColor(rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[0].color]);
			}
			else {
				newLattice[i].setColor(rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
		}
	}
	//If boundary condition is null:
	else {
		//Iterate over length of new lattice
		for(i = 0; i < currentLattice.length; i++) {
			newLattice.push(new cell (size, size, startX + i * size, rowIndex * size, 0));
			//If this is the first cell, value of cell to the left is considered 0
			//If this is the last cell, value of cell to the right is considered 0
			//Otherwise, access the above three cells normally.
			if (i == 0) {
				newLattice[i].setColor(rule[(currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
			else if (i == (currentLattice.length - 1)) {
				newLattice[i].setColor(rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2)]);
			}
			else {
				newLattice[i].setColor(rule[(currentLattice[i - 1].color * 4) + (currentLattice[i].color * 2) + currentLattice[i + 1].color]);
			}
		}
	}
  return newLattice;
}