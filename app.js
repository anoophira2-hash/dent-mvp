
const scriptURL = "https://script.google.com/macros/s/AKfycbzbSOZmtaY-SnGnC4Iixf3B8nf01pnLenBU2cWY2uo3hFDlbVBYrS9c0G6k-X2Eeg2pQA/exec";

/* =========================================
   CORE FETCH WRAPPER (IMPORTANT)
========================================= */
async function postData(payload){

  try{

    const res = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const text = await res.text();

    return JSON.parse(text);

  } catch(err){

    console.error("API ERROR:", err);

    return {
      success:false,
      error:err.toString()
    };
  }
}

/* =========================================
   REGISTER CANDIDATE
========================================= */
async function registerCandidate(data){

  return await postData({
    action:"registerCandidate",
    ...data
  });
}

/* =========================================
   REGISTER BUSINESS
========================================= */
async function registerBusiness(data){

  return await postData({
    action:"registerBusiness",
    ...data
  });
}

/* =========================================
   LOGIN
========================================= */
async function login(email, password){

  return await postData({
    action:"login",
    email,
    password
  });
}

/* =========================================
   SET PASSWORD
========================================= */
async function setPassword(email, password){

  return await postData({
    action:"setPassword",
    email,
    password
  });
}

/* =========================================
   GET PROFESSIONS (DROPDOWN)
========================================= */
async function getProfessions(){

  try{

    const res = await fetch(
      scriptURL + "?action=getProfessions"
    );

    return await res.json();

  } catch(err){

    console.error(err);

    return [];
  }
}

/* =========================================
   GET BUSINESS TYPES
========================================= */
async function getBusinessTypes(){

  try{

    const res = await fetch(
      scriptURL + "?action=getBusinessTypes"
    );

    return await res.json();

  } catch(err){

    console.error(err);

    return [];
  }
}

/* =========================================
   UTILITY: POPULATE DROPDOWN
========================================= */
function populateDropdown(elementId, items, key){

  const el = document.getElementById(elementId);

  if(!el) return;

  el.innerHTML = "";

  items.forEach(item => {

    const option = document.createElement("option");

    option.value = item[key];

    option.textContent = item[key];

    el.appendChild(option);
  });
}

/* =========================================
   UTILITY: SHOW SUCCESS MESSAGE
========================================= */
function showSuccess(message){

  alert(message || "Success!");
}

/* =========================================
   UTILITY: SHOW ERROR MESSAGE
========================================= */
function showError(message){

  alert(message || "Something went wrong");
}
