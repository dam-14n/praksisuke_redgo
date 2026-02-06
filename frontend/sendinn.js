document.getElementById("sendBtn").addEventListener("click", () => {
 
  const data = {
    gjenstand: getChecked(".gjenstand input[type='checkbox']"),
    kjoretoy: getChecked(".kjøretøy input[type='checkbox']"),
    dyr: getChecked(".dyr input[type='checkbox']")
  };
 
  sendData("gjenstand", data.gjenstand);
  sendData("kjoretoy", data.kjoretoy);
  sendData("dyr", data.dyr);
});
 
function getChecked(selector) {
  return [...document.querySelectorAll(selector)]
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}
 
function sendData(type, items) {
 
  if (items.length === 0) return;
 
  fetch(`http://localhost/api/items/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      selected: items
    })
  })
  .then(res => res.json())
  .then(data => console.log(type, "sent:", data))
  .catch(err => console.error("Error:", err));
}