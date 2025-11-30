document.addEventListener('DOMContentLoaded', function () {
    // Define the order of appliances for swipe navigation
    const applianceOrder = ['lavadora', 'calefaccion', 'toldo', 'persiana'];

    // --- Touch swipe detection ---
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe

    function handleGesture() {
        const swipedDistance = touchendX - touchstartX;
        if (Math.abs(swipedDistance) < swipeThreshold) {
            return; // Not a swipe
        }

        const currentApplianceId = getCurrentApplianceId();
        if (!currentApplianceId) {
            return; // Not on an appliance page
        }

        const currentIndex = applianceOrder.indexOf(currentApplianceId);
        if (currentIndex === -1) {
            return; // Should not happen if IDs are correct
        }

        let nextIndex;
        if (touchendX < touchstartX) { // Swiped left
            nextIndex = (currentIndex + 1) % applianceOrder.length;
        } else { // Swiped right
            nextIndex = (currentIndex - 1 + applianceOrder.length) % applianceOrder.length;
        }

        const nextApplianceId = applianceOrder[nextIndex];
        showElectro(nextApplianceId);
    }

    // Add listeners to the content area where swipe should be detected
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
        contentDiv.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        contentDiv.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleGesture();
        });
    }

    /**
     * Determines the current appliance being viewed.
     * It checks for a specific element that is only visible on appliance pages.
     * @returns {string|null} The ID of the current appliance or null.
     */
    function getCurrentApplianceId() {
        const applianceTitleElement = document.querySelector('#content .electro-details h2');
        if (!applianceTitleElement) {
            return null;
        }

        const titleKey = applianceTitleElement.dataset.lang;
        switch (titleKey) {
            case 'lavadora_titulo':
                return 'lavadora';
            case 'calefaccion_titulo':
                return 'calefaccion';
            case 'toldo_titulo':
                return 'toldo';
            case 'persiana_titulo':
                return 'persiana';
            default:
                return null;
        }
    }
});

// NOTE: The following functions (showElectro, showHome, etc.) are assumed to exist
// in your original application logic. The swipe functionality will call `showElectro`.

/*
function showElectro(electro) {
    // This function should already exist in your app.
    // It's responsible for rendering the details of a specific appliance.
    // Example of how it might look:

    const content = document.getElementById('content');
    const lang = document.documentElement.lang;
    const translations = (lang === 'es') ? ES : EN;

    let html = `
        <div class="electro-details">
            <h2 data-lang="${electro}_titulo">${translations[electro + '_titulo']}</h2>
            <p>${translations[electro + '_desc']}</p>
    `;

    const images = translations[electro + '_img'];
    if (Array.isArray(images)) {
        images.forEach(img => {
            html += `<img src="${img}" alt="${translations[electro + '_titulo']}" class="img-fluid my-2">`;
        });
    } else {
        html += `<img src="${images}" alt="${translations[electro + '_titulo']}" class="img-fluid my-2">`;
    }

    html += `
        <button onclick="showHome('instrucciones')" data-lang="btn_atras">${translations['btn_atras']}</button>
        </div>
    `;

    content.innerHTML = html;
}
*/