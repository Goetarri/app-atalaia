let currentLang = 'es'; 
let currentImageIndex = 0; 
let currentImagePaths = []; 
let currentAppliance = 'lavadora'; 

// Variables para detectar el swipe
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => { 
    updateText(); 

    // Añadir listeners al Modal para detectar el dedo
    const modalElement = document.getElementById("myModal");

    if (modalElement) {
        modalElement.addEventListener('touchstart', e => {
            // Guardamos donde empieza el toque
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        modalElement.addEventListener('touchend', e => {
            // Guardamos donde termina el toque
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }
});

function showSection(sectionId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0,0);
    
    if (sectionId === 'appliances') {
        showAppliance('lavadora');
    }

    if (sectionId === 'info-practica') {
        showPracticalInfo('emergency');
    }
}

function showAppliance(applianceId) {
    const buttons = document.querySelectorAll('#appliances .sub-btn-group .sub-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`#appliances .sub-btn[onclick*="'${applianceId}'"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    const subSections = document.querySelectorAll('#appliances .sub-section');
    subSections.forEach(section => section.classList.remove('visible'));
    
    const targetSection = document.getElementById(applianceId);
    if (targetSection) {
        targetSection.classList.add('visible');
    }

    currentAppliance = applianceId; 

    if (applianceId === 'lavadora') {
        updateWasherGrid();
    }
    
    window.scrollTo(0, 0); 
}

function showPracticalInfo(infoId) {
    const buttons = document.querySelectorAll('#info-practica .sub-btn-group .sub-btn');
    buttons.forEach(btn => btn.classList.remove('active-info-practica'));

    const activeButton = document.querySelector(`#info-practica .sub-btn[onclick*="'${infoId}'"]`);
    if (activeButton) {
        activeButton.classList.add('active-info-practica');
    }

    const subSections = document.querySelectorAll('#info-practica .sub-section');
    subSections.forEach(section => section.classList.remove('visible-info-practica'));
    subSections.forEach(section => section.style.display = 'none'); 

    const targetSection = document.getElementById(`info-${infoId}`);
    if (targetSection) {
        targetSection.classList.add('visible-info-practica');
        targetSection.style.display = 'block';
    }
    
    if (infoId === 'emergency') {
        updateInfoTable();
    }
    if (infoId === 'hospitals') {
        updateHospitalTable();
    }
    if (infoId === 'info') {
        updateAddressTable();
    }

    window.scrollTo(0, 0); 
}

function toggleLanguage() {
    if (currentLang === 'es') {
        currentLang = 'en';
        document.getElementById('lang-btn').innerText = 'ES 🇪🇸';
    } else {
        currentLang = 'es';
        document.getElementById('lang-btn').innerText = 'EN 🇬🇧';
    }
    updateText();
    
    const appliancesScreen = document.getElementById('appliances');
    if (appliancesScreen.classList.contains('active')) {
        showAppliance(currentAppliance);
    }

    if (document.getElementById('info-emergency').style.display === 'block') {
        updateInfoTable();
    }
    if (document.getElementById('info-hospitals').style.display === 'block') {
        updateHospitalTable();
    }
    if (document.getElementById('info-info').style.display === 'block') {
        updateAddressTable();
    }
}

function updateText() {
    const translations = (currentLang === 'es') ? ES : EN;
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        
        if (key in translations) { 
            const value = translations[key];

            if (el.tagName === 'IMG' && key !== 'lavadora_img') {
                el.src = value;
            } else if (key !== 'lavadora_img') { 
                el.innerText = value;
            }
        }
    });
    
    updateWasherGrid();
    updateInfoTable();
    updateHospitalTable(); 
    updateAddressTable();
}


function updateWasherGrid() {
    const translations = (currentLang === 'es') ? ES : EN;
    const gridContainer = document.getElementById('washer-grid');
    
    if (gridContainer && translations.lavadora_img) {
        currentImagePaths = translations.lavadora_img; 
        gridContainer.innerHTML = ''; 

        currentImagePaths.forEach((path, index) => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            
            const img = document.createElement('img');
            img.src = path;
            img.alt = 'Paso de lavadora ' + (index + 1);
            // Pasamos el index para saber qué foto abrir
            img.onclick = () => openModal(index); 
            
            item.appendChild(img);
            gridContainer.appendChild(item);
        });
    }
}

// --- FUNCIONES DEL MODAL Y GALERÍA ---

