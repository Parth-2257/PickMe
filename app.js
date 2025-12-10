document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const colorPreview = document.getElementById('colorPreview');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const recentColorsContainer = document.getElementById('recentColorsContainer');
    const contrastWhite = document.getElementById('contrastWhite');
    const contrastBlack = document.getElementById('contrastBlack');

    let recentColors = JSON.parse(localStorage.getItem('recentColors')) || [];

    function updateRecentColors(color) {
        if (!recentColors.includes(color)) {
            recentColors.unshift(color);
            if (recentColors.length > 5) {
                recentColors.pop();
            }
            localStorage.setItem('recentColors', JSON.stringify(recentColors));
            renderRecentColors();
        }
    }

    function renderRecentColors() {
        recentColorsContainer.innerHTML = '';
        recentColors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'recent-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.title = color;
            colorDiv.addEventListener('click', () => {
                colorPicker.value = color;
                updateColor(color);
            });
            recentColorsContainer.appendChild(colorDiv);
        });
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h = Math.round(h * 60);
            if (h < 0) h += 360;
        }

        s = Math.round(s * 100);
        l = Math.round(l * 100);
        return { h, s, l };
    }

    function getContrastRatio(color1, color2) {
        const luminance1 = getLuminance(color1);
        const luminance2 = getLuminance(color2);
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    function getLuminance(color) {
        const rgb = color.match(/\d+/g);
        const [r, g, b] = rgb.map(val => {
            val = parseInt(val) / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function checkContrast(color) {
        const whiteContrast = getContrastRatio(color, 'rgb(255, 255, 255)');
        const blackContrast = getContrastRatio(color, 'rgb(0, 0, 0)');
        
        contrastWhite.textContent = `Contrast with White: ${whiteContrast.toFixed(2)}`;
        contrastWhite.className = whiteContrast >= 4.5 ? 'good-contrast' : 'poor-contrast';
        
        contrastBlack.textContent = `Contrast with Black: ${blackContrast.toFixed(2)}`;
        contrastBlack.className = blackContrast >= 4.5 ? 'good-contrast' : 'poor-contrast';
    }

    function updateColor(hex) {
        colorPreview.style.backgroundColor = hex;
        
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        hexValue.textContent = hex.toUpperCase();
        rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        checkContrast(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        updateRecentColors(hex);
    }

    colorPicker.addEventListener('input', (e) => {
        updateColor(e.target.value);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(hexValue.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    resetBtn.addEventListener('click', () => {
        const defaultColor = '#ffffff';
        colorPicker.value = defaultColor;
        updateColor(defaultColor);
    });

    renderRecentColors();
    updateColor(colorPicker.value);
});
