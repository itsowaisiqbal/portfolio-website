// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js background
    initThreeBackground();
    
    // Check if on mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Add futuristic cursor effect only on non-mobile devices
    if (!isMobileDevice) {
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
        
        animate();
        
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
    }
    
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
    
    // Add "typing" effect to the gallery heading
    const platformTabs = document.querySelectorAll('.platform-tab');
    const platformPanels = document.querySelectorAll('.platform-panel');
    
    // Set up tab click handlers
    platformTabs.forEach(tab => {
        // Remove any existing click listeners first to avoid duplicates
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        
        newTab.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            
            // Update active tab
            document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding panel
            document.querySelectorAll('.platform-panel').forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`${platform}-panel`);
            if (targetPanel) { // Check if targetPanel exists
                targetPanel.classList.add('active');
                
                // Pause all videos in other (inactive) tabs to save resources
                document.querySelectorAll('video').forEach(video => {
                    if (!targetPanel.contains(video)) {
                        video.pause();
                    } else {
                        // Attempt to play visible videos in the now active tab
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(e => {
                                // Autoplay likely prevented, observer will handle interaction play
                                // console.log('Tab switch play prevented:', e);
                            });
                        }
                    }
                });
            }
        });
    });
    
    // Load portfolio data from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Populate profile information
            populateProfile(data.profile);
            
            // *** ADD GSAP Animation for intro image HERE ***
            // Ensures image src is set before animation starts
            gsap.from('.intro-image', {
                scale: 0.9, // Keep the scale animation
                autoAlpha: 0, // MODIFIED: Use autoAlpha instead of opacity
                duration: 1.0, 
                ease: 'power3.out',
                delay: 0.4 // Keep increased delay
            });
            
            // Populate project sections
            populateProjects(data.sections);
            
            // Populate contact information
            populateContact(data.contact);
            
            // Initialize the video lazy loading/playback observer
            initVideoObserver(); 
            
            // Initialize the video item visibility observer AFTER content is populated
            initVideoItemObserver();
            
            // Apply staggered delay AFTER items are added to the DOM
            document.querySelectorAll('.video-item').forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.05}s`; // Slightly faster stagger
            });
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
        });
    
    // Function to populate profile information
    function populateProfile(profile) {
        // Update name
        document.querySelector('.intro-greeting h1').textContent = `Hi! I'm ${profile.name}`;
        
        // Update job title
        document.querySelector('.job-title').textContent = profile.title;
        
        // Update location
        document.querySelector('.location').innerHTML = `<span class="location-icon">📍</span> ${profile.location} <span class="flag">🇦🇪</span>`;
        
        // Update profile image
        document.querySelector('.intro-image img').src = profile.image;
        
        // Update bio paragraphs
        const bioContainer = document.querySelector('.intro-bio');
        bioContainer.innerHTML = '';
        profile.bio.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            bioContainer.appendChild(p);
        });
    }
    
    // Function to populate project sections
    function populateProjects(sections) {
        // Populate Lens Studio section
        populateSection('snapchat', sections.lens_studio);
        
        // Populate Effect House section
        populateSection('tiktok', sections.effect_house);
        
        // Populate Other section
        populateSection('other', sections.other);
    }
    
    // Function to populate a specific project section
    function populateSection(platformId, sectionData) {
        const panel = document.getElementById(`${platformId}-panel`);
        if (!panel) return;
        
        // Update section title and description
        const infoElement = panel.querySelector('.platform-info');
        if (infoElement) {
            infoElement.querySelector('h3').textContent = sectionData.title;
            infoElement.querySelector('p').textContent = sectionData.description;
        }
        
        // Update video grid
        const videoGrid = panel.querySelector('.video-grid');
        if (!videoGrid) return;
        
        videoGrid.innerHTML = '';
        
        // Add each video item
        sectionData.items.forEach(item => {
            // Skip disabled items
            if (item.disabled) {
                console.log(`Skipping disabled video: ${item.title}`);
                return;
            }
            
            // Log the video URL to help with debugging
            // console.log(`Creating video element for: ${item.video_url}`);
            
            // MODIFIED: Add the 'ar' class (or potentially others) dynamically if needed
            // For now, keeping 'ar' as default, adjust if different video types need different classes
            const videoItemHtml = `
                <div class="video-item ar">
                    <div class="video-container portrait">
                        <div class="video-loading-spinner" style="display: none;"></div>
                        <video muted loop playsinline
                               data-src="${item.video_url}"
                               poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="video-info">
                        <h3>${item.title}</h3>
                        <div class="tags">
                            ${item.tags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            videoGrid.innerHTML += videoItemHtml;
        });
    }
    
    // Function to populate contact information
    function populateContact(contact) {
        // Update email
        const emailLink = document.querySelector('.contact-info a');
        if (emailLink) {
            emailLink.href = `mailto:${contact.email}`;
            emailLink.textContent = contact.email;
        }
        
        // Update social links
        if (contact.social) {
            const socialLinks = document.querySelector('.social-links');
            if (socialLinks) {
                const linkedinLink = socialLinks.querySelector('.linkedin');
                if (linkedinLink) linkedinLink.href = contact.social.linkedin;
                
                const instagramLink = socialLinks.querySelector('.instagram');
                if (instagramLink) instagramLink.href = contact.social.instagram;
                
                const snapchatLink = socialLinks.querySelector('.snapchat');
                if (snapchatLink) snapchatLink.href = contact.social.snapchat;
                
                const tiktokLink = socialLinks.querySelector('.tiktok');
                if (tiktokLink) tiktokLink.href = contact.social.tiktok;
            }
        }
    }
    
    // Centralized video observer function for loading/playback
    function initVideoObserver() {
        if (!('IntersectionObserver' in window)) {
            console.log("IntersectionObserver not supported. Videos might not lazy load or autoplay correctly.");
            // Basic fallback: Load all videos immediately (less performant)
             document.querySelectorAll('video[data-src]').forEach(video => {
                 loadAndPlayVideo(video);
             });
            return;
        }

        const options = {
            root: null, // relative to document viewport
            rootMargin: '150px', // Load videos slightly before they enter viewport
            threshold: 0.01 // Trigger even if only 1% is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                const container = video.closest('.video-container'); // Find the container
                const spinner = container ? container.querySelector('.video-loading-spinner') : null;

                if (entry.isIntersecting) {
                    // Video is coming into view or is in view
                    const dataSrc = video.getAttribute('data-src');

                    if (dataSrc) {
                        // Video hasn't been loaded yet
                        if (spinner) spinner.style.display = 'block';

                        // Add listeners before setting src
                        video.addEventListener('loadeddata', function handleLoaded() {
                             if (spinner) spinner.style.display = 'none';
                             // Attempt to play only if still intersecting when loaded
                             if (entry.isIntersecting) {
                                 const playPromise = video.play();
                                 if (playPromise !== undefined) {
                                     playPromise.catch(e => {
                                         console.log('Autoplay prevented on load:', video.getAttribute('data-src'), e);
                                         // Consider showing a play button here if needed
                                     });
                                 }
                             } else {
                                 video.pause(); // Ensure paused if scrolled away before loaded
                             }
                             // Remove listener after first load
                             video.removeEventListener('loadeddata', handleLoaded);
                        }, { once: true }); // Use { once: true } for cleanup

                        video.addEventListener('error', function handleError(e) {
                             console.error('Error loading video:', video.getAttribute('data-src'), e);
                             if (spinner) spinner.style.display = 'none';
                             // Optionally display a video error message in the container
                             const errorMsg = container.querySelector('.video-error-message') || document.createElement('div');
                             errorMsg.className = 'video-error-message';
                             errorMsg.textContent = 'Error loading';
                             if (!container.contains(errorMsg)) {
                                container.appendChild(errorMsg);
                             }
                             video.removeEventListener('error', handleError);
                        }, { once: true });

                        video.src = dataSrc;
                        video.removeAttribute('data-src'); // Remove data-src after setting src
                        video.load(); // Start loading
                    } else if (video.readyState >= 3) { // HAVE_FUTURE_DATA or more
                         // Video already loaded or loading, try playing
                         const playPromise = video.play();
                         if (playPromise !== undefined) {
                             playPromise.catch(e => {
                                 // console.log('Autoplay prevented on scroll into view:', video.src, e);
                             });
                         }
                    }
                } else {
                    // Video is scrolling out of view
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, options);

        // Observe all video elements initially present or added later
        const videosToObserve = document.querySelectorAll('video[data-src]');
        console.log(`Initializing observer for ${videosToObserve.length} videos.`);
        videosToObserve.forEach(video => {
            observer.observe(video);
        });

        // If new videos are added dynamically later (e.g., infinite scroll),
        // you would need to query for them and call observer.observe(newVideo)
    }
    
    // Intersection Observer for general fade-in animations (e.g., contact section, headings)
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
    
    // NEW: Intersection Observer specifically for video item fade-in/visibility
    function initVideoItemObserver() {
        const videoItemsToObserve = document.querySelectorAll('.video-item');
        if (!('IntersectionObserver' in window) || videoItemsToObserve.length === 0) {
            // Fallback or simply make all items visible immediately if no observer
            videoItemsToObserve.forEach(item => item.classList.add('visible'));
            return;
        }

        const itemObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% visible
        };

        const itemObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after it becomes visible if you don't need it to fade out
                    // observer.unobserve(entry.target);
                } else {
                     // Optional: Remove 'visible' class if you want items to fade out when scrolled out
                     // entry.target.classList.remove('visible');
                }
            });
        }, itemObserverOptions);

        console.log(`Initializing visibility observer for ${videoItemsToObserve.length} video items.`);
        videoItemsToObserve.forEach(item => {
            itemObserver.observe(item);
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
            // Just ensure the arrow is visible, CSS will handle the positioning
            scrollArrow.style.opacity = "1";
            scrollArrow.style.visibility = "visible";
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

    // Add video centering on click/tap
    const platformContent = document.querySelector('.platform-content');
    if (platformContent) {
        platformContent.addEventListener('click', function(event) {
            // Find the closest parent video item
            const clickedItem = event.target.closest('.video-item');

            if (clickedItem) {
                // Calculate the position to scroll to
                const itemRect = clickedItem.getBoundingClientRect();
                const itemTop = itemRect.top + window.scrollY;
                const itemHeight = clickedItem.offsetHeight;
                const viewportHeight = window.innerHeight;
                
                // Calculate the scroll position to center the item
                // Subtract half the viewport height, add back half the item height
                const targetScrollY = itemTop - (viewportHeight / 2) + (itemHeight / 2);
                
                // Smoothly scroll to the calculated position
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
                
                // Optional: Prevent any default click behavior if necessary
                // event.preventDefault(); 
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