function openModal(index) {
    const modal = document.getElementById("myModal");
    
    // Actualizamos el índice global
    currentImageIndex = index;
    
    modal.style.display = "flex";
    updateModalImage(); 
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function changeImage(direction) {
    currentImageIndex += direction;

    // Lógica circular
    if (currentImageIndex >= currentImagePaths.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = currentImagePaths.length - 1;
    }

    updateModalImage();
}

function updateModalImage() {
    const modalImg = document.getElementById("img01");
    if (currentImagePaths && currentImagePaths.length > 0) {
        modalImg.src = currentImagePaths[currentImageIndex];
    }
}

function handleSwipe() {
    // Umbral mínimo (50px)
    const threshold = 50;

    if (touchEndX < touchStartX - threshold) {
        // Swipe Izquierda -> Siguiente
        changeImage(1); 
    }
    
    if (touchEndX > touchStartX + threshold) {
        // Swipe Derecha -> Anterior
        changeImage(-1);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito: ', registration.scope);
            })
            .catch(error => {
                console.log('Fallo en el registro de ServiceWorker: ', error);
            });
    });
}

// --- FUNCIONALIDAD DE LA TABLA DE TELÉFONOS ---

function updateInfoTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('info-table');
    if (!table) return; 

    table.innerHTML = ''; 

    const infoData = [
        ['🚨', 'tel_emergencias', '112'], 
        ['🚑', 'tel_ambulancia', '061'], 
        ['🚓', 'tel_ertzaintza', '088'], 
        ['🚔', 'tel_municipal', '092'], 
        ['🔥', 'tel_bomberos', '080']
    ];

    infoData.forEach(data => {
        const [icon, key, number] = data;
        const serviceName = translations[key] || key;
        
        const row = table.insertRow();
        
        const iconCell = row.insertCell(0);
        iconCell.className = 'tel-col-icon';
        iconCell.innerHTML = icon;

        const nameCell = row.insertCell(1);
        nameCell.innerText = serviceName;

        const numberCell = row.insertCell(2);
        numberCell.className = 'tel-col-number';
        numberCell.innerHTML = `<a href="tel:${number.replace(/<br>/g, '')}">${number}</a>`;
    });
}

// --- FUNCIÓN PARA LA TABLA DE HOSPITALES ---
function updateHospitalTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('hospital-table');
    if (!table) return; 

    table.innerHTML = ''; 

    const hospitalData = [
        ['🏥', 'addr_ambulatorio', 'addr_ambulatorio_desc', 'addr_ambulatorio_tel', 'Nafarroa Hiribidea, 14, 20013 Donostia / San Sebastián, Gipuzkoa'],
        ['🏥', 'addr_hospital', 'addr_hospital_desc', 'addr_hospital_tel', 'Begiristain Doktorea Pasealekua, s/n, 20014 Donostia / San Sebastián, Gipuzkoa']
    ];

    hospitalData.forEach(data => {
        const [icon, nameKey, descKey, telKey, mapQuery] = data;
        
        const name = translations[nameKey] || nameKey;
        const description = translations[descKey] || descKey;
        const number = telKey ? (translations[telKey] || '') : '';
        const phoneDisplay = number ? number : '';
        const telLink = number ? number.replace(/ /g, '').replace(/<br>/g, '') : '';
        
        const row = table.insertRow();
        
        row.onclick = function() {
            showHospitalLocationOnMap(mapQuery, this, name); 
        };
        
        const iconCell = row.insertCell(0);
        iconCell.className = 'tel-col-icon';
        iconCell.innerHTML = icon;

        const nameCell = row.insertCell(1);
        nameCell.className = 'address-col-text'; 
        nameCell.innerHTML = `<span class="address-name">${name}</span><span class="address-desc">${description}</span>`;

        const numberCell = row.insertCell(2);
        numberCell.className = 'tel-col-number';
        if (number) {
            numberCell.innerHTML = `<a href="tel:${telLink}">${phoneDisplay}</a>`;
        } else {
            numberCell.innerText = '';
        }
    });

    if (hospitalData.length > 0 && document.getElementById('info-hospitals').classList.contains('visible-info-practica')) {
        showHospitalLocationOnMap(hospitalData[0][4], table.rows[0], translations[hospitalData[0][1]]);
    }
}


function updateAddressTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('address-table');
    if (!table) return; 

    table.innerHTML = ''; 

    const addressData = [
        ['🏠', 'addr_home', 'addr_home_desc', 'addr_home_tel', 'Segundo Izpizua Kalea, 7, 20001 Donostia / San Sebastián, Gipuzkoa'],
        ['🚌', 'addr_bus', 'addr_bus_desc', 'addr_bus_tel', 'Federico García Lorca Pasealekua, 1, 20012 Donostia / San Sebastián, Gipuzkoa'], 
        ['🚉', 'addr_train', 'addr_train_desc', 'addr_train_tel', 'De Francia Ibilbidea, 22, 20012 Donostia / San Sebastián, Gipuzkoa'],
        ['🚕', 'addr_taxi', 'addr_taxi_desc', 'addr_taxi_tel', 'Kolon Pasealekua, 16-20, 20002 Donostia / San Sebastián, Gipuzkoa'],
        ['💊', 'addr_pharmacy', 'addr_pharmacy_desc', 'addr_pharmacy_tel', 'San Frantzisko Kalea, 54, 20002 Donostia / San Sebastián, Gipuzkoa'],
        ['💊', 'addr_pharmacy24H', 'addr_pharmacy24H_desc', 'addr_pharmacy24H_tel', 'Idiakez Kalea, 4, 20004 Donostia / San Sebastián, Gipuzkoa']
    ];

    addressData.forEach(data => {
        const [icon, nameKey, descKey, telKey, mapQuery] = data;
        
        const name = translations[nameKey] || nameKey;
        const description = translations[descKey] || descKey;
        const number = telKey ? (translations[telKey] || '') : '';
        const phoneDisplay = number ? number : '';
        const telLink = number ? number.replace(/ /g, '').replace(/<br>/g, '') : '';
        
        const row = table.insertRow();
        
        row.onclick = function() {
            showLocationOnMap(mapQuery, this);
        };
        
        const iconCell = row.insertCell(0);
        iconCell.className = 'tel-col-icon';
        iconCell.innerHTML = icon;

        const nameCell = row.insertCell(1);
        nameCell.className = 'address-col-text';
        nameCell.innerHTML = `<span class="address-name">${name}</span><span class="address-desc">${description}</span>`;

        const numberCell = row.insertCell(2);
        numberCell.className = 'tel-col-number';
        if (number) {
            numberCell.innerHTML = `<a href="tel:${telLink}">${phoneDisplay}</a>`;
        } else {
            numberCell.innerText = '';
        }
    });
    
    if (addressData.length > 0) {
        showLocationOnMap(addressData[0][4], table.rows[0]);
    }
}

function showLocationOnMap(query, clickedRow) {
    const translations = (currentLang === 'es') ? ES : EN; 
    const mapIframe = document.getElementById('google-map-embed');
    const mapTitle = document.querySelector('#map-container h3');
    
    const baseUrl = 'https://maps.google.com/maps?q=';
    const finalUrl = `${baseUrl}${encodeURIComponent(query)}&z=15&output=embed`; 

    mapIframe.src = finalUrl;
    
    const allRows = document.querySelectorAll('#address-table tr');
    allRows.forEach(row => row.classList.remove('address-row-active'));
    if (clickedRow) {
        clickedRow.classList.add('address-row-active');
    }

    if (clickedRow && mapTitle) {
        const nameElement = clickedRow.querySelector('.address-name');
        const baseTitle = (currentLang === 'es') ? 'Ubicación de ' : 'Location of ';
        if (nameElement) {
            mapTitle.innerText = `${baseTitle}${nameElement.innerText}`;
        } else {
             mapTitle.innerText = translations['mapa_titulo'];
        }
    } else if (mapTitle) {
         mapTitle.innerText = translations['mapa_titulo'];
    }
}

function showHospitalLocationOnMap(query, clickedRow, name) {
    const translations = (currentLang === 'es') ? ES : EN; 
    const mapIframe = document.getElementById('google-map-embed-hospital'); 
    const mapTitle = document.querySelector('#hospital-map-container h3'); 
    
    const baseUrl = 'https://maps.google.com/maps?q=';
    const finalUrl = `${baseUrl}${encodeURIComponent(query)}&z=15&output=embed`; 

    mapIframe.src = finalUrl;
    
    const allRows = document.querySelectorAll('#hospital-table tr'); 
    allRows.forEach(row => row.classList.remove('address-row-active'));
    if (clickedRow) {
        clickedRow.classList.add('address-row-active');
    }

    if (clickedRow && mapTitle) {
        const nameElement = clickedRow.querySelector('.address-name');
        const baseTitle = (currentLang === 'es') ? 'Ubicación de ' : 'Location of ';
        if (nameElement) {
            mapTitle.innerText = `${baseTitle}${nameElement.innerText}`;
        } else {
             mapTitle.innerText = translations['mapa_titulo'];
        }
    } else if (mapTitle) {
         mapTitle.innerText = translations['mapa_titulo'];
    }
}