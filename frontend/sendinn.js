const API_BASE_URL = "http://localhost/api";

let selectedType = null;
const typeButtons = document.querySelectorAll('.type-btn');
const itemForm = document.getElementById('itemForm');
const carFields = document.getElementById('carFields');
const animalFields = document.getElementById('animalFields');

// Type selection
typeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        typeButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Store selected type
        selectedType = this.dataset.type;
        
        // Show form
        itemForm.style.display = 'block';
        
        // Show/hide type-specific fields
        carFields.style.display = selectedType === 'car' ? 'block' : 'none';
        animalFields.style.display = selectedType === 'animal' ? 'block' : 'none';
        
        // Update required fields based on type
        updateRequiredFields();
        
        // Scroll to form
        itemForm.scrollIntoView({ behavior: 'smooth' });
    });
});

// Update required fields based on selected type
function updateRequiredFields() {
    // Car fields
    const carInputs = carFields.querySelectorAll('input, textarea');
    carInputs.forEach(input => {
        input.required = selectedType === 'car';
    });
    
    // Animal fields
    const animalInputs = animalFields.querySelectorAll('input[type="text"], textarea');
    animalInputs.forEach(input => {
        input.required = selectedType === 'animal';
    });
    
    // Radio buttons for sex
    const sexRadios = animalFields.querySelectorAll('input[name="sex"]');
    sexRadios.forEach(radio => {
        radio.required = selectedType === 'animal';
    });
}

// Set default checkin date to now
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById('checkin_date').value = now.toISOString().slice(0, 16);

// Form submission
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
        alert('Vennligst velg en type først');
        return;
    }
    
    // Collect form data
    const formData = new FormData(itemForm);
    const data = {
        checkin_date: new Date(formData.get('checkin_date')).toISOString(),
        ref_number: formData.get('ref_number'),
        contact_person: formData.get('contact_person'),
        storage_location: formData.get('storage_location'),
        description: formData.get('description'),
    };
    
    // Add photo_url if provided
    const photoUrl = formData.get('photo_url');
    if (photoUrl && photoUrl.trim() !== '') {
        data.photo_url = photoUrl;
    }
    
    // Add type-specific fields
    if (selectedType === 'car') {
        data.registration_number = formData.get('registration_number');
        data.make_model = formData.get('make_model');
        data.color = formData.get('color');
        data.condition = formData.get('condition');
    } else if (selectedType === 'animal') {
        data.species = formData.get('species');
        data.sex = formData.get('sex');
        data.markings = formData.get('markings');
        data.special_needs = formData.get('special_needs');
    }
    
    // Validate that all required fields are present
    const requiredFields = ['checkin_date', 'ref_number', 'contact_person', 'storage_location', 'description'];
    const missing = requiredFields.filter(field => !data[field]);
    
    if (missing.length > 0) {
        alert(`Følgende felter mangler: ${missing.join(', ')}`);
        return;
    }
    
    // Type-specific validation
    if (selectedType === 'car') {
        const carRequired = ['registration_number', 'make_model', 'color', 'condition'];
        const carMissing = carRequired.filter(field => !data[field]);
        if (carMissing.length > 0) {
            alert(`Følgende kjøretøyfelter mangler: ${carMissing.join(', ')}`);
            return;
        }
    } else if (selectedType === 'animal') {
        const animalRequired = ['species', 'sex', 'markings', 'special_needs'];
        const animalMissing = animalRequired.filter(field => !data[field]);
        if (animalMissing.length > 0) {
            alert(`Følgende dyrefelter mangler: ${animalMissing.join(', ')}`);
            return;
        }
    }
    
    // Submit to API
    try {
        const response = await fetch(`${API_BASE_URL}/items/${selectedType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        alert('Gjenstand registrert!');
        
        // Reset form and redirect
        itemForm.reset();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
        
    } catch (error) {
        console.error('Error creating item:', error);
        alert(`Feil ved registrering: ${error.message}\n\nVennligst prøv igjen.`);
    }
});

// Add some inline styling for type buttons
const style = document.createElement('style');
style.textContent = `
    .type-selector {
        display: flex;
        gap: 15px;
        margin: 20px 0;
        justify-content: center;
    }
    
    .type-btn {
        padding: 15px 30px;
        font-size: 16px;
        border: 2px solid #ccc;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .type-btn:hover {
        border-color: #4CAF50;
        transform: translateY(-2px);
    }
    
    .type-btn.active {
        background: #4CAF50;
        color: white;
        border-color: #4CAF50;
    }
    
    .form-section {
        margin: 30px 0;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
    }
    
    .form-section h3 {
        margin-top: 0;
        color: #333;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #555;
    }
    
    .form-group input[type="text"],
    .form-group input[type="url"],
    .form-group input[type="datetime-local"],
    .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
    }
    
    .form-group textarea {
        resize: vertical;
        font-family: inherit;
    }
    
    .radio-group {
        display: flex;
        gap: 20px;
        padding: 10px 0;
    }
    
    .radio-group label {
        display: flex;
        align-items: center;
        font-weight: normal;
        cursor: pointer;
    }
    
    .radio-group input[type="radio"] {
        margin-right: 5px;
    }
    
    .form-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
        justify-content: center;
    }
    
    .submit-btn, .cancel-btn {
        padding: 12px 40px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .submit-btn {
        background: #4CAF50;
        color: white;
    }
    
    .submit-btn:hover {
        background: #45a049;
    }
    
    .cancel-btn {
        background: #f44336;
        color: white;
    }
    
    .cancel-btn:hover {
        background: #da190b;
    }
`;
document.head.appendChild(style);
