// ============================================
// AGRO SUSTENTÁVEL - VERSÃO ULTRA INTERATIVA
// Com animações, efeitos e personagens
// ============================================

let jogo;
let particulas = [];
let personagens = [];
let mensagemCount = 0;

function setup() {
    let canvas = createCanvas(1200, 500);
    canvas.parent('canvas-container');
    frameRate(60);
    
    jogo = new JogoSustentavel();
    
    // Criar partículas de polinização
    for (let i = 0; i < 60; i++) {
        particulas.push(new Particula());
    }
    
    // Criar personagens animados
    personagens.push(new Personagem("🧑‍🌾", width * 0.2, height - 80, "Agricultor"));
    personagens.push(new Personagem("🤖", width * 0.5, height - 85, "Robô Sustentável"));
    personagens.push(new Personagem("🦋", width * 0.7, height - 70, "Borboleta"));
    personagens.push(new Personagem("🐝", width * 0.85, height - 75, "Abelha"));
}

function draw() {
    desenharCenario();
    jogo.desenhar();
    
    for (let p of particulas) {
        p.mover();
        p.mostrar();
    }
    
    for (let p of personagens) {
        p.mover();
        p.mostrar();
        p.interagir(jogo);
    }
    
    desenharDica();
    
    // Atualizar contador de mensagens
    document.getElementById('message-counter').innerHTML = `💬 ${mensagemCount} msgs`;
}

function desenharCenario() {
    // Céu gradiente dinâmico
    for (let i = 0; i <= height; i++) {
        let inter = map(i, 0, height, 0, 1);
        let c = lerpColor(color(135, 206, 235), color(176, 224, 230), inter);
        stroke(c);
        line(0, i, width, i);
    }
    
    // Sol com brilho pulsante
    push();
    let pulse = sin(frameCount * 0.05) * 5;
    drawingContext.shadowBlur = 25 + pulse;
    drawingContext.shadowColor = "rgba(255, 200, 0, 0.6)";
    fill(255, 204, 0);
    noStroke();
    ellipse(width - 80, 70, 55 + pulse * 0.5, 55 + pulse * 0.5);
    pop();
    
    // Raios de sol girando
    for (let i = 0; i < 12; i++) {
        let angle = radians(i * 30 + frameCount * 2);
        let x = width - 80 + cos(angle) * 40;
        let y = 70 + sin(angle) * 40;
        stroke(255, 204, 0, 80);
        strokeWeight(2);
        line(width - 80, 70, x, y);
    }
    
    // Nuvens animadas
    fill(255, 255, 255, 230);
    for (let i = 0; i < 4; i++) {
        let x = (frameCount * 0.1 + i * 400) % (width + 300) - 150;
        ellipse(x, 60 + i * 35, 90, 55);
        ellipse(x + 40, 50 + i * 35, 70, 50);
        ellipse(x - 30, 55 + i * 35, 60, 45);
    }
    
    // Montanhas
    fill(76, 104, 65);
    noStroke();
    beginShape();
    vertex(0, height - 140);
    vertex(100, height - 200);
    vertex(250, height - 170);
    vertex(400, height - 220);
    vertex(550, height - 180);
    vertex(700, height - 210);
    vertex(850, height - 160);
    vertex(1000, height - 190);
    vertex(width, height - 150);
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Solo
    fill(101, 67, 33);
    rect(0, height - 95, width, 95);
    
    // Textura do solo
    stroke(80, 50, 20, 50);
    for (let i = 0; i < 300; i++) {
        point(random(width), random(height - 95, height));
    }
    
    // Grama
    fill(60, 179, 113);
    rect(0, height - 105, width, 10);
    
    // Flores animadas
    for (let i = 0; i < 25; i++) {
        let x = (frameCount * 0.3 + i * 60) % width;
        let y = height - 108 + sin(frameCount * 0.05 + i) * 2;
        fill(255, 182, 193);
        ellipse(x, y, 8, 8);
        fill(255, 255, 0);
        ellipse(x, y, 4, 4);
    }
}

