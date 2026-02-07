const API_BASE_URL = "http://localhost/api";

const itemsTable = document.querySelector(".tabell");
const searchInput = document.querySelector('.search_bar input[type="text"]');

// Fetch items from API
async function getItemList(filters) {
    const url = new URL(`${API_BASE_URL}/items`);
    
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                url.searchParams.append(key, value);
            }
        });
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API response:", data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.items)) {
            return data.items;
        } else if (data && Array.isArray(data.data)) {
            return data.data;
        } else if (data && typeof data === 'object') {
            // Handle format like {car: [], animal: [], goods: []}
            const allItems = [];
            for (const type in data) {
                if (Array.isArray(data[type])) {
                    // Add type to each item if not already present
                    data[type].forEach(item => {
                        if (!item.type) {
                            item.type = type;
                        }
                        allItems.push(item);
                    });
                }
            }
            if (allItems.length > 0 || Object.keys(data).some(k => Array.isArray(data[k]))) {
                return allItems;
            }
        }
        
        console.warn("Unexpected API response format:", data);
        return [];
    } catch (error) {
        console.error("Error getting item list:", error);
        return [];
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[date.getMonth()];
    return `${day}. ${month}`;
}

// Get item type in Norwegian
function getItemTypeNorwegian(type) {
    const types = {
        'car': 'Kjøretøy',
        'animal': 'Dyr',
        'goods': 'Gods'
    };
    return types[type] || type;
}

// Get item description
function getItemDescription(item) {
    if (item.type === 'car') {
        return `${item.make_model || ''} - ${item.registration_number || ''}`;
    } else if (item.type === 'animal') {
        return item.species || 'Dyr';
    } else {
        return item.description || 'Gjenstand';
    }
}

// Render items in table
function renderItems(items) {
    console.log("Rendering items:", items);
    
    // Ensure items is an array
    if (!Array.isArray(items)) {
        console.error("Items is not an array:", items);
        items = [];
    }
    
    // Get or create tbody
    let tbody = itemsTable.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        // Find thead or first row
        const thead = itemsTable.querySelector('thead');
        if (thead) {
            thead.after(tbody);
        } else {
            // If no thead, first row is header
            const firstRow = itemsTable.querySelector('tr');
            if (firstRow) {
                const newThead = document.createElement('thead');
                newThead.appendChild(firstRow);
                itemsTable.insertBefore(newThead, itemsTable.firstChild);
                itemsTable.appendChild(tbody);
            }
        }
    }
    
    // Clear existing rows in tbody
    tbody.innerHTML = '';
    
    if (!items || items.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5" style="text-align: center;">Ingen gjenstander funnet</td>';
        tbody.appendChild(emptyRow);
        return;
    }
    
    items.forEach(item => {
        console.log("Rendering item:", item);
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = () => viewItemDetails(item);
        
        const statusText = item.checkout_date ? 'Hentet' : 'Ikke Hentet';
        const statusClass = item.checkout_date ? 'checked-out' : 'not-checked-out';
        
        // Create cells individually to avoid escaping issues
        const typeCell = document.createElement('td');
        typeCell.textContent = getItemTypeNorwegian(item.type);
        
        const descCell = document.createElement('td');
        descCell.textContent = getItemDescription(item);
        
        const locationCell = document.createElement('td');
        locationCell.textContent = item.storage_location || 'Ukjent';
        
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(item.checkin_date);
        
        const statusCell = document.createElement('td');
        statusCell.textContent = statusText;
        statusCell.className = statusClass;
        
        row.appendChild(typeCell);
        row.appendChild(descCell);
        row.appendChild(locationCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        
        tbody.appendChild(row);
    });
}

