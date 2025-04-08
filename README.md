# Immersive Media Portfolio

A minimalist, video-focused portfolio website for showcasing AR, VR, MR, and AI creative work, optimized for portrait-oriented mobile content.

## Features

- Clean, minimalist design with focus on portrait-oriented video content
- Responsive video gallery optimized for mobile AR content
- Custom animated cursor
- Auto-playing videos when they enter viewport
- Smooth scrolling navigation with transparent header
- Typing effect on page title
- Section fade-in animations
- Mobile-friendly design with play buttons for devices with autoplay restrictions

## For Creative Developers Working With

- AR (Snapchat, TikTok, 8th Wall)
- VR/MR (Unity)
- Camera Kit SDK
- AI Tools (ChatGPT, Cursor, Comfy UI)
- Interactive Experiences

## How to Use

1. Download or clone this repository
2. Add your video files to the `videos` folder
3. Add placeholder images to the `images` folder (thumbnails for videos)
4. Open index.html in your browser to view the website
5. Customize the content in index.html with your own information

## Adding Your Videos

1. Add video files to the `videos` folder (recommended format: MP4)
2. Add placeholder images to the `images` folder (shown while videos load)
3. Update the video sources in index.html:

```html
<div class="video-item ar">
    <div class="video-container portrait">  <!-- Use 'portrait' class for 9:16 videos -->
        <video autoplay muted loop playsinline poster="images/your-placeholder.jpg">
            <source src="videos/your-video.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="video-info">
        <h3>Your Project Title</h3>
        <p>Project description goes here.</p>
        <div class="tags">
            <span>AR</span>
            <span>Your Tag</span>
        </div>
    </div>
</div>
```

Use the classes `ar`, `web-ar`, `vr`, or `ai` to categorize your projects. Add the `portrait` class to the video container for 9:16 aspect ratio videos (most mobile AR content). Omit it for 16:9 videos.

## Customization Tips

### Changing Colors

The main colors of the website can be changed in the CSS file using CSS variables. Look for the `:root` section at the top of the styles.css file:

```css
:root {
    --primary: #00b4ff;    /* Main blue color */
    --secondary: #6e1fff;  /* Purple accent */
    --accent: #00ff88;     /* Green highlight */
    --dark: #0a0a14;       /* Dark background */
    --light: #f0f0f8;      /* Light text */
    --text: #e0e0e8;       /* Body text */
    --card-bg: rgba(16, 16, 32, 0.7);  /* Card background */
    --glass: rgba(255, 255, 255, 0.1);  /* Glass effect */
}
```

### Video Performance Optimization

For better performance:

1. Compress your videos to reduce file size
2. Keep videos under 10MB when possible
3. Use MP4 format for best browser compatibility
4. Provide poster images that load before the video
5. Consider using lower resolution videos for mobile devices

### Mobile Autoplay Handling

The site automatically detects if a browser supports video autoplay and adds play buttons for browsers that don't support it. The play buttons will appear in the center of videos that require user interaction to play.

### Disabling Custom Cursor

If you prefer the default cursor, you can disable the custom cursor by removing or commenting out the relevant CSS in styles.css:

```css
/* Remove these properties to disable custom cursor */
body {
    cursor: none;
}

a, button, input, textarea, .video-item {
    cursor: none;
}

/* And comment out or remove the .cursor-dot and .cursor-outline styles */
```

## License

This template is free to use for personal and commercial projects.

## Credits

- Design inspiration: Atomic Digital Design Gallery and awesome-ar.com
- Fonts: Arial (System font)
- Animations: Custom JavaScript 