// Simple interactions for grapefruit's self-introduction page

document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to grapefruit's profile page!");

    // --- Three.js 3D Crane Animation ---
    const initCrane = () => {
        const container = document.getElementById('crane-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(8, 6, 11); // Move further back to shrink model in view
        camera.lookAt(0, 1, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(350, 350);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // --- Detailed Crane Design (Tomica-style) ---
        const craneGroup = new THREE.Group();
        scene.add(craneGroup);

        // Colors
        const yellow = 0xffd700;
        const black = 0x222222;
        const lightGray = 0xcccccc;

        // Helper
        const createBox = (w, h, d, color) => {
            const group = new THREE.Group();
            const geometry = new THREE.BoxGeometry(w, h, d);
            const material = new THREE.MeshPhongMaterial({ color: color });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
            group.add(line);
            return group;
        };

        // Chassis (Base)
        const chassis = createBox(3, 0.5, 1.6, yellow);
        chassis.position.y = 0.5;
        craneGroup.add(chassis);

        // Outriggers (legs)
        const outriggerPos = [
            [1.2, 0.45, 0.8], [1.2, 0.45, -0.8],
            [-1.2, 0.45, 0.8], [-1.2, 0.45, -0.8]
        ];
        outriggerPos.forEach(pos => {
            const leg = createBox(0.4, 0.2, 0.4, yellow);
            leg.position.set(...pos);
            craneGroup.add(leg);
        });

        // Rotating Platform
        const platform = createBox(1.8, 0.4, 1.4, yellow);
        platform.position.y = 0.95;
        craneGroup.add(platform);

        // Cabin
        const cabinGroup = new THREE.Group();
        cabinGroup.position.set(-0.6, 1.5, 0.4);
        craneGroup.add(cabinGroup);
        const cabinMain = createBox(0.8, 1, 0.7, yellow);
        cabinGroup.add(cabinMain);
        // Window
        const windowPane = createBox(0.4, 0.5, 0.71, 0x3366ff);
        windowPane.position.set(0.25, 0.2, 0);
        cabinGroup.add(windowPane);

        // Boom System
        const boomGroup = new THREE.Group();
        boomGroup.position.set(0.4, 1.3, 0);
        craneGroup.add(boomGroup);

        // Base Boom
        const boom1 = createBox(3, 0.5, 0.6, yellow);
        boom1.position.set(1.4, 0, 0);
        boomGroup.add(boom1);

        // Second Boom (thinner)
        const boom2 = createBox(2.8, 0.35, 0.45, yellow);
        boom2.position.set(2.8, 0, 0);
        boom1.add(boom2);

        boomGroup.rotation.z = Math.PI / 6;

        // Counterweight
        const cw = createBox(0.6, 0.6, 1.2, yellow);
        cw.position.set(-0.6, 1.3, -0.2);
        craneGroup.add(cw);

        // Wheels with rims
        const wheelGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 16);
        const rimGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.42, 16);
        const wheelMat = new THREE.MeshPhongMaterial({ color: black });
        const rimMat = new THREE.MeshPhongMaterial({ color: lightGray });
        const wheelPos = [
            [1, 0.45, 0.8], [1, 0.45, -0.8],
            [-1, 0.45, 0.8], [-1, 0.45, -0.8]
        ];
        wheelPos.forEach(pos => {
            const w = new THREE.Mesh(wheelGeom, wheelMat);
            const r = new THREE.Mesh(rimGeom, rimMat);
            const group = new THREE.Group();
            group.add(w);
            group.add(r);
            group.rotation.x = Math.PI / 2;
            group.position.set(...pos);
            craneGroup.add(group);

            const edges = new THREE.EdgesGeometry(wheelGeom);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
            line.rotation.x = Math.PI / 2;
            line.position.set(...pos);
            craneGroup.add(line);
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Slow rotation
            craneGroup.rotation.y += 0.005;
            
            // Gentle boom bobbing
            boomGroup.rotation.z = Math.PI / 6 + Math.sin(Date.now() * 0.001) * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        // Mouse interaction
        let isDragging = false;
        let previousMouseX = 0;
        container.addEventListener('mousedown', (e) => { isDragging = true; previousMouseX = e.clientX; });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMouseX;
                craneGroup.rotation.y += deltaX * 0.01;
                previousMouseX = e.clientX;
            }
        });
    };

    initCrane();

    // --- Existing Reveal Logic ---
    const sections = document.querySelectorAll('section');
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});
