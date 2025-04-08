// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js background
    initThreeBackground();
    
    // Add futuristic cursor effect
    const body = document.body;
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    
    body.appendChild(cursorDot);
    body.appendChild(cursorOutline);
    
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    body.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        // Smooth follow for cursor dot
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        
        // More delayed follow for outline
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        
        requestAnimationFrame(animate);
    }
    
    // Only enable custom cursor on non-touch devices
    if (!('ontouchstart' in window)) {
        animate();
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
    
    // Add interactive elements for cursor changes
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .video-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-active');
            cursorOutline.classList.add('cursor-active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-active');
            cursorOutline.classList.remove('cursor-active');
        });
    });
    
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop, // Removed header offset
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // GSAP Animation for intro content
    gsap.from('.intro-greeting', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });
    
    gsap.from('.job-title', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.7
    });
    
    gsap.from('.location, .company', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.9
    });
    
    gsap.from('.intro-bio p', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 1.1
    });
    
    // Update GSAP animation for intro image
    gsap.from('.intro-image', {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.8)',
        delay: 0.2 // Slight delay for better sequencing
    });
    
    // Add "typing" effect to the gallery heading
    const titleElement = document.querySelector('.gallery-heading h1');
    if (titleElement && sessionStorage.getItem('visited') !== 'true') {
        const originalTitle = titleElement.innerHTML;
        titleElement.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalTitle.length) {
                titleElement.innerHTML += originalTitle.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        
        typeWriter();
        sessionStorage.setItem('visited', 'true');
    }
    
    // Video item animation on scroll
    const videoItems = document.querySelectorAll('.video-item');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll and show videos when they enter viewport
    function handleScroll() {
        videoItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('visible');
                
                // Play videos when they become visible
                const video = item.querySelector('video');
                if (video && video.paused) {
                    // Play the video if it's visible
                    video.play().catch(e => {
                        console.log('Autoplay prevented:', e);
                    });
                }
            } else {
                // Optional: pause videos when they go out of view to save resources
                const video = item.querySelector('video');
                if (video && !video.paused) {
                    video.pause();
                }
            }
        });
    }
    
    // Initial check on page load
    setTimeout(() => {
        handleScroll();
    }, 100);
    
    // Check on scroll
    window.addEventListener('scroll', handleScroll);
    
    // Set autoplay for all videos
    function setupVideoAutoplay() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Set attributes for autoplay
            video.autoplay = true;
            video.muted = true; // Must be muted for autoplay to work in most browsers
            video.setAttribute('playsinline', ''); // For iOS
            
            // Load the video
            video.load();
            
            // Try to play when it's loaded
            video.addEventListener('loadedmetadata', function() {
                video.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                });
            });
        });
    }
    
    // Call function to setup video autoplay
    setupVideoAutoplay();
    
    // Fix for the updated platform tabs ("other" instead of "web-ar", "vr", and "ai")
    const platformTabs = document.querySelectorAll('.platform-tab');
    const platformPanels = document.querySelectorAll('.platform-panel');
    
    // Set up click handlers for platform tabs
    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            platformTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all panels
            platformPanels.forEach(panel => panel.classList.remove('active'));
            
            // Show the panel corresponding to clicked tab
            const platform = tab.getAttribute('data-platform');
            const targetPanelId = platform + '-panel';
            const targetPanel = document.getElementById(targetPanelId);
            
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Play videos in the newly active panel
                const panelVideos = targetPanel.querySelectorAll('video');
                panelVideos.forEach(video => {
                    // Try to play the video
                    video.play().catch(e => {
                        console.log('Tab switch autoplay prevented:', e);
                    });
                });
                
                // Optionally pause videos in inactive panels to save resources
                platformPanels.forEach(panel => {
                    if (panel.id !== targetPanelId) {
                        const inactiveVideos = panel.querySelectorAll('video');
                        inactiveVideos.forEach(video => {
                            video.pause();
                        });
                    }
                });
            }
        });
    });
    
    // Remove any play buttons that might have been added for mobile
    const playButtons = document.querySelectorAll('.video-play-button');
    playButtons.forEach(button => {
        button.style.display = 'none';
    });
    
    // Make the video grid more visually interesting by staggering the entrance animations
    videoItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.contact-content, .gallery-heading');
    
    const fadeOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const fadeObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });
    
    // Feature detection for video playback on mobile
    function checkAutoplaySupport() {
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.src = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAAAAG1wNDJtcDQxaXNvbWF2YzEAAATKbW9vdgAAAGxtdmhkAAAAANLEP5XSxD+VAAB3MAAAdcQAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAABCAgIAQAE////9//w6AgIAEAAAAAQAABDV0cmFrAAAAXHRraGQAAAAH0sQ/ldLEP5UAAAABAAAAAAAAdcQAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAoAAAAFoAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAHXEAAACAAABAAAAAAG+bWRpYQAAACBtZGhkAAAAANLEP5XSxD+VAAB3MAAAdcQAAAAAMWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABMLVNNQVNIIFZpZGVvIEhhbmRsZXIAAAABT21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAQ9zdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJthdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAoABaABIAAAASAAAAAAAAAABCkFWQyBDb2RpbmcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAOGF2Y0MBZAAf/+EAHGdkAB+s2UCgL/lwFqCgoKgAAB9IAAdTAHjBjLABAAVo6+yyLP34+AAAAAATY29scm5jbHgABQAFAAUAAAAAEHBhc3AAAAABAAAAAQAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAAQBjdHRzAAAAAAAAAB4AAAABAAACWQAAAAEANQ8AAAAAAAAWAAAAAAEAAALAAAAAAAI5gAAAAAAA1gAAAAABAAAFGQAAAAAVc3RzYwAAAAAAAAABAAAAAQAAABxzdHN6AAAAAAAAAAAAAAAeAAADCQAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAAVc3RjbwAAAAAAAAABAAAAMAAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALmlsc3QAAAAiAl8AAAAUbWVhbgAAAABjb20uYXBwbGUuaVR1bmVzAAAAF21pbmYAAAAPbmhudAAAAB9paW5mAAAAG2ltZnIAAAAUdHJlZgAAABRkYXRhAAAAAQAAAA';
        
        return video.play().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }
    
    // For mobile devices, manage videos with play buttons
    if ('ontouchstart' in window) {
        // For mobile devices, add play buttons to videos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // First frame is already loaded by loadVideoFirstFrames function
            
            // Create play button
            const playButton = document.createElement('button');
            playButton.className = 'video-play-button';
            playButton.innerHTML = '▶';
            
            // Add play button to video container
            const container = video.parentElement;
            container.appendChild(playButton);
            
            // Add click event to play/pause
            container.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playButton.style.display = 'none';
                } else {
                    video.pause();
                    playButton.style.display = 'block';
                }
            });
        });
    }
    
    // Simplified wave emoji animation (removed shimmer effect)
    const waveEmoji = document.querySelector('.wave-emoji');
    if (waveEmoji) {
        // Initial animation
        waveEmoji.classList.add('waving');
        
        // Periodic wave animation
        setInterval(() => {
            waveEmoji.classList.add('waving');
            
            setTimeout(() => {
                waveEmoji.classList.remove('waving');
            }, 1000);
        }, 3000);
    }
    
    // Dynamic positioning for scroll arrow
    const scrollArrow = document.querySelector('.scroll-arrow');
    const introContent = document.querySelector('.intro-content');
    const introSection = document.querySelector('.intro-section');
    
    function positionScrollArrow() {
        if (scrollArrow && introSection) {
            // Ensure the arrow is visible and at the proper position
            scrollArrow.style.opacity = "1";
            scrollArrow.style.visibility = "visible";
            
            // Make sure it's at the bottom of the intro section
            scrollArrow.style.bottom = "20px";
        }
    }
    
    // Position on load and window resize
    positionScrollArrow();
    window.addEventListener('resize', positionScrollArrow);
    
    // Show arrow after intro animations are complete
    setTimeout(() => {
        if (scrollArrow) {
            scrollArrow.style.opacity = "1";
            scrollArrow.style.visibility = "visible";
            scrollArrow.style.bottom = "20px";
        }
    }, 1500);
    
    // Scroll arrow functionality
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            const workSection = document.getElementById('work');
            if (workSection) {
                window.scrollTo({
                    top: workSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Three.js background animation
function initThreeBackground() {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('three-background').appendChild(renderer.domElement);
    
    // Create particle geometry
    const particlesCount = window.innerWidth > 767 ? 2000 : 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    // Create particles with a more elegant distribution
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Create a sphere of particles
        const radius = 20 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create particle material with blue colors
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true,
        color: 0x00A6FF, // Primary blue
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
    });
    
    // Create glowing particles
    const glowMaterial = new THREE.PointsMaterial({
        size: 0.04,
        sizeAttenuation: true,
        color: 0x00EEFF, // Cyan accent
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
    });
    
    // Additional deeper blue particles
    const deepBlueMaterial = new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        color: 0x0058B0, // Deep blue
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
    });
    
    // Create particle meshes
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    const glowParticlesMesh = new THREE.Points(particlesGeometry.clone(), glowMaterial);
    
    // Create deep blue particles with a different distribution
    const deepBlueGeometry = new THREE.BufferGeometry();
    const deepBluePos = new Float32Array(particlesCount * 0.5 * 3); // Fewer deep blue particles
    
    for (let i = 0; i < deepBluePos.length; i += 3) {
        // Create a different sphere of particles
        const radius = 15 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        deepBluePos[i] = radius * Math.sin(phi) * Math.cos(theta);
        deepBluePos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        deepBluePos[i + 2] = radius * Math.cos(phi);
    }
    
    deepBlueGeometry.setAttribute('position', new THREE.BufferAttribute(deepBluePos, 3));
    const deepBlueMesh = new THREE.Points(deepBlueGeometry, deepBlueMaterial);
    
    scene.add(particlesMesh);
    scene.add(glowParticlesMesh);
    scene.add(deepBlueMesh);
    
    // Mouse movement tracking for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', onMouseMove);
    
    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    }
    
    // Handle window resizing
    window.addEventListener('resize', onWindowResize);
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Light sources for a more dramatic look
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Add spotlight for shine effect
    const spotLight = new THREE.SpotLight(0x00A6FF, 1);
    spotLight.position.set(15, 20, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.distance = 200;
    scene.add(spotLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particles based on mouse movement for parallax effect
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.rotation.y += 0.0003;
        
        glowParticlesMesh.rotation.x += 0.0004;
        glowParticlesMesh.rotation.y += 0.0005;
        
        deepBlueMesh.rotation.x -= 0.0002;
        deepBlueMesh.rotation.y -= 0.0003;
        
        // Smooth camera movement based on mouse position
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        
        // Check if intro section is visible
        const introSection = document.getElementById('intro');
        if (introSection) {
            const rect = introSection.getBoundingClientRect();
            const visible = rect.bottom > 0 && rect.top < window.innerHeight;
            
            if (visible) {
                // Pulse the particles for a shimmering effect only when visible
                const time = Date.now() * 0.001;
                particlesMaterial.size = 0.02 + Math.sin(time) * 0.01;
                glowMaterial.size = 0.04 + Math.cos(time) * 0.02;
                deepBlueMaterial.size = 0.03 + Math.sin(time * 1.5) * 0.015;
                
                // Make background visible
                document.getElementById('three-background').style.opacity = '1';
            } else {
                // Hide background when intro section not visible to improve performance
                document.getElementById('three-background').style.opacity = '0';
            }
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Replace the shimmer overlay function with an empty one
function addShimmerOverlays() {
    // Function emptied to remove shimmer functionality
    // Keeping the function definition to avoid any potential reference errors
} 