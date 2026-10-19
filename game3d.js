document.addEventListener("DOMContentLoaded", () => {
    // 1. TOMBOL MASUK
    const gachaPage = document.getElementById('page-gacha');
    if (gachaPage) {
        const btnWrap = document.createElement('div');
        btnWrap.style.cssText = "max-width: 900px; margin: 24px auto 0; padding: 0 24px; display: block; width: 100%; box-sizing: border-box;";
        btnWrap.innerHTML = `
            <button id="to-3d-game-btn" type="button" style="width: 100% !important; padding: 18px 20px !important; border: none !important; border-radius: 18px !important; background: linear-gradient(110deg, #06b6d4, #8b5cf6, #ec4899) !important; color: #fff !important; font-size: 15px !important; font-weight: 900 !important; cursor: pointer !important; display: flex !important; justify-content: center !important; align-items: center !important;">
                <span>🎮 MAIN GAME PETUALANGAN</span>
            </button>
        `;
        const navbar = gachaPage.querySelector('nav');
        if (navbar) navbar.insertAdjacentElement('afterend', btnWrap);
    }

    // 2. HTML GAME & CSS
    const gameHTML = `
        <style id="game3d-style">
            #page-3d { display: none; position: fixed; inset: 0; z-index: 50; background: #0a0a10; overflow: hidden; touch-action: none; user-select: none; font-family: 'Segoe UI', sans-serif; }
            #game3d-canvas-wrap { position: absolute; inset: 0; z-index: 1; }
            #game3d-canvas-wrap canvas { display: block; width: 100% !important; height: 100% !important; }
            #game3d-hud { position: absolute; top: 14px; left: 14px; right: 14px; z-index: 5; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; pointer-events: none; flex-wrap: wrap; }
            #game3d-hud > div { background: rgba(10, 10, 20, 0.72); border: 1px solid rgba(192, 132, 252, 0.35); border-radius: 14px; padding: 10px 14px; color: #fff; font-size: 13px; font-weight: 700; }
            #game3d-hud .hud-label { font-size: 10px; color: #c4b5fd; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; }
            #game3d-hud .hud-value { font-size: 16px; font-weight: 900; color: #f0abfc; }
            #game3d-back { pointer-events: auto; background: #c026d3 !important; border: none !important; cursor: pointer; color: #fff; font-weight: 800; padding: 10px 16px !important; border-radius: 14px !important; }
            #game3d-joystick { position: absolute; bottom: 30px; left: 30px; width: 130px; height: 130px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 2px solid rgba(192, 132, 252, 0.6); z-index: 99; display: none; touch-action: none; }
            #game3d-joystick-knob { position: absolute; top: 50%; left: 50%; width: 60px; height: 60px; margin: -30px 0 0 -30px; border-radius: 50%; background: #a855f7; pointer-events: none; }
            #game3d-attack-btn { position: absolute; bottom: 40px; right: 30px; width: 100px; height: 100px; border-radius: 50%; border: 3px solid #fb7185; background: #be123c; color: #fff; font-weight: 900; font-size: 14px; z-index: 99; display: none; cursor: pointer; touch-action: none; }
            @media (hover: none) and (pointer: coarse) { #game3d-joystick, #game3d-attack-btn { display: block; } }
            #game3d-overlay { position: fixed; inset: 0; z-index: 99999; display: none; align-items: center; justify-content: center; background: rgba(0,0,10,0.9); }
            #game3d-overlay.show { display: flex; }
            #game3d-overlay .box { background: #1e1b4b; border: 2px solid #c084fc; border-radius: 24px; padding: 30px; max-width: 400px; width: 100%; text-align: center; color: #fff; }
            #game3d-overlay button { margin-top: 20px; width: 100%; padding: 14px; border-radius: 14px; background: #c026d3; color: #fff; font-weight: 900; border: none; }
        </style>
        <section id="page-3d" aria-hidden="true">
            <div id="game3d-canvas-wrap"></div>
            <div id="game3d-hud">
                <div><span class="hud-label">❤️ HP</span><span class="hud-value" id="game3d-hp">5 / 5</span></div>
                <div><span class="hud-label">💎 Kristal</span><span class="hud-value"><span id="game3d-crystals">0</span> / 10</span></div>
                <div><span class="hud-label">👹 Musuh</span><span class="hud-value"><span id="game3d-enemies">0</span> / 6</span></div>
                <div><span class="hud-label">💠 Velyx</span><span class="hud-value" id="game3d-velyx">+0</span></div>
                <button id="game3d-back" type="button">← Keluar</button>
            </div>
            <div id="game3d-joystick"><div id="game3d-joystick-knob"></div></div>
            <button id="game3d-attack-btn" type="button">⚔️<br>ATTACK</button>
            <div id="game3d-overlay">
                <div class="box">
                    <h2 id="game3d-overlay-title">Game Selesai!</h2>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span>Kristal:</span><span id="res-crystals">0</span></div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span>Musuh:</span><span id="res-enemies">0</span></div>
                    <div style="display:flex;justify-content:space-between;font-weight:900;color:#facc15;"><span>Total Velyx:</span><span id="res-total">+0</span></div>
                    <button id="game3d-overlay-btn" type="button">Kembali</button>
                </div>
            </div>
        </section>
    `;
    document.body.insertAdjacentHTML('beforeend', gameHTML);

    // 3. LOGIKA GAME
    const PAGE_3D = document.getElementById('page-3d');
    const BTN_ENTER = document.getElementById('to-3d-game-btn');
    const BTN_BACK = document.getElementById('game3d-back');
    const CANVAS_WRAP = document.getElementById('game3d-canvas-wrap');
    const OVERLAY = document.getElementById('game3d-overlay');
    const OVERLAY_BTN = document.getElementById('game3d-overlay-btn');
    const HP_EL = document.getElementById('game3d-hp');
    const CRYSTALS_EL = document.getElementById('game3d-crystals');
    const ENEMIES_EL = document.getElementById('game3d-enemies');
    const VELYX_EL = document.getElementById('game3d-velyx');
    const JOY = document.getElementById('game3d-joystick');
    const JOY_KNOB = document.getElementById('game3d-joystick-knob');
    const ATTACK_BTN = document.getElementById('game3d-attack-btn');

    let ctx, canvas, running = false, rafId;
    let player = { x: 0, y: 0, r: 16, speed: 4, facing: 1 }; // facing 1 = kanan, -1 = kiri
    let crystals = [], enemies = [], particles = [];
    let keys = {}, joyX = 0, joyY = 0;
    let state = { hp: 5, crystals: 0, enemies: 0, velyx: 0, gameOver: false, attackTime: 0 };

    function initGame() {
        CANVAS_WRAP.innerHTML = '';
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        CANVAS_WRAP.appendChild(canvas);
        resizeCanvas();

        player = { x: canvas.width / 2, y: canvas.height / 2, r: 16, speed: 4.5, facing: 1 };
        crystals = []; enemies = []; particles = [];
        
        for (let i = 0; i < 10; i++) {
            crystals.push({ x: Math.random() * (canvas.width - 100) + 50, y: Math.random() * (canvas.height - 100) + 50, r: 10, alive: true, anim: Math.random() * 10 });
        }
        for (let i = 0; i < 6; i++) {
            let ex, ey;
            do { ex = Math.random() * canvas.width; ey = Math.random() * canvas.height; } 
            while (Math.hypot(ex - player.x, ey - player.y) < 200);
            enemies.push({ x: ex, y: ey, r: 18, hp: 2, alive: true, speed: 1.8 + Math.random() * 0.5 });
        }

        state = { hp: 5, crystals: 0, enemies: 0, velyx: 0, gameOver: false, attackTime: 0 };
        updateHUD(); running = true;
        window.addEventListener('resize', resizeCanvas);
        loop();
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function attack() {
        if (state.gameOver || performance.now() < state.attackTime) return;
        state.attackTime = performance.now() + 400; 
        if (ATTACK_BTN) ATTACK_BTN.style.transform = 'scale(0.9)';
        setTimeout(() => { if(ATTACK_BTN) ATTACK_BTN.style.transform = 'scale(1)'; }, 100);

        enemies.forEach(e => {
            if (!e.alive) return;
            // Jarak serangan lebih luas biar gampang
            if (Math.hypot(e.x - player.x, e.y - player.y) < 90) {
                e.hp--;
                particles.push({ x: e.x, y: e.y, life: 0.5, color: '#fbbf24', vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5 });
                if (e.hp <= 0) {
                    e.alive = false; state.enemies++; state.velyx += 100;
                    for(let i=0; i<5; i++) particles.push({ x: e.x, y: e.y, life: 0.8, color: '#f43f5e', vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8 });
                    updateHUD();
                }
            }
        });
        checkWin();
    }

    function checkWin() {
        if (crystals.every(c => !c.alive) && enemies.every(e => !e.alive)) endGame(true);
    }

    function endGame(win) {
        state.gameOver = true; running = false;
        if (win) state.velyx += 500;
        if (state.velyx > 0 && typeof userGems === 'number' && typeof saveGame === 'function') {
            userGems += state.velyx;
            const gemsEl = document.getElementById('gems-count');
            if (gemsEl) gemsEl.textContent = userGems.toLocaleString('id-ID');
            saveGame();
        }
        document.getElementById('game3d-overlay-title').textContent = win ? '🎉 Menang!' : '💀 Game Over';
        document.getElementById('res-crystals').textContent = state.crystals + ' × 50 = ' + (state.crystals*50);
        document.getElementById('res-enemies').textContent = state.enemies + ' × 100 = ' + (state.enemies*100);
        document.getElementById('res-total').textContent = '+' + state.velyx + ' Velyx';
        OVERLAY.classList.add('show');
    }

    function loop() {
        if (!running) return;
        rafId = requestAnimationFrame(loop);

        let dx = 0, dy = 0;
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;
        
        dx += joyX; dy += joyY;
        const len = Math.hypot(dx, dy);
        if (len > 1) { dx /= len; dy /= len; }

        if (dx > 0) player.facing = 1;
        if (dx < 0) player.facing = -1;

        player.x += dx * player.speed;
        player.y += dy * player.speed;
        player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x));
        player.y = Math.max(player.r, Math.min(canvas.height - player.r, player.y));

        crystals.forEach(c => {
            if (c.alive && Math.hypot(c.x - player.x, c.y - player.y) < player.r + c.r + 5) {
                c.alive = false; state.crystals++; state.velyx += 50;
                for(let i=0; i<8; i++) particles.push({ x: c.x, y: c.y, life: 0.6, color: '#fde047', vx: (Math.random()-0.5)*6, vy: (Math.random()-0.5)*6 });
                updateHUD(); checkWin();
            }
        });

        enemies.forEach(e => {
            if (!e.alive) return;
            const dist = Math.hypot(player.x - e.x, player.y - e.y) || 1;
            e.x += ((player.x - e.x) / dist) * e.speed;
            e.y += ((player.y - e.y) / dist) * e.speed;
            
            if (dist < player.r + e.r) {
                if (!e.nextHit || performance.now() > e.nextHit) {
                    e.nextHit = performance.now() + 1000;
                    state.hp--; updateHUD();
                    for(let i=0; i<5; i++) particles.push({ x: player.x, y: player.y, life: 0.5, color: '#ef4444', vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5 });
                    if (state.hp <= 0) endGame(false);
                }
            }
        });

        particles.forEach(p => {
            p.life -= 0.02;
            p.x += p.vx; p.y += p.vy;
        });
        particles = particles.filter(p => p.life > 0);

        // === GAMBAR ===
        ctx.fillStyle = '#0a0a18'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Lantai Dungeon
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.05)'; ctx.lineWidth = 2;
        for(let i=0; i<canvas.width; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
        for(let j=0; j<canvas.height; j+=50) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(canvas.width,j); ctx.stroke(); }

        // Gambar Kristal
        crystals.forEach(c => {
            if (!c.alive) return;
            c.anim += 0.05;
            const size = c.r + Math.sin(c.anim) * 3; // Efek muter
            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#facc15'; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.moveTo(c.x, c.y - size); ctx.lineTo(c.x + size, c.y); ctx.lineTo(c.x, c.y + size); ctx.lineTo(c.x - size, c.y); ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Gambar Musuh (Monster Merah)
        enemies.forEach(e => {
            if (!e.alive) return;
            // Badan
            ctx.fillStyle = '#e11d48'; 
            ctx.shadowColor = '#e11d48'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
            // Tanduk
            ctx.fillStyle = '#4c0519';
            ctx.beginPath(); ctx.moveTo(e.x - 10, e.y - 12); ctx.lineTo(e.x - 5, e.y - 22); ctx.lineTo(e.x - 2, e.y - 10); ctx.fill();
            ctx.beginPath(); ctx.moveTo(e.x + 10, e.y - 12); ctx.lineTo(e.x + 5, e.y - 22); ctx.lineTo(e.x + 2, e.y - 10); ctx.fill();
            // Mata
            ctx.fillStyle = '#fff'; ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(e.x - 6, e.y - 5, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(e.x + 6, e.y - 5, 4, 0, Math.PI * 2); ctx.fill();
            // Pupil
            ctx.fillStyle = '#000';
            ctx.beginPath(); ctx.arc(e.x - 6, e.y - 5, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(e.x + 6, e.y - 5, 2, 0, Math.PI * 2); ctx.fill();
        });

        // Gambar Player (Ksatria Biru)
        const px = player.x, py = player.y;
        // Bayangan
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath(); ctx.ellipse(px, py + 15, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
        
        // Badan (Armor)
        ctx.fillStyle = '#2563eb'; ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.roundRect(px - 12, py - 5, 24, 24, 6); ctx.fill();
        
        // Kepala (Helm)
        ctx.fillStyle = '#93c5fd'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(px, py - 12, 10, 0, Math.PI * 2); ctx.fill();
        
        // Mata (kearah hadap)
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath(); ctx.arc(px + (player.facing * 4), py - 14, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px + (player.facing * 9), py - 14, 2.5, 0, Math.PI * 2); ctx.fill();
        
        // Pedang
        ctx.fillStyle = '#facc15';
        ctx.save();
        ctx.translate(px + (player.facing * 14), py + 5);
        ctx.rotate(player.facing === 1 ? -0.5 : 0.5);
        ctx.fillRect(-2, -18, 4, 20);
        ctx.restore();

        // Efek Ayunan Pedang saat Serang
        if (performance.now() < state.attackTime) {
            ctx.strokeStyle = 'rgba(103, 232, 249, 0.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(px, py, 50, player.facing === 1 ? -Math.PI/2 : Math.PI/2, player.facing === 1 ? Math.PI/2 : Math.PI*1.5);
            ctx.stroke();
        }

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
            ctx.beginPath(); ctx.arc(p.x, p.y, 6 * p.life + 2, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    function updateHUD() {
        HP_EL.textContent = state.hp + ' / 5';
        CRYSTALS_EL.textContent = state.crystals;
        ENEMIES_EL.textContent = state.enemies;
        VELYX_EL.textContent = '+' + state.velyx;
    }

    // INPUT
    window.addEventListener('keydown', (e) => { 
        const k = e.key.toLowerCase(); keys[k] = true;
        if (k === ' ' && running) { e.preventDefault(); attack(); }
    });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
    if (ATTACK_BTN) ATTACK_BTN.addEventListener('touchstart', (e) => { e.preventDefault(); attack(); });

    let joyId = null;
    if (JOY) {
        JOY.addEventListener('touchstart', (e) => { e.preventDefault(); joyId = e.changedTouches[0].identifier; moveJoy(e.changedTouches[0]); }, {passive: false});
        JOY.addEventListener('touchmove', (e) => { 
            e.preventDefault(); 
            for(let i=0; i<e.touches.length; i++) if(e.touches[i].identifier === joyId) moveJoy(e.touches[i]);
        }, {passive: false});
        JOY.addEventListener('touchend', () => { joyId = null; joyX=0; joyY=0; JOY_KNOB.style.transform='translate(0,0)'; });
    }
    function moveJoy(touch) {
        const r = JOY.getBoundingClientRect();
        let dx = touch.clientX - (r.left + r.width/2), dy = touch.clientY - (r.top + r.height/2);
        const max = r.width/2 - 10, dist = Math.hypot(dx, dy);
        if (dist > max) { dx = (dx/dist)*max; dy = (dy/dist)*max; }
        JOY_KNOB.style.transform = `translate(${dx}px, ${dy}px)`;
        joyX = dx / max; joyY = dy / max;
    }

    function showPage3D() {
        document.querySelectorAll('#home-page, #page-2, #page-3, #page-isekai, #page-isekai-rec, #page-airing, #page-gacha').forEach(el => { if (el) el.style.display = 'none'; });
        PAGE_3D.style.display = 'block'; OVERLAY.classList.remove('show');
        if (rafId) cancelAnimationFrame(rafId);
        initGame();
    }
    function exitGame() {
        running = false; if (rafId) cancelAnimationFrame(rafId);
        PAGE_3D.style.display = 'none'; OVERLAY.classList.remove('show');
        document.getElementById('page-gacha').style.display = 'block';
        window.scrollTo(0, 0);
    }

    if (BTN_ENTER) BTN_ENTER.addEventListener('click', showPage3D);
    if (BTN_BACK) BTN_BACK.addEventListener('click', exitGame);
    if (OVERLAY_BTN) OVERLAY_BTN.addEventListener('click', exitGame);
});