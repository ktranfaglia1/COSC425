
import {visLatticeArray, visBounds, latticeArray, createVis} from "./generateLattice.js";


//Grabs Canvas and Context Data of the Canvas
const canvas = document.getElementById('latticeRegion');
const ctx = canvas.getContext('2d')

canvas.width = .9 * window.innerWidth;

canvas.height = .64 * window.innerHeight;


export {canvas, ctx};

displayLattice(visLatticeArray);

export function displayLattice(visLatticeArray)
{
    createVis(canvas);

    for(let i = 0; i < visLatticeArray.length; i++)
    {
        for(let j = 0; j < visLatticeArray[0].length; j++)
        {
            visLatticeArray[i][j].drawCell(ctx)
        }
    }
}