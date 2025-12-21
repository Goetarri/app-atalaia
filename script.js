let currentLang = 'en'; 
let currentImageIndex = 0; 
let currentImagePaths = []; 
let currentTipInfo = { titleKey: null, tipId: null, origin: null };

// Variables swipe
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => { 
    updateText();
    setupModal(); 
});

/* --- NAVEGACIÓN PRINCIPAL (BOTTOM BAR) --- */
function showTab(sectionId, navTargetId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0,0);
    
    // ... (Tu lógica para resetear 'appliances' y 'tips-main' debe mantenerse aquí) ...
    if (sectionId === 'appliances') {
        showApplianceMenu(); // <-- SOLUCIÓN: Llama a la función que SÓLO muestra el menú
    }

    // Si volvemos a la pantalla 'atalaia', reseteamos su título.
    if (sectionId === 'atalaia') {
        const translations = (currentLang === 'es') ? ES : EN;
        const atalaiaTitle = document.querySelector('#atalaia h2');
        if (atalaiaTitle) atalaiaTitle.innerText = translations['titulo_home'];
    }
    
    // 3. Lógica para actualizar la barra inferior (ACTUALIZADA)
    const navTarget = navTargetId || sectionId; // Usar navTargetId si se proporciona, si no, usar sectionId
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        
        // ¡CAMBIO CLAVE! Comprueba si el 'data-target' del botón coincide con el 'sectionId'
        if (item.getAttribute('data-target') === navTarget) {
            item.classList.add('active');
        }
    });
}

/* --- LOGICA PANTALLA HOME --- */
function openInstructionsMenu() {
    showTab('appliances');
    // Aseguramos que se ve el menú y no un detalle anterior
    backToApplianceMenu();
}

function showWifiScreen() {
    // Mostramos la pantalla dedicada de wifi
    // Nota: Visualmente mantenemos la pestaña 'Home' activa en la barra
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById('wifi-screen').classList.add('active');
    window.scrollTo(0,0);
}

