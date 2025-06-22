// إضافة وظيفة تبديل القائمة المنسدلة في بداية الملف
document.addEventListener('DOMContentLoaded', function() {
    // تحديد العناصر
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // تبديل حالة القائمة عند النقر على زر القائمة
    menuToggle.addEventListener('click', function(event) {
        navLinks.classList.toggle('active');
        event.stopPropagation(); // منع انتشار الحدث
        console.log('تم النقر على زر القائمة'); // للتأكد من عمل الحدث
    });
    
    // إغلاق القائمة عند النقر على أي رابط
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
    
    // إضافة وظيفة تغيير خلفية القائمة عند التمرير
    const mainNav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });
    
    console.log('تم تحميل وظائف القائمة المنسدلة ووظيفة تغيير خلفية القائمة');
});

// متغيرات عامة
let scene, camera, renderer, controls;
let particles = [];
let clock = new THREE.Clock();

// تهيئة المشهد
function init() {
    // إنشاء المشهد
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a14);
    
    // إعداد الكاميرا
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);
    
    // إعداد العارض
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // إعداد التحكم بالكاميرا
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // إضافة الإضاءة
    addLights();
    
    // إنشاء الأشكال ثلاثية الأبعاد - تم تغيير هذه الدالة
    createNewShapes();
    
    // إنشاء الجسيمات
    createParticles();
    
    // إضافة أحداث النافذة
    window.addEventListener('resize', onWindowResize);
    
    // إخفاء شاشة التحميل بعد فترة
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 2000);
    
    // بدء حلقة الرسم
    animate();
}

// إضافة الإضاءة
function addLights() {
    // إضاءة محيطة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // إضاءة موجهة
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // إضاءات نقطية ملونة
    const purpleLight = new THREE.PointLight(0x8a2be2, 1, 20);
    purpleLight.position.set(-5, 3, 5);
    scene.add(purpleLight);
    
    const greenLight = new THREE.PointLight(0x8eff8e, 1, 20);
    greenLight.position.set(5, 3, 5);
    scene.add(greenLight);
}

// إنشاء الأشكال ثلاثية الأبعاد الجديدة
function createNewShapes() {
    // إنشاء مجموعة من الأشكال المختلفة
    const shapes = new THREE.Group();
    
    // إنشاء نموذج كروي مركب (تصميم جديد)
    const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x8a2be2,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    shapes.add(sphere);
    
    // إضافة طبقة ثانية من الكرة بحجم أصغر
    const innerSphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const innerSphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x8eff8e,
        shininess: 100,
        transparent: true,
        opacity: 0.5
    });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    shapes.add(innerSphere);
    
    // إضافة حلقات دوارة حول الكرة
    const ringGeometry = new THREE.TorusGeometry(4, 0.2, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6bdd,
        shininess: 100,
        transparent: true,
        opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    shapes.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring2.rotation.y = Math.PI / 2;
    shapes.add(ring2);
    
    const ring3 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring3.rotation.z = Math.PI / 2;
    shapes.add(ring3);
    
    // إضافة نقاط مضيئة عشوائية
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 100;
    const positions = new Float32Array(pointsCount * 3);
    
    for (let i = 0; i < pointsCount; i++) {
        const radius = 3.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    shapes.add(points);
    
    scene.add(shapes);
    
    // تخزين الأشكال للتحريك
    scene.userData.shapes = shapes;
    scene.userData.rings = [ring1, ring2, ring3];
    scene.userData.points = points;
    scene.userData.innerSphere = innerSphere;
}

// إنشاء الجسيمات
function createParticles() {
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // توزيع الجسيمات في شكل كروي
        const radius = 20 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // إنشاء مادة الجسيمات
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x8eff8e,
        size: 0.1,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    // إنشاء نظام الجسيمات
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // تخزين نظام الجسيمات للتحريك
    particles.push(particleSystem);
}

// معالجة تغيير حجم النافذة
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// تحديث الأشكال
function updateShapes(time) {
    if (scene.userData.shapes) {
        // تدوير الكرة الرئيسية ببطء
        scene.userData.shapes.rotation.y += 0.002;
        
        // تدوير الحلقات بسرعات مختلفة
        if (scene.userData.rings) {
            scene.userData.rings[0].rotation.z += 0.003;
            scene.userData.rings[1].rotation.x += 0.002;
            scene.userData.rings[2].rotation.y += 0.004;
        }
        
        // تغيير حجم الكرة الداخلية
        if (scene.userData.innerSphere) {
            const scale = 0.9 + Math.sin(time * 0.5) * 0.1;
            scene.userData.innerSphere.scale.set(scale, scale, scale);
        }
        
        // تحريك النقاط المضيئة
        if (scene.userData.points) {
            scene.userData.points.rotation.y -= 0.001;
            scene.userData.points.rotation.z += 0.001;
        }
    }
}

// تحديث الجسيمات
function updateParticles(time) {
    particles.forEach(particle => {
        particle.rotation.y += 0.0005;
        
        // تغيير لون الجسيمات تدريجيًا
        const hue = (time * 0.05) % 1;
        particle.material.color.setHSL(hue, 0.7, 0.5);
    });
}

// حلقة الرسم
function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    // تحديث التحكم بالكاميرا
    controls.update();
    
    // تحديث الأشكال
    updateShapes(time);
    
    // تحديث الجسيمات
    updateParticles(time);
    
    // تقديم المشهد
    renderer.render(scene, camera);
}

// بدء التطبيق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', init);






