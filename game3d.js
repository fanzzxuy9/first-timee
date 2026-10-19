document.addEventListener("DOMContentLoaded", () => {
    // 1. TOMBOL MASUK
    const gachaPage = document.getElementById('page-gacha');
    if (gachaPage) {
        const btnWrap = document.createElement('div');
        btnWrap.style.cssText = "max-width: 900px; margin: 24px auto 0; padding: 0 24px; display: block; width: 100%; box-sizing: border-box;";
        btnWrap.innerHTML = `
            <button id="to-3d-game-btn" type="button" style="width: 100% !important; padding: 18px 20px !important; border: none !important; border-radius: 18px !important; background: linear-gradient(110deg, #06b6d4, #8b5cf6, #ec4899) !important; color: #fff !important; font-size: 15px !important; font-weight: 900 !important; cursor: pointer !important; display: flex !important; justify-content: center !important; align-items: center !important;">
                <span>🎮 MAIN GAME 3D PETUALANGAN</span>
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

    // 3. LOAD THREE.JS DARI CDN
    const scriptThree = document.createElement('script');
    scriptThree.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    scriptThree.onload = () => start3DLogic();
    scriptThree.onerror = () => {
        alert("Gagal memuat mesin 3D. Coba refresh halaman.");
    };
    document.head.appendChild(scriptThree);

    // 4. LOGIKA 3D
    function start3DLogic() {
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

        let scene, camera, renderer, player, isRunning = false, rafId;
        let crystals = [], enemies = [], particles = [];
        let keys = {}, joyX = 0, joyY = 0;
        let state = { hp: 5, crystals: 0, enemies: 0, velyx: 0, gameOver: false, attackTime: 0 };

        function init3D() {
            CANVAS_WRAP.innerHTML = '';
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a18);
            scene.fog = new THREE.Fog(0x0a0a18, 20, 60);

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 15, 15);

            renderer = new THREE.WebGLRenderer({ antialias: false });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            CANVAS_WRAP.appendChild(renderer.domElement);

            // Lampu
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(10, 20, 10);
            scene.add(dirLight);

            // Lantai Grid 3D
            const floorGeo = new THREE.PlaneGeometry(40, 40);
            const floorMat = new THREE.MeshStandardMaterial({ color: 0x1b1430, roughness: 0.8 });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            scene.add(floor);
            const grid = new THREE.GridHelper(40, 20, 0x8b5cf6, 0x3b0764);
            grid.position.y = 0.01;
            scene.add(grid);

            // Player (Ksatria Biru)
            const pGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8);
            const pMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.5 });
            player = new THREE.Mesh(pGeo, pMat);
            player.position.y = 0.75;
            player.castShadow = true;
            scene.add(player);

            // Kristal
            const cGeo = new THREE.OctahedronGeometry(0.5);
            const cMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.8 });
            for (let i = 0; i < 10; i++) {
                let c = new THREE.Mesh(cGeo, cMat);
                c.position.set((Math.random()-0.5)*30, 0.8, (Math.random()-0.5)*30);
                c.castShadow = true;
                scene.add(c);
                crystals.push(c);
            }

            // Musuh (Kotak Merah)
            const eGeo = new THREE.BoxGeometry(1, 1, 1);
            const eMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x9f1239, emissiveIntensity: 0.5 });
            for (let i = 0; i < 6; i++) {
                let e = new THREE.Mesh(eGeo, eMat);
                e.position.set((Math.random()-0.5)*35, 0.5, (Math.random()-0.5)*35);
                e.castShadow = true;
                scene.add(e);
                enemies.push({ mesh: e, hp: 2, alive: true });
            }

            state = { hp: 5, crystals: 0, enemies: 0, velyx: 0, gameOver: false, attackTime: 0 };
            updateHUD();
            isRunning = true;
            window.addEventListener('resize', onResize);
            animate();
        }

        function onResize() {
            if (!camera) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function attack() {
            if (state.gameOver || performance.now() < state.attackTime) return;
            state.attackTime = performance.now() + 400;
            if (ATTACK_BTN) ATTACK_BTN.style.transform = 'scale(0.9)';
            setTimeout(() => { if(ATTACK_BTN) ATTACK_BTN.style.transform = 'scale(1)'; }, 100);

            enemies.forEach(e => {
                if (!e.alive) return;
                if (e.mesh.position.distanceTo(player.position) < 4) {
                    e.hp--;
                    if (e.hp <= 0) {
                        e.alive = false; e.mesh.visible = false;
                        state.enemies++; state.velyx += 100;
                        updateHUD(); checkWin();
                    }
                }
            });
        }

        function checkWin() {
            if (crystals.length === 0 && enemies.every(e => !e.alive)) endGame(true);
        }

        function endGame(win) {
            state.gameOver = true; isRunning = false;
            if (win) state.velyx += 500;
            if (state.velyx > 0 && typeof userGems === 'number' && typeof saveGame === 'function') {
                userGems += state.velyx;
                document.getElementById('gems-count').textContent = userGems.toLocaleString('id-ID');
                saveGame();
            }
            document.getElementById('game3d-overlay-title').textContent = win ? '🎉 Menang!' : '💀 Game Over';
            document.getElementById('res-crystals').textContent = state.crystals + ' × 50';
            document.getElementById('res-enemies').textContent = state.enemies + ' × 100';
            document.getElementById('res-total').textContent = '+' + state.velyx;
            OVERLAY.classList.add('show');
        }

        function updateHUD() {
            HP_EL.textContent = state.hp + ' / 5';
            CRYSTALS_EL.textContent = state.crystals;
            ENEMIES_EL.textContent = state.enemies;
            VELYX_EL.textContent = '+' + state.velyx;
        }

        function animate() {
            if (!isRunning) return;
            rafId = requestAnimationFrame(animate);

            let dx = 0, dz = 0;
            if (keys['w'] || keys['arrowup']) dz -= 1;
            if (keys['s'] || keys['arrowdown']) dz += 1;
            if (keys['a'] || keys['arrowleft']) dx -= 1;
            if (keys['d'] || keys['arrowright']) dx += 1;
            dx += joyX; dz += joyY;
            
            const len = Math.hypot(dx, dz);
            if (len > 1) { dx /= len; dz /= len; }

            if (!state.gameOver) {
                player.position.x += dx * 0.25;
                player.position.z += dz * 0.25;
                player.position.x = Math.max(-18, Math.min(18, player.position.x));
                player.position.z = Math.max(-18, Math.min(18, player.position.z));

                crystals.forEach((c, i) => {
                    c.rotation.y += 0.05;
                    if (c.position.distanceTo(player.position) < 1.5) {
                        scene.remove(c); crystals.splice(i, 1);
                        state.crystals++; state.velyx += 50;
                        updateHUD(); checkWin();
                    }
                });

                enemies.forEach(e => {
                    if (!e.alive) return;
                    const dir = new THREE.Vector3().subVectors(player.position, e.mesh.position);
                    dir.y = 0; dir.normalize();
                    e.mesh.position.add(dir.multiplyScalar(0.08));
                    
                    if (e.mesh.position.distanceTo(player.position) < 1.5) {
                        if (!e.nextHit || Date.now() > e.nextHit) {
                            e.nextHit = Date.now() + 1000;
                            state.hp--; updateHUD();
                            if (state.hp <= 0) endGame(false);
                        }
                    }
                });
            }

            // Kamera Follow
            camera.position.x += (player.position.x - camera.position.x) * 0.1;
            camera.position.z += (player.position.z + 15 - camera.position.z) * 0.1;
            camera.lookAt(player.position.x, 0, player.position.z);

            renderer.render(scene, camera);
        }

        // Input
        window.addEventListener('keydown', (e) => { 
            const k = e.key.toLowerCase(); keys[k] = true;
            if (k === ' ') { e.preventDefault(); attack(); }
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

        // Enter / Exit
        if (BTN_ENTER) BTN_ENTER.addEventListener('click', () => {
            document.querySelectorAll('#home-page, #page-2, #page-3, #page-isekai, #page-isekai-rec, #page-airing, #page-gacha').forEach(el => { if (el) el.style.display = 'none'; });
            PAGE_3D.style.display = 'block'; OVERLAY.classList.remove('show');
            if (rafId) cancelAnimationFrame(rafId);
            init3D();
        });

        function exitGame() {
            isRunning = false; if (rafId) cancelAnimationFrame(rafId);
            PAGE_3D.style.display = 'none'; OVERLAY.classList.remove('show');
            document.getElementById('page-gacha').style.display = 'block';
            window.scrollTo(0, 0);
        }
        if (BTN_BACK) BTN_BACK.addEventListener('click', exitGame);
        if (OVERLAY_BTN) OVERLAY_BTN.addEventListener('click', exitGame);
    }
    if (performance.now() < state.attackTime) {
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.9)'; 
    ctx.lineWidth = 8; 
    ctx.lineCap = 'round';
    ctx.shadowColor = '#67e8f9'; 
    ctx.shadowBlur = 15;
    ctx.beginPath();
    // Gambar lengkungan tebasan di depan karakter sesuai arah hadap
    ctx.arc(px, py, 55, player.facing === 1 ? -Math.PI/2 : Math.PI/2, player.facing === 1 ? Math.PI/2 : Math.PI*1.5);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow
    }
});