/* --- LÓGICA DE APARATOS ESPECÍFICOS (Detalle) --- */
function showAppliance(applianceId) {
    // Ocultar el botón de "Atrás" a Atalaia y mostrar el de "Atrás al Menú"
    const backToAtalaiaBtn = document.querySelector('#appliances .header-row .back-btn[onclick="showTab(\'atalaia\')"]');
    if (backToAtalaiaBtn) backToAtalaiaBtn.style.display = 'none';
    
    document.getElementById('back-to-appliance-menu').style.display = 'block';

    // 1. OCULTAR el menú de botones
    const menu = document.getElementById('appliances-menu');
    if (menu) {
        menu.style.display = 'none';
    }

    // 2. Oculta todos los contenidos detallados (para limpiar la vista)
    const contents = document.querySelectorAll('#appliances .appliance-content');
    contents.forEach(content => content.style.display = 'none');
    
    // 3. Muestra SÓLO el contenido del electrodoméstico actual
    // El ID será 'lavadora-content' si applianceId es 'lavadora'
    const contentToShow = document.getElementById(applianceId + '-content');
    if (contentToShow) {
        contentToShow.style.display = 'block'; // <--- ¡ESTA ES LA LÍNEA CLAVE PARA QUE SE VEA!
    }

    // 4. Lógica para actualizar los botones (sub-menú de cada aparato)
    const buttons = document.querySelectorAll('#appliances .sub-btn-group .sub-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`#appliances .sub-btn[data-appliance="${applianceId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // 5. Lógica de rejilla de lavadora (mantener la funcionalidad existente)
    if (applianceId === 'lavadora') {
        updateWasherGrid();
    }
    
    // 6. Actualizar la variable global (si existe)
    if (typeof currentAppliance !== 'undefined') {
        currentAppliance = applianceId;
    }
}

/* --- NAVEGACIÓN DENTRO DE APPLIANCES --- */
function showApplianceMenu() {
    // Mostrar el botón de "Atrás" a Atalaia y ocultar el de "Atrás al Menú"
    const backToAtalaiaBtn = document.querySelector('#appliances .header-row .back-btn[onclick="showTab(\'atalaia\')"]');
    if (backToAtalaiaBtn) backToAtalaiaBtn.style.display = 'block';

    document.getElementById('back-to-appliance-menu').style.display = 'none';

    // 1. Muestra el menú principal de botones
    const menu = document.getElementById('appliances-menu');
    if (menu) {
        menu.style.display = 'block'; 
    }

    // 2. Oculta TODOS los contenidos detallados, ¡incluyendo lavadora-content!
    const contents = document.querySelectorAll('#appliances .appliance-content');
    contents.forEach(content => content.style.display = 'none'); 
}

/* --- LOGICA PANTALLA TIPS (Información Práctica) --- */
// MODIFICADA: Ahora acepta 'titleKey' para cambiar el encabezado
function showTipDetail(tipId, titleKey, origin) {
    const targetId = 'info-' + tipId;

    // Si se llama desde Atalaia, primero cambiamos a la pantalla de Información
    if (origin === 'atalaia' || origin === 'activities') { 
        showTab('tips-main', origin); // <-- CORRECCIÓN: Muestra la pantalla de tips, pero mantiene 'origin' como el botón activo.
    }

    // Guardar el estado actual para la navegación y el cambio de idioma
    // Guardamos el origen para saber a dónde volver
    currentTipInfo = { titleKey: titleKey, tipId: tipId, origin: origin };
    
    // 1. CAMBIAR TÍTULO
    const translations = (currentLang === 'es') ? ES : EN;
    const tipsTitle = document.getElementById('tips-title');
    if (tipsTitle) {
        // Establece el título con el texto traducido del botón pulsado
        tipsTitle.innerText = translations[titleKey] || translations['titulo_info'];
    }

    // 2. Ocultar menú
    document.getElementById('tips-menu').style.display = 'none';
    
    // 3. Mostrar botón volver
    document.getElementById('back-to-tips-menu').style.display = 'flex';

    // 4. Mostrar sección
    const sections = document.querySelectorAll('#tips-main .sub-section');
    sections.forEach(s => s.style.display = 'none'); 
    const target = document.getElementById(targetId);
    if(target) target.style.display = 'block';

    // Cargar datos dinámicos si es necesario
    if (tipId === 'emergency') updateInfoTable();
    if (tipId === 'info') updateAddressTable();
    if (tipId === 'hospitals') updateHospitalTable();
}


function backToTipsMenu() {
    // If the origin was 'activities', return there. The 'atalaia' origin is no longer handled here.
    if (currentTipInfo && currentTipInfo.origin === 'activities') {
        showTab('activities');
        return;
    }

    currentTipInfo = { titleKey: null, tipId: null, origin: null };

    // 1. RESETEAR TÍTULO
    const translations = (currentLang === 'es') ? ES : EN;
    const tipsTitle = document.getElementById('tips-title');
    if (tipsTitle) {
        // Vuelve al texto principal "Información Práctica"
        tipsTitle.innerText = translations['titulo_info'];
    }
    
    // 2. Ocultar detalles
    const sections = document.querySelectorAll('#tips-main .sub-section');
    sections.forEach(s => s.style.display = 'none');
    
    // 3. Ocultar botón volver
    document.getElementById('back-to-tips-menu').style.display = 'none';
    
    // 4. Mostrar menú
    document.getElementById('tips-menu').style.display = 'block';
}


// Mostrar la pantalla de tips y asegurarse de que se vea el menú principal.
function resetToTipsMenu() {
    // 1. Mostrar la pantalla principal de 'tips'
    showTab('tips-main');

    // 2. Limpiar cualquier estado de navegación anterior
    currentTipInfo = { titleKey: null, tipId: null, origin: null };

    // 3. Resetear el título al genérico
    const translations = (currentLang === 'es') ? ES : EN;
    const tipsTitle = document.getElementById('tips-title');
    if (tipsTitle) {
        tipsTitle.innerText = translations['titulo_info'];
    }

    // 4. Asegurarse de que el menú de tips es visible y los detalles están ocultos.
    const sections = document.querySelectorAll('#tips-main .sub-section');
    sections.forEach(s => s.style.display = 'none');
    document.getElementById('back-to-tips-menu').style.display = 'none';
    document.getElementById('tips-menu').style.display = 'block';
}

/* --- LÓGICA PANTALLA ACTIVIDADES --- */
function showActivityDetail(activityId) {
    const targetId = 'act-' + activityId;

    // 1. Ocultar el menú de botones de actividades
    document.getElementById('activities-menu').style.display = 'none';

    // 2. Mostrar el contenedor de detalles y el botón de "Atrás"
    document.getElementById('back-to-activities-menu').style.display = 'flex';

    // 3. Ocultar todas las sub-secciones de actividades (para limpiar)
    const sections = document.querySelectorAll('#activities .sub-section');
    sections.forEach(s => s.style.display = 'none');

    // 4. Mostrar la sub-sección de la actividad correcta
    const target = document.getElementById(targetId);
    if(target) target.style.display = 'block';

    window.scrollTo(0, 0);
}

function backToActivitiesMenu() {
    // 1. Ocultar todas las sub-secciones de actividades
    const sections = document.querySelectorAll('#activities .sub-section');
    sections.forEach(s => s.style.display = 'none');

    // 2. Ocultar el botón de "Atrás"
    document.getElementById('back-to-activities-menu').style.display = 'none';

    // 3. Mostrar el menú de botones de actividades
    document.getElementById('activities-menu').style.display = 'block';
}


/* --- IDIOMA --- */
function toggleLanguage() {
    currentLang = (currentLang === 'es') ? 'en' : 'es';
    document.getElementById('lang-btn').innerText = (currentLang === 'es') ? 'EN 🇬🇧' : 'ES 🇪🇸';
    updateText();
}

function updateText() {
    const translations = (currentLang === 'es') ? ES : EN;
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (key in translations) {
            if (el.tagName === 'IMG' && key !== 'lavadora_img') {
                el.src = translations[key];
            } else if (key !== 'lavadora_img') {
                el.innerText = translations[key];
            }
        }
    });

    // RE-APLICAR TÍTULO ESPECÍFICO DE TIPS SI ES NECESARIO
    if (currentTipInfo.titleKey) {
        const tipsTitle = document.getElementById('tips-title');
        if (tipsTitle) tipsTitle.innerText = translations[currentTipInfo.titleKey];
    }

    // Actualizar contenidos dinámicos si están visibles
    updateWasherGrid();
    updateInfoTable();
    updateAddressTable();
    updateHospitalTable();
    updateOwnerContactTable();
    updateApartmentAddressTable();
    updatePintxosTable();
    updateBasqueTable();
    updateMichelinTable();
    updateTxuletaTable();
    updateCiderHouseTable();

    // Si una pantalla de actividad está abierta, refrescar su contenido
    // No es necesario hacer nada aquí, ya que el contenido de las actividades se actualiza con el resto del texto.
}

