document.getElementById("sendBtn").addEventListener("click", () => {

    // --- GJENSTAND ---
    const gjenstandItems = getChecked(".gjenstand input[type='checkbox']");
    const gjenstandOther = document.getElementById("gjenstandOther").value.trim();
    if (gjenstandOther) gjenstandItems.push(gjenstandOther);

    // --- KJØRETØY ---
    const kjoretoyItems = getChecked(".kjøretøy input[type='checkbox']");
    const kjoretoyOther = document.getElementById("kjoretoyOther").value.trim();
    if (kjoretoyOther) kjoretoyItems.push(kjoretoyOther);

    // --- DYR ---
    const dyrItems = getChecked(".dyr input[type='checkbox']");
    const dyrOther = document.getElementById("dyrOther").value.trim();
    if (dyrOther) dyrItems.push(dyrOther);

    // --- SEND ALL ---
    sendItems("gjenstand", gjenstandItems);
    sendItems("kjoretoy", kjoretoyItems);
    sendItems("dyr", dyrItems);

});

// --- HELPER: get checked boxes ---
function getChecked(selector) {
    return [...document.querySelectorAll(selector)]
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

// --- HELPER: send one item at a time ---
function sendItems(type, items) {
    items.forEach(item => {
        const payload = { name: item }; // <-- simple payload, matches most APIs

        fetch(`http://localhost/api/items/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.text()) 
        .then(data => console.log(type, item, "→", data))
        .catch(err => console.error(type, item, "ERROR:", err));
    });
}