function desenharDica() {
    if (!jogo.gameOver && !jogo.gameWin && jogo.ciclo < 10) {
        push();
        fill(0, 0, 0, 200);
        noStroke();
        rect(15, height - 70, 340, 45, 12);
        fill(255);
        textSize(12);
        textAlign(LEFT);
        text("💡 " + jogo.getDica(), 25, height - 45);
        
        // Ícone animado
        textSize(20);
        text("✨", 335, height - 42);
        pop();
    }
}

class Particula {
    constructor() {
        this.x = random(width);
        this.y = random(height - 140, height - 50);
        this.tamanho = random(2, 7);
        this.vx = random(-0.8, 0.8);
        this.vy = random(-0.5, 0.5);
        this.cor = color(random(255, 255), random(200, 255), random(0, 150));
        this.opacidade = random(100, 200);
    }
    
    mover() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < height - 140) this.y = height - 140;
        if (this.y > height - 50) this.y = height - 50;
    }
    
    mostrar() {
        fill(this.cor, this.opacidade);
        noStroke();
        ellipse(this.x, this.y, this.tamanho);
        
        // Brilho nas partículas
        fill(255, 255, 200, this.opacidade * 0.3);
        ellipse(this.x, this.y, this.tamanho * 1.5);
    }
}

class Personagem {
    constructor(emoji, x, y, nome) {
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.nome = nome;
        this.vx = random(-0.3, 0.3);
        this.animacao = 0;
        this.fala = "";
        this.tempoFala = 0;
    }
    
    mover() {
        this.x += this.vx;
        this.animacao += 0.1;
        
        if (this.x < 50) this.x = 50;
        if (this.x > width - 100) this.x = width - 100;
        
        // Mudar direção ocasionalmente
        if (frameCount % 180 === 0) {
            this.vx = random(-0.5, 0.5);
        }
    }
    
    mostrar() {
        push();
        translate(this.x, this.y + sin(this.animacao) * 3);
        textSize(40);
        textAlign(CENTER, CENTER);
        text(this.emoji, 0, 0);
        
        // Nome do personagem
        fill(0, 0, 0, 150);
        noStroke();
        rect(-25, -45, 50, 20, 8);
        fill(255);
        textSize(10);
        text(this.nome, 0, -38);
        
        // Balão de fala
        if (this.tempoFala > 0) {
            fill(255, 255, 255, 200);
            rect(-60, -75, 120, 35, 12);
            fill(0);
            textSize(11);
            text(this.fala, 0, -58);
            this.tempoFala--;
        }
        pop();
    }
    
    falar(msg) {
        this.fala = msg;
        this.tempoFala = 120;
    }
    
    interagir(jogo) {
        // Dicas baseadas no estado do jogo
        if (frameCount % 300 === 0 && !jogo.gameOver && !jogo.gameWin) {
            if (this.nome === "Robô Sustentável") {
                if (jogo.solo < 40) this.falar("⚠️ Solo cansado! Adube!");
                else if (jogo.agua < 40) this.falar("💧 Água baixa! Irrigue!");
                else if (jogo.biodiversidade < 40) this.falar("🦋 Plante flores nativas!");
                else if (jogo.dinheiro < 300) this.falar("💰 Use a cooperativa!");
                else this.falar("🌟 Você é referência!");
            } else if (this.nome === "Agricultor") {
                this.falar("🌾 Vamos plantar com consciência!");
            } else if (this.nome === "Borboleta") {
                this.falar("🦋 Plante flores para nós!");
            } else if (this.nome === "Abelha") {
                this.falar("🐝 Sem veneno, por favor!");
            }
        }
    }
}

class JogoSustentavel {
    constructor() {
        this.reset();
        this.configurarBotoes();
    }
    
    reset() {
        this.ciclo = 0;
        this.gameOver = false;
        this.gameWin = false;
        this.mensagens = [];
        
        this.producao = 60;
        this.solo = 65;
        this.agua = 70;
        this.biodiversidade = 55;
        this.dinheiro = 800;
        
        mensagemCount = 0;
        
        this.atualizarInterface();
        this.atualizarStatus();
        this.mostrarMensagem("✨ Jogo reiniciado!