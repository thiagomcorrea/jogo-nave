var nave, dirYNav, dirXNav, velNav, velTiro, posYNav, posXNav;
var vidaPlaneta, barraPlaneta;
var velBomba, tempoCriarBomba;
var tamTelaW, tamTelaH;
var jogo;
var frame;
var qtdeBombas, painelBombas;
var idExplosao;
var idSom;
var telaMsg;

function teclaUp(){
    var tecla= event.keyCode;

    if(tecla == 37 || tecla == 39){//esquerda ou direita
        dirXNav=0;
    }

    if(tecla == 38 || tecla == 40){//cima ou baixo
        dirYNav=0;
    }
}
function teclaDown(){
    var tecla= event.keyCode;

    if(tecla == 37){//esquerda 
        dirXNav=-1;
    }else if(tecla == 39){//direita
        dirXNav=1;
    }

    if(tecla == 38){//cima
        dirYNav=-1;
    }else if(tecla == 40){//baixo
        dirYNav=1;
    }

    //tecla de tiro
    if(tecla == 32){//espaço
        //+17 para posicionar no meio da nave
        atira(posXNav+17,posYNav);
    }
}

function criarBombas(){
    if(jogo){
       var posYBomba= 0;
       var posXBomba= Math.random()*tamTelaW;
       var bomba= document.createElement('div');
       var attClass= document.createAttribute('class');
       var attStyle= document.createAttribute('style');
       attClass.value= 'bomba';
       attStyle.value= `top:${posYBomba}px; left:${posXBomba}px`;
       bomba.setAttributeNode(attClass);
       bomba.setAttributeNode(attStyle);
       document.body.appendChild(bomba);
       qtdeBombas--;
    }
}
function controlaBomba(){
    var bombas= document.getElementsByClassName('bomba');
    for(var cont=0; cont<bombas.length; cont++){
        if(bombas[cont]){
            var posBomba= bombas[cont].offsetTop;
            posBomba+= velBomba;
            bombas[cont].style.top= posBomba + 'px';
            if(posBomba > tamTelaH){
                vidaPlaneta-=50;
                criaExplosao(2, bombas[cont].offsetLeft, null)
                bombas[cont].remove();
            }
        }
    }
}

function atira(posx,posy){
    var divTiro= document.createElement('div');
    var attClass= document.createAttribute('class');
    var attStyle= document.createAttribute('style');
    attClass.value= 'tiroNav';
    attStyle.value= `top:${posy}px; left:${posx}px`;
    divTiro.setAttributeNode(attClass);
    divTiro.setAttributeNode(attStyle);
    var audio= document.createElement('audio');
    var attSrc= document.createAttribute('src');
    attSrc.value= 'assets/tiro.wav';
    audio.setAttributeNode(attSrc);
    divTiro.appendChild(audio);
    document.body.appendChild(divTiro);
    audio.play(); 
}
function controleTiros(){
    var tiros= document.getElementsByClassName('tiroNav');
    for(var cont=0; cont<tiros.length; cont++){
        if(tiros[cont]){
            var posTiro= tiros[cont].offsetTop;
            posTiro-=velTiro;
            tiros[cont].style.top= posTiro + 'px';
            colisaoTiroBomba(tiros[cont]);
            if(posTiro < 0){
                tiros[cont].remove()
            }
        }
    }
}

function colisaoTiroBomba(tiro){

    var bombas= document.getElementsByClassName('bomba');
    for(var cont=0; cont<bombas.length; cont++){
        if(bombas[cont]){
            var topoTiro= tiro.offsetTop;
            var baseTiro= tiro.offsetTop+6;
            var ladoEsquerdoTiro= tiro.offsetLeft;
            var ladoDireitoTiro= tiro.offsetLeft+6;
            var topoBomba= bombas[cont].offsetTop;
            var baseBomba= bombas[cont].offsetTop+40;
            var ladoEsquerdoBomba= bombas[cont].offsetLeft;
            var ladoDireitoBomba= bombas[cont].offsetLeft+24;
            var colisaoY= (topoTiro <= baseBomba && baseTiro >= topoBomba);
            var colisaoX= (ladoEsquerdoTiro <= ladoDireitoBomba && ladoDireitoTiro >= ladoEsquerdoBomba);

           if(colisaoX && colisaoY){
                criaExplosao(1, ladoEsquerdoBomba, topoBomba);
                bombas[cont].remove();
                tiro.remove();
           }
        }
    }
}

