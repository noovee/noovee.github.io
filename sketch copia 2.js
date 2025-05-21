function setup(){
   createCanvas(800, 600)
}

function draw(){
   //background(220)

   if(mouseIsPressed){

   noStroke()
   fill(255, 0, 0)
   ellipse(mouseX, mouseY, 20, 20)
   //simmetria
   ellipse(width - mouseX, mouseY, 20, 20)
}

}