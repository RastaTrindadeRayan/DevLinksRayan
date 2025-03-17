 function toggleMode()  {
 const html= document.documentElement
html.classList.toggle("Light")

const img = document.querySelector("#profile img")

if(html.classList.contains("Light")) {

  img.setAttribute("src", "./assets/Avatar.png") 
} else {
  
  img.setAttribute("src", "./assets/avatarblack.png")
}
if(html.classList.contains("Light")) {
  img.setAttribute("alt", "Foto de Rayan Trindade com um leve sorriso de camiseta listrada em azul preto branco e vermelho com a parede de fundo da cor cinza claro")
} else {
img.setAttribute(
  "alt",
  "Rayan com uma touca colorida com as cores da bandeira da Etiopia e uma cachoeira de fundo")
}

if(html.classList.contains("Light")) {

 links.setAttribute("href", "http://127.0.0.1:5500/assets/Avatar.png")
 } else {
  
links.setAttribute("href", "http://127.0.0.1:5500/assets/avatarblack.png")
} 
 }{
 const tv = document.querySelector(".tv")
 const player = document.querySelector(".player")
 const enemy = document.querySelector(".enemy")
 const score = document.querySelector(".score")

 let x = window.innerWidth
 let y = 90
 let enemySpeed = 5
 let count = 0
 let msg
 let gameEnd = false

 window.addEventListener("click", () => {
   player.style.bottom = `${y}px`
   setTimeout((e) => {
     player.style.bottom = `10px`
   }, 800)
 })

 function run() {
   let playerCoord = player.getBoundingClientRect()
   let enemyCoord = enemy.getBoundingClientRect()

   if (!gameEnd) {
     x -= enemySpeed
   }

   if (x < -60) {
     count += 1
     x = window.innerWidth
   }

   score.innerText = `Score: ${count}`
   enemy.style.left = `${x}px`

   if (
     (enemyCoord.bottom <= playerCoord.bottom ||
       (enemyCoord.bottom < playerCoord.bottom + 70 &&
         enemyCoord.left >= playerCoord.left)) &&
     (enemyCoord.left == playerCoord.left + 50 ||
       enemyCoord.left <= playerCoord.left)
   ) {
     x = window.innerWidth + 400

     player.style.bottom = `10px`
     msg = (`You lose !\n\n Your Score is ${count}`)
     count = 0
     gameEnd = true

     if (msg === true) {
       gameEnd = false
     }
   }

   requestAnimationFrame(run)
 }

 run()} // valeu