function criaExplosao(tipo, posx, posy){

    if(document.getElementById('explosao' + (idExplosao-5))){
        document.getElementById('explosao' + (idExplosao-5)).remove();
    }

    var explosao= document.createElement('div');
    var img= document.createElement('img');
    var audio= document.createElement('audio');
    
    //atributos para div
    var attClass= document.createAttribute('class');
    var attStyle= document.createAttribute('style');
    var attIdDiv= document.createAttribute('id');

    //atributos para img
    var attSrcImg= document.createAttribute('src');

    //atributos para audio
    var attSrcAudio= document.createAttribute('src');
    var attIdAudio= document.createAttribute('id')

    attIdDiv.value= 'explosao'+idExplosao;
    if(tipo == 1){//explosão no ar
        attClass.value= 'explosaoAr';
        attStyle.value= `top:${posy}px; left:${posx-17}px`;
        attSrcImg.value= 'assets/explosao_ar.gif?' + new Date();
    }else{//explosão na terra
        attClass.value= 'explosaoTerra'
        attStyle.value= `top:${tamTelaH-57}px; left:${posx-17}px`;
        attSrcImg.value= 'assets/explosao_chao.gif?' + new Date();
    }
    attSrcAudio.value= 'assets/exp1.mp3?' + new Date();
    attIdAudio.value= 'som' + idSom;

    explosao.setAttributeNode(attClass);
    explosao.setAttributeNode(attStyle);
    explosao.setAttributeNode(attIdDiv);

    img.setAttributeNode(attSrcImg);
    audio.setAttributeNode(attIdAudio);
    audio.setAttributeNode(attSrcAudio);

    explosao.appendChild(img);
    explosao.appendChild(audio);
    document.body.appendChild(explosao);
    document.getElementById('som' + idSom).play();


    idExplosao++;
    idSom++;
}

function controlaNave(){
    posYNav+= dirYNav*velNav;
    posXNav+= dirXNav*velNav;
    if((posXNav+40) >= tamTelaW){
        posXNav= tamTelaW-40;
    }else if(posXNav <= 0){
        posXNav= 0;
    }
    if((posYNav+40) >= tamTelaH){
        posYNav= tamTelaH-40;
    }else if(posYNav <= 0){
        posYNav= 0;
    }

    nave.style.top= posYNav +'px';
    nave.style.left= posXNav +'px';

}

function gerenciaGame(){
    barraPlaneta.style.width= vidaPlaneta + 'px';
    if(qtdeBombas == 0){
        jogo= false;
        clearInterval(tempoCriarBomba);
        telaMsg.style.backgroundImage= "url('assets/vitoria.jpg')";
        telaMsg.style.display= 'block';
    }
    if(vidaPlaneta == 0){
        jogo= false;
        clearInterval(tempoCriarBomba);
        telaMsg.style.backgroundImage= "url('assets/derrota.jpg')";
        telaMsg.style.display= 'block';
    }
}

function gameloop(){
    if(jogo){
        controlaNave();
        controleTiros();
        controlaBomba();
        gerenciaGame();
    }
    frame= requestAnimationFrame(gameloop);
}

function reiniciar(){
    var bombas= document.getElementsByClassName('bomba');
    for(var cont=0; cont<bombas.length; cont++){
        if(bombas[cont]){
            bombas[cont].remove();
        }
    }
    telaMsg.style.display= 'none';
    clearInterval(tempoCriarBomba);
    cancelAnimationFrame(frame);
    vidaPlaneta= 300;
    posYNav= tamTelaH/2;
    posXNav= tamTelaW/2;
    nave.style.top= posYNav +'px';
    nave.style.left= posXNav +'px';
    qtdeBombas= 15;
    jogo= true;
    tempoCriarBomba= setInterval(criarBombas, 1700);
    gameloop();
}

function inicia(){
    jogo= false;

    //pegando tamanhos da tela
    tamTelaH= window.innerHeight;
    tamTelaW= window.innerWidth;

    //iniciando variáveis relacionadas a nave
    dirYNav=dirXNav=0;
    posYNav= tamTelaH/2;
    posXNav= tamTelaW/2;
    velNav=velTiro= 7;
    nave= document.getElementById('naveJog');

    //posicionando a nave
    nave.style.top= posYNav +'px';
    nave.style.left= posXNav +'px';

    //controle das bombas
    qtdeBombas= 30;
    velBomba= 3;

    //controle do planeta
    vidaPlaneta= 300;
    barraPlaneta= document.getElementById('barraPlaneta');
    barraPlaneta.style.width= vidaPlaneta + 'px';

    //controle explosões
    idExplosao= idSom= 0;

    //telas
    telaMsg= document.getElementById('telaMsg');
    telaMsg.style.backgroundImage= "url('assets/intro.jpg')";
    telaMsg.style.display= 'block';

    document.getElementById('btnJogar').addEventListener('click', reiniciar)

}

window.addEventListener('load', inicia);
document.addEventListener('keydown', teclaDown);
document.addEventListener('keyup', teclaUp);