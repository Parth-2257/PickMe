document.addEventListener("DOMContentLoaded", () => {

    const colorPicker = document.getElementById("colorPicker");
    const colorPreview = document.getElementById("colorPreview");
    const hexValue = document.getElementById("hexValue");
    const rgbValue = document.getElementById("rgbValue");
    const hslValue = document.getElementById("hslValue");
    const copyBtn = document.getElementById("copyBtn");
    const resetBtn = document.getElementById("resetBtn");
    const recentColorsContainer = document.getElementById("recentColorsContainer");
    const contrastWhite = document.getElementById("contrastWhite");
    const contrastBlack = document.getElementById("contrastBlack");

    let recentColors = JSON.parse(localStorage.getItem("recentColors")) || [];

    function hexToRgb(hex) {
        return {
            r: parseInt(hex.substr(1, 2), 16),
            g: parseInt(hex.substr(3, 2), 16),
            b: parseInt(hex.substr(5, 2), 16)
        };
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max !== min) {
            let d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function updateColor(hex) {
        colorPreview.style.background = hex;

        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        hexValue.textContent = hex.toUpperCase();
        rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        updateRecentColors(hex);
    }

    function updateRecentColors(color) {
        if (!recentColors.includes(color)) {
            recentColors.unshift(color);
            if (recentColors.length > 5) recentColors.pop();
            localStorage.setItem("recentColors", JSON.stringify(recentColors));
        }
        renderRecentColors();
    }

    function renderRecentColors() {
        recentColorsContainer.innerHTML = "";
        recentColors.forEach(c => {
            let div = document.createElement("div");
            div.className = "recent-color";
            div.style.background = c;
            div.onclick = () => updateColor(c);
            recentColorsContainer.appendChild(div);
        });
    }

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(hexValue.textContent);
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy Color", 1500);
    };

    resetBtn.onclick = () => {
        updateColor("#ffffff");
        colorPicker.value = "#ffffff";
    };

    colorPicker.oninput = (e) => updateColor(e.target.value);

    renderRecentColors();
    updateColor(colorPicker.value);
});

document.getElementById("hexBtn").addEventListener("click", function() {
    navigator.clipboard.writeText(hexValue.innerText)
        .catch(err => {
            console.error("Error copying: ", err);
        });
});

document.getElementById("rgbBtn").addEventListener("click", function() {
    navigator.clipboard.writeText(rgbValue.innerText)
        .catch(err => {
            console.error("Error copying: ", err);
        });
});

document.getElementById("hslBtn").addEventListener("click", function() {
    navigator.clipboard.writeText(hslValue.innerText)
        .catch(err => {
            console.error("Error copying: ", err);
        });
});