/* --- TABLAS Y DATOS (Igual que antes, adaptado selectores) --- */
function updateInfoTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('info-table');
    if (!table) return;
    table.innerHTML = '';
    
    const data = [
        ['🚨', 'tel_emergencias', '112'], 
        ['🚑', 'tel_ambulancia', '061'], 
        ['🚓', 'tel_ertzaintza', '088'], 
        ['🚔', 'tel_municipal', '092'], 
        ['🔥', 'tel_bomberos', '080'],

    ];
    
    data.forEach(item => {
        let row = table.insertRow();
        row.innerHTML = `<td class="tel-col-icon">${item[0]}</td>
                         <td>${translations[item[1]] || item[1]}</td>
                         <td class="tel-col-number"><a href="tel:${item[2]}">${item[2]}</a></td>`;
    });
}

function updateAddressTable() {
    // Lógica idéntica a tu original, asegurando que apunta a 'address-table'
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('address-table');
    if (!table) return;
    table.innerHTML = '';

    const addressData = [
        ['🚌', 'addr_bus', 'addr_bus_desc', 'addr_bus_tel', 'Federico García Lorca Pasealekua, 1, 20012 Donostia'], 
        ['🚉', 'addr_train', 'addr_train_desc', 'addr_train_tel', 'Frantzia Pasealekua, 22, 20012 Donostia / San Sebastián, Gipuzkoa'],
        ['🚉', 'addr_train2', 'addr_train2_desc', 'addr_train2_tel', 'Easo Plaza, 9, 20006 Donostia / San Sebastián, Gipuzkoa'],
        ['🚕', 'addr_taxi', 'addr_taxi_desc', 'addr_taxi_tel', 'Kolon Pasealekua, 16-20, 20002 Donostia']
    ];
    
    populateMapTable(table, addressData, 'google-map-embed', '#map-container h3', translations);
}

function updateHospitalTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('hospital-table');
    if (!table) return;
    table.innerHTML = '';
    
    const hospitalData = [
        ['💊', 'addr_pharmacy', 'addr_pharmacy_desc', 'addr_pharmacy_tel', 'San Frantzisko Kalea, 54, 20002 Donostia'],
        ['💊', 'addr_pharmacy24H', 'addr_pharmacy24H_desc', 'addr_pharmacy24H_tel', 'Idiakez Kalea, 4, 20004 Donostia'],
        ['🏥', 'addr_ambulatorio', 'addr_ambulatorio_desc', 'addr_ambulatorio_tel', 'Nafarroa Hiribidea, 14, 20013 Donostia'],
        ['🏥', 'addr_bengoetxea', 'addr_bengoetxea_desc', 'addr_ambulatorio_tel', 'Bengoetxea Kalea, 4, 20004 Donostia / San Sebastián, Gipuzkoa'],
        ['🏥', 'addr_hospital', 'addr_hospital_desc', 'addr_hospital_tel', 'Begiristain Doktorea Pasealekua, s/n, 20014 Donostia'],
        ['🏥', 'addr_policlinica', 'addr_policlinica_desc', 'addr_policlinica_tel', 'P.º de Miramón, 174, 20014 Donostia / San Sebastián, Gipuzkoa']
    ];

    populateMapTable(table, hospitalData, 'google-map-embed-hospital', '#hospital-map-container h3', translations);
}

function updatePintxosTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('pintxos-table');
    if (!table) return;
    table.innerHTML = ''; // Clear existing table content

    const pintxosData = translations.pintxos_list || [];

    if (pintxosData.length > 0) {
        // Create table body
        const tbody = table.createTBody();
        pintxosData.forEach(pintxo => {
            const row = tbody.insertRow();
            row.onclick = function() { showMap('google-map-embed-pintxos', '#pintxos-map-container h3', pintxo.map, pintxo.name, this); };

            const neibCell = row.insertCell();
            const nameCell = row.insertCell();
            const recCell = row.insertCell();

            neibCell.innerHTML = `<span style="font-size: 1rem;">${pintxo.neib}</span>`;
            nameCell.innerHTML = `<b>${pintxo.name}</b>`;
            
            const recommendation = (currentLang === 'es') ? pintxo.recomendacion : pintxo.recommendation;
            recCell.innerHTML = `<small style="color:#666">${recommendation || ''}</small>`;
        });

        // Load the first one on the map
        if (tbody.rows.length > 0) {
            const firstRow = tbody.rows[0];
            showMap('google-map-embed-pintxos', '#pintxos-map-container h3', pintxosData[0].map, pintxosData[0].name, firstRow);
        }
    } else {
        console.error("Pintxos table or data not found!");
    }
}

// Función helper para no repetir código de tablas
// AÑADIMOS EL PARÁMETRO 'clickedRow' a la función showMap
function populateMapTable(table, dataSet, iframeId, titleSelector, translations) {
    dataSet.forEach(data => {
        const [icon, nameKey, descKey, telKey, mapQuery] = data;
        const name = translations[nameKey] || nameKey;
        const desc = translations[descKey] || descKey;
        const tel = telKey ? (translations[telKey] || '') : '';
        
        const row = table.insertRow();
        // USAMOS 'this' para pasar la referencia de la fila al manejador de eventos
        row.onclick = function() { showMap(iframeId, titleSelector, mapQuery, name, this); };

        // Para la tabla de pintxos, no queremos la clase de ancho fijo 'tel-col-icon' en la primera celda.
        const firstCellClass = (table.id === 'pintxos-table') ? '' : 'class="tel-col-icon"';

        row.innerHTML = `<td ${firstCellClass}>${icon}</td>
                         <td>
                            <b>${name}</b><br>
                            <small style="color:#666">${desc}</small><br>
                            <small><a href="tel:${tel.replace(/\s/g,'')}">${tel}</a></small>
                         </td>`;
    });
    
    // Cargar el primero por defecto y darle la clase 'active'
    if (dataSet.length > 0) {
        const firstRow = table.rows[0];
        showMap(iframeId, titleSelector, dataSet[0][4], translations[dataSet[0][1]], firstRow);
    }
}

