// Simple interactions for grapefruit's self-introduction page

document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to grapefruit's profile page!");

    // --- Three.js 3D Crane Animation ---
    const initCrane = () => {
        const container = document.getElementById('crane-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(5, 4, 7);
        camera.lookAt(0, 1, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(200, 200);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // Colors
        const yellow = 0xffd700;
        const black = 0x333333;

        // Helper to create box with outline
        const createBox = (w, h, d, color) => {
            const group = new THREE.Group();
            const geometry = new THREE.BoxGeometry(w, h, d);
            const material = new THREE.MeshPhongMaterial({ color: color });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);

            // Outline
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
            group.add(line);

            return group;
        };

        // Crane Group
        const craneGroup = new THREE.Group();
        scene.add(craneGroup);

        // Body
        const body = createBox(2.5, 0.8, 1.8, yellow);
        body.position.y = 0.6;
        craneGroup.add(body);

        // Cabin
        const cabin = createBox(1, 1, 1.2, yellow);
        cabin.position.set(-0.5, 1.5, 0);
        craneGroup.add(cabin);

        // Boom
        const boomGroup = new THREE.Group();
        boomGroup.position.set(0.5, 1.1, 0);
        craneGroup.add(boomGroup);

        const boom = createBox(4, 0.4, 0.6, yellow);
        boom.position.set(1.8, 0, 0);
        boomGroup.add(boom);
        boomGroup.rotation.z = Math.PI / 6; // Angle up

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMat = new THREE.MeshPhongMaterial({ color: black });
        const positions = [
            [0.8, 0.4, 0.9], [0.8, 0.4, -0.9],
            [-0.8, 0.4, 0.9], [-0.8, 0.4, -0.9]
        ];
        positions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeom, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(...pos);
            craneGroup.add(wheel);
            
            // Wheel outline
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