// View item details in modal
function viewItemDetails(item) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    let detailsHTML = `
        <h2>${getItemTypeNorwegian(item.type)} - Detaljer</h2>
        <p><strong>Referansenummer:</strong> ${item.ref_number}</p>
        <p><strong>Innsjekket:</strong> ${new Date(item.checkin_date).toLocaleString('nb-NO')}</p>
        <p><strong>Kontaktperson:</strong> ${item.contact_person}</p>
        <p><strong>Lagringssted:</strong> ${item.storage_location}</p>
        <p><strong>Beskrivelse:</strong> ${item.description}</p>
    `;
    
    if (item.type === 'car') {
        detailsHTML += `
            <p><strong>Registreringsnummer:</strong> ${item.registration_number}</p>
            <p><strong>Merke/Modell:</strong> ${item.make_model}</p>
            <p><strong>Farge:</strong> ${item.color}</p>
            <p><strong>Tilstand:</strong> ${item.condition}</p>
        `;
    } else if (item.type === 'animal') {
        detailsHTML += `
            <p><strong>Art:</strong> ${item.species}</p>
            <p><strong>Kjønn:</strong> ${item.sex === 'male' ? 'Hankjønn' : item.sex === 'female' ? 'Hunkjønn' : 'Ukjent'}</p>
            <p><strong>Kjennetegn:</strong> ${item.markings}</p>
            <p><strong>Spesielle behov:</strong> ${item.special_needs}</p>
        `;
    }
    
    if (item.photo_url) {
        detailsHTML += `<p><strong>Foto:</strong> <a href="${item.photo_url}" target="_blank">Vis bilde</a></p>`;
    }
    
    if (item.checkout_date) {
        detailsHTML += `
            <hr>
            <p><strong>Status:</strong> Hentet</p>
            <p><strong>Utsjekket:</strong> ${new Date(item.checkout_date).toLocaleString('nb-NO')}</p>
            <p><strong>Hentet av:</strong> ${item.checkout_person}</p>
            ${item.checkout_signature ? `<p><strong>Signatur:</strong> ${item.checkout_signature}</p>` : ''}
            ${item.checkout_comment ? `<p><strong>Kommentar:</strong> ${item.checkout_comment}</p>` : ''}
        `;
    } else {
        detailsHTML += `
            <hr>
            <button id="checkoutBtn" style="
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 10px;
            ">Sjekk ut</button>
        `;
    }
    
    detailsHTML += `
        <button id="closeModalBtn" style="
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
            margin-left: 10px;
        ">Lukk</button>
    `;
    
    modalContent.innerHTML = detailsHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = document.getElementById('closeModalBtn');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    // Checkout button
    if (!item.checkout_date) {
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.onclick = () => showCheckoutForm(item, modal);
    }
}

// Show checkout form
function showCheckoutForm(item, parentModal) {
    parentModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
    `;
    
    modalContent.innerHTML = `
        <h2>Sjekk ut gjenstand</h2>
        <form id="checkoutForm">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Utsjekk dato og tid:</label>
                <input type="datetime-local" id="checkoutDate" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Person som henter:</label>
                <input type="text" id="checkoutPerson" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Signatur:</label>
                <input type="text" id="signature" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Kommentar (valgfritt):</label>
                <textarea id="comment" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>
            <div style="display: flex; gap: 10px;">
                <button type="submit" style="
                    background: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    flex: 1;
                ">Bekreft utsjekk</button>
                <button type="button" id="cancelCheckout" style="
                    background: #f44336;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    flex: 1;
                ">Avbryt</button>
            </div>
        </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Set current date/time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('checkoutDate').value = now.toISOString().slice(0, 16);
    
    // Handle form submission
    document.getElementById('checkoutForm').onsubmit = async (e) => {
        e.preventDefault();
        
        const checkoutData = {
            checkout_date: new Date(document.getElementById('checkoutDate').value).toISOString(),
            checkout_person: document.getElementById('checkoutPerson').value,
            signature: document.getElementById('signature').value,
            comment: document.getElementById('comment').value || undefined
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/items/${item.type}/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkoutData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            alert('Gjenstand sjekket ut!');
            modal.remove();
            loadItems();
        } catch (error) {
            console.error('Error checking out item:', error);
            alert('Feil ved utsjekk. Vennligst prøv igjen.');
        }
    };
    
    // Cancel button
    document.getElementById('cancelCheckout').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Load and display items
async function loadItems(filters) {
    const items = await getItemList(filters);
    renderItems(items);
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tbody = itemsTable.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Initial load
loadItems();