// MODIFICADA: Acepta 'clickedRow' como nuevo parámetro
function showMap(iframeId, titleSelector, query, name, clickedRow) {
    const iframe = document.getElementById(iframeId);
    
    // Aseguramos la URL del mapa
if (iframe) {
        // La URL mantiene el formato original de tu aplicación, solo se corrige la sintaxis.
        iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
    }

    // --- LÓGICA PARA RESALTAR LA FILA ---
    // 1. Determinar qué tabla estamos usando
    let tableId;
    switch (iframeId) {
        case 'google-map-embed':         tableId = 'address-table'; break;
        case 'google-map-embed-hospital':tableId = 'hospital-table'; break;
        case 'google-map-embed-pintxos': tableId = 'pintxos-table'; break;
        case 'google-map-embed-basque':  tableId = 'basque-table'; break;
        case 'google-map-embed-michelin': tableId = 'michelin-table'; break;
        case 'google-map-embed-txuleta': tableId = 'txuleta-table'; break;
        case 'google-map-embed-cider_house': tableId = 'cider_house-table'; break;
        default:
            // If no specific table is matched, we can't update rows.
            return;
    }
    
    // 2. Desactivar todas las filas activas en esa tabla
    const allRows = document.querySelectorAll(`#${tableId} tr`);
    allRows.forEach(row => row.classList.remove('address-row-active'));

    // 3. Activar la fila pulsada (o la primera si es la carga inicial)
    if (clickedRow) {
        clickedRow.classList.add('address-row-active');
    } else {
        // Fallback for initial load if clickedRow isn't passed but we have a table
        const table = document.getElementById(tableId);
        if (table && table.rows.length > 0) {
            // This assumes the first data row is at index 0 of the tbody,
            // or index 0 of the table if there's no thead.
            table.rows[0].classList.add('address-row-active');
        }
    }
    // ------------------------------------------

    const translations = (currentLang === 'es') ? ES : EN;
    const newTitle = translations.map_title_for_restaurant + name;

    // Update the map title (h3)
    const mapTitle = document.querySelector(titleSelector);
    if (mapTitle) {
        mapTitle.innerText = newTitle;
    }
}

/* --- IMAGENES Y MODAL (LAVADORA) --- */
function updateWasherGrid() {
    const translations = (currentLang === 'es') ? ES : EN;
    const grid = document.getElementById('washer-grid');
    if (!grid || !translations.lavadora_img) return;

    currentImagePaths = translations.lavadora_img;
    grid.innerHTML = '';

    currentImagePaths.forEach((path, idx) => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `<img src="${path}" onclick="openModal(${idx})">`;
        grid.appendChild(div);
    });
}

function setupModal() {
    const modal = document.getElementById("myModal");
    if(!modal) return;
    
    modal.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
    modal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) changeImage(1);
        if (touchEndX > touchStartX + 50) changeImage(-1);
    }, {passive: true});
}

function openModal(index) {
    currentImageIndex = index;
    document.getElementById("myModal").style.display = "flex";
    document.getElementById("img01").src = currentImagePaths[currentImageIndex];
}
function closeModal() { document.getElementById("myModal").style.display = "none"; }
function changeImage(dir) {
    currentImageIndex = (currentImageIndex + dir + currentImagePaths.length) % currentImagePaths.length;
    document.getElementById("img01").src = currentImagePaths[currentImageIndex];
}

function updateOwnerContactTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('owner-contact-table');
    if (!table) return;
    table.innerHTML = '';
    
    const data = [
        ['🧔🏻', 'owner_name_igor', 'owner_tel_igor'], 
        ['👩🏻', 'owner_name_leti', 'owner_tel_leti'], 
    ];
    
    // Usamos el mismo formato de fila que la tabla de emergencias.
    data.forEach(item => {
        const telNumber = translations[item[2]] ? translations[item[2]].replace(/\s/g, '') : '';
        
        let row = table.insertRow();
        row.innerHTML = `<td class="tel-col-icon">${item[0]}</td>
                         <td>${translations[item[1]] || item[1]}</td>
                         <td class="tel-col-number"><a href="tel:${telNumber}">${translations[item[2]] || item[2]}</a></td>`;
    });
}

function updateApartmentAddressTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('apartment-address-table');
    if (!table) return;
    
    table.innerHTML = ''; // Limpiar la tabla antes de rellenar
    
    // Recuperar las claves de traducción
    const name = translations['addr_piso_name'] || 'Atalaia Terrace';
    const addressDisplay = (translations['addr_piso_desc'] || '').replace(/\n/g, '<br>');
    const gmapsQuery = translations['addr_piso_gmaps'];

    // Insertar la fila
    let row = table.insertRow();
    
    // Construir la URL de Google Maps si la clave existe
    if (gmapsQuery) {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gmapsQuery)}`;
        row.onclick = () => window.open(mapUrl, '_blank');
        row.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable
    }

    // Aplicamos el formato de la tabla de direcciones: una celda para el texto y una celda para el ícono/flecha.
    // Usamos el color de texto gris que usan las tablas de direcciones/hospitales.
    row.innerHTML = `<td class="pin-icon">🏠</td>
                     <td><b>${name}</b><br><small style="color:#666">${addressDisplay}</small></td>`;
}

function showRestaurantCategory(category) {
    if (category === 'basque') {
        showTab('basque-screen', 'restaurants');
        updateBasqueTable();
    } else if (category === 'michelin') {
        showTab('michelin-screen', 'restaurants');
        updateMichelinTable();
    } else if (category === 'txuleta') {
        showTab('txuleta-screen', 'restaurants');
        updateTxuletaTable();
    } else if (category === 'cider_house') {
        showTab('cider_house-screen', 'restaurants');
        updateCiderHouseTable();
    }
}

function updateBasqueTable() {
    // Use the global 'currentLang' and get the correct translation object
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('basque-table');
    if (!table) {
        return;
    }
    table.innerHTML = '';

    const basqueRestaurants = translations.basque_restaurants || [];

    // Create body
    const tbody = table.createTBody();
    basqueRestaurants.forEach(item => {
        const row = tbody.insertRow();
        row.onclick = function() { showMap('google-map-embed-basque', '#basque-map-container h3', item.map, item.name, this); };

        const neibCell = row.insertCell();
        const detailsCell = row.insertCell();
        const priceCell = row.insertCell();

        neibCell.innerHTML = `<span style="font-size: 1rem;">${item.neib || ''}</span>`;
        priceCell.textContent = item.price || '';

        const telLink = item.tel ? `<br><small><a href="tel:${item.tel.replace(/\s/g, '')}">${item.tel}</a></small>` : '';
        detailsCell.innerHTML = `<b>${item.name}</b><br>
                                 <small style="color:#666">${item.address}</small>
                                 ${telLink}`;
    });

    // Load the first restaurant on the map by default
    if (basqueRestaurants.length > 0) {
        const firstRow = tbody.rows[0];
        showMap('google-map-embed-basque', '#basque-map-container h3', basqueRestaurants[0].map, basqueRestaurants[0].name, firstRow);
    }
}

function updateMichelinTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('michelin-table');
    if (!table) return;
    table.innerHTML = '';

    const restaurants = translations.michelin_restaurants || [];

    const tbody = table.createTBody();
    restaurants.forEach(item => {
        const row = tbody.insertRow();
        row.onclick = function() {
            // Call showMap to update the map and highlight the row
            showMap('google-map-embed-michelin', '#michelin-map-container h3', item.map, item.name, this);

            // Also, update the main screen header
            const michelinHeader = document.querySelector('#michelin-screen .header-row h3');
            if (michelinHeader) {
                michelinHeader.textContent = item.name;
            }
        };

        // Create cells for the restaurant details and price
        const detailsCell = row.insertCell();
        const priceCell = row.insertCell();

        // Set the content for the right column (Stars)
        priceCell.innerHTML = item.stars ? `<span style="font-size: 1.2rem;">${item.stars} ⭐</span>` : '';
        priceCell.style.textAlign = 'center';

        // Build the HTML for the main details cell: Name, Neib, Phone
        const telLink = item.tel ? `<br><small><a href="tel:${item.tel.replace(/\s/g, '')}">${item.tel}</a></small>` : '';
        detailsCell.innerHTML = `<b>${item.name}</b><br>
                                 <small style="color:#666">${item.neib}</small>
                                 ${telLink}`;
    });

    // Load the map for the first restaurant in the list by default
    if (restaurants.length > 0) {
        const firstRow = tbody.rows[0];
        showMap('google-map-embed-michelin', '#michelin-map-container h3', restaurants[0].map, restaurants[0].name, firstRow);
    }
}

function updateTxuletaTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('txuleta-table');
    if (!table) return;
    table.innerHTML = '';

    const restaurants = translations.txuleta_restaurants || [];

    const tbody = table.createTBody();
    restaurants.forEach(item => {
        const row = tbody.insertRow();
        row.onclick = function() {
            // Update the map and highlight the row
            showMap('google-map-embed-txuleta', '#txuleta-map-container h3', item.map, item.name, this);

            // Update the main screen header with the restaurant name
            const txuletaHeader = document.querySelector('#txuleta-screen .header-row h3');
            if (txuletaHeader) {
                txuletaHeader.textContent = item.name;
            }
        };

        const neibCell = row.insertCell();
        const detailsCell = row.insertCell();
        const priceCell = row.insertCell();

        neibCell.innerHTML = `<span style="font-size: 1rem;">${item.neib || ''}</span>`;
        priceCell.textContent = item.price || '';

        const telLink = item.tel ? `<br><small><a href="tel:${item.tel.replace(/\s/g, '')}">${item.tel}</a></small>` : '';
        detailsCell.innerHTML = `<b>${item.name}</b><br>
                                 <small style="color:#666">${item.address}</small>
                                 ${telLink}`;
    });

    if (restaurants.length > 0) {
        const firstRow = tbody.rows[0];
        showMap('google-map-embed-txuleta', '#txuleta-map-container h3', restaurants[0].map, restaurants[0].name, firstRow);
    }
}

function updateCiderHouseTable() {
    const translations = (currentLang === 'es') ? ES : EN;
    const table = document.getElementById('cider_house-table');
    if (!table) return;
    table.innerHTML = '';

    const restaurants = translations.cider_house_restaurants || [];
    const tbody = table.createTBody();

    restaurants.forEach(item => {
        const row = tbody.insertRow();
        row.onclick = function() {
            showMap('google-map-embed-cider_house', '#cider_house-map-container h3', item.map, item.name, this);
            const mapTitle = document.querySelector('#cider_house-map-container h3');
            if (mapTitle) mapTitle.innerText = "Location of " + item.name;
        };

        const detailsCell = row.insertCell();
        const priceCell = row.insertCell();

        const telLink = item.tel ? `<br><small><a href="tel:${item.tel.replace(/\s/g, '')}">${item.tel}</a></small>` : '';
        detailsCell.innerHTML = `<b>${item.name}</b><br>
                                 <small style="color:#666">${item.neib}</small>
                                 ${telLink}`;
        
        priceCell.textContent = item.price || '';
    });

    if (restaurants.length > 0) {
        const firstRow = tbody.rows[0];
        showMap('google-map-embed-cider_house', '#cider_house-map-container h3', restaurants[0].map, restaurants[0].name, firstRow);
        const mapTitle = document.querySelector('#cider_house-map-container h3');
        if (mapTitle) mapTitle.innerText = "Location of " + restaurants[0].name;
    }
}
