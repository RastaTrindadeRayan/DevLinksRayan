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
 }