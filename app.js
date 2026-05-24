
const scriptURL = "https://script.google.com/macros/s/AKfycbzbSOZmtaY-SnGnC4Iixf3B8nf01pnLenBU2cWY2uo3hFDlbVBYrS9c0G6k-X2Eeg2pQA/exec";



let professionsData = [];
let businessTypesData = [];

/* =========================
   LOAD DROPDOWNS
========================= */
async function loadProfessions(){

  const res = await fetch(scriptURL + "?action=getProfessions");
  professionsData = await res.json();

  const el = document.getElementById("profession");
  if(!el) return;

  el.innerHTML = `<option value="">Select Profession</option>`;

  professionsData.forEach((p,i)=>{
    el.innerHTML += `<option value="${i}">${p.profession}</option>`;
  });
}

async function loadBusinessTypes(){

  const res = await fetch(scriptURL + "?action=getBusinessTypes");
  businessTypesData = await res.json();

  const el = document.getElementById("businessType");
  if(!el) return;

  el.innerHTML = `<option value="">Select Business Type</option>`;

  businessTypesData.forEach((b,i)=>{
    el.innerHTML += `<option value="${i}">${b.businessType}</option>`;
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded",()=>{
  loadProfessions();
  loadBusinessTypes();

  document.getElementById("profession")?.addEventListener("change",e=>{
    renderQuestions(e.target.value);
  });
});

/* =========================
   QUESTIONS FIX
========================= */
function renderQuestions(index){

  const container = document.getElementById("dynamicQuestions");
  if(!container) return;

  container.innerHTML = "";

  const p = professionsData[index];
  if(!p) return;

  [p.q1,p.q2,p.q3,p.q4,p.q5,p.q6].forEach((q,i)=>{
    if(q){
      container.innerHTML += `
        <label>${q}</label>
        <input type="text" id="q${i+1}">
        <br><br>
      `;
    }
  });
}

/* =========================
   FILE SYSTEM (ADD ONE BY ONE)
========================= */
function addFileInput(){

  const container = document.getElementById("fileContainer");

  const input = document.createElement("input");
  input.type = "file";
  input.name = "files";

  container.appendChild(input);
  container.appendChild(document.createElement("br"));
}



async function uploadFiles(){

  const inputs = document.querySelectorAll('input[name="files"]');

  let urls = [];

  for(let input of inputs){

    if(!input.files || input.files.length === 0) continue;

    const file = input.files[0];

    const base64 = await new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    const res = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({
        action: "uploadSingleFile",
        file: {
          name: file.name,
          type: file.type,
          data: base64.split(",")[1]
        }
      })
    });

    const result = await res.json();

    if(result.url){
      urls.push(result.url);
    }
  }

  return urls;
}

/* =========================
   CANDIDATE
========================= */
document.getElementById("candidateForm")?.addEventListener("submit", async (e)=>{

  e.preventDefault();

  const fileUrls = await uploadFiles();

  const index = document.getElementById("profession").value;

  const res = await fetch(scriptURL,{
    method:"POST",
    body:JSON.stringify({
      action:"registerCandidate",

      name:document.getElementById("name").value,
      surname:document.getElementById("surname").value,
      email:document.getElementById("email").value,
      phone:document.getElementById("phone").value,
      address:document.getElementById("address").value,
      hourlyRate:document.getElementById("hourlyRate").value,

      profession:professionsData[index]?.profession || "",

      q1:document.getElementById("q1")?.value || "",
      q2:document.getElementById("q2")?.value || "",
      q3:document.getElementById("q3")?.value || "",
      q4:document.getElementById("q4")?.value || "",
      q5:document.getElementById("q5")?.value || "",
      q6:document.getElementById("q6")?.value || "",

      files:fileUrls
    })
  });

  const result = await res.json();

  alert(result.success ? "Submitted" : "Error");

});

/* =========================
   BUSINESS
========================= */
document.getElementById("businessForm")?.addEventListener("submit", async (e)=>{

  e.preventDefault();

  const fileUrls = await uploadFiles();

  const index = document.getElementById("businessType").value;

  const res = await fetch(scriptURL,{
    method:"POST",
    body:JSON.stringify({
      action:"registerBusiness",

      name:document.getElementById("businessFirstName").value,
      surname:document.getElementById("businessSurname").value,
      email:document.getElementById("businessEmail").value,
      phone:document.getElementById("businessPhone").value,
      address:document.getElementById("businessAddress").value,
      businessName:document.getElementById("businessName").value,

      businessType:businessTypesData[index]?.businessType || "",

      files:fileUrls
    })
  });

  const result = await res.json();

  alert(result.success ? "Submitted" : "Error");

});