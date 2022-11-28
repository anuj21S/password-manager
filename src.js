var sections = ['home', 'new', 'search', 'loginPage'];
var loginstatus = 0;
function viewSection(name){
    if (loginstatus!=1){return;}
    for(i = 0; i < sections.length; i++){
        document.getElementById(sections[i]).style.display='none';
    }
    document.getElementById(name).style.display='block';
}
function loginCheck(){
    if (document.getElementById('loguser').value != "Anuj Singhal"){
        document.getElementById('loguser').value = "";
        document.getElementById('logpass').value = "";
        return;
    }
    if (document.getElementById('logpass').value != "open2104"){
        document.getElementById('loguser').value = "";
        document.getElementById('logpass').value = "";
        return;
    }
    loginstatus = 1;
    document.getElementById("loginPage").style.display="none";
    document.getElementById('loguser').value = "";
    document.getElementById('logpass').value = "";
    viewSection('home');
    loadLocalData();
    createSearch();
}
function logoutUser(){
    viewSection("loginPage");
    loginstatus = 0;
}
const encryptWithAES = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
};
const decryptWithAES = (ciphertext, key) => {
    let bytes = CryptoJS.AES.decrypt(ciphertext, key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};
function savePassword(){
    let x = {topic:"", category:"", savedOn:"",info:""};
    let y = document.getElementById("addname").value;
    if (y == "" || y == null){
        alert("Can't save password without name. Please enter a name.");
        return;
    }
    x.topic = y;
    y = document.getElementById("addcategory").value;
    if (y == "" || y == null){
        y = 'Other';
    }
    x.category = y;
    y = new Date().toLocaleDateString();
    x.savedOn = y;
    let z = document.getElementById("addkey").value;
    if (z == "" || z == null){
        alert("Can't save without encryption key, highly insecure and thus against our rules.");
        return;
    }
    y = document.getElementById("addTable").innerHTML;
    x.info = encryptWithAES(y,z);
    try {
        y = localStorage.getItem("database");
    } catch (error) {
        y = "";
    }
    if(y == "" || y == null){
        y = "[" + JSON.stringify(x) + "]";
    }else{
        y = y.substring(0, y.length - 1) + ",\n" + JSON.stringify(x) + "]";
    }
    localStorage.setItem("database", y);
    alert("Password saved successfully. Login to view it.");
    document.getElementById("addname").value = "";
    document.getElementById("addcategory").value = "Other";
    document.getElementById("addkey").value = "";
    document.getElementById("addTable").innerHTML = '<tr><th contenteditable="false">Field</th><th contenteditable="false">Value</th></tr><tr><td>&ZeroWidthSpace;</td><td>&ZeroWidthSpace;</td></tr>';
    return;
}
var loadedData = [];
function loadLocalData(){
    let localData = localStorage.getItem("database");
    if (localData != null){
        localData = JSON.parse(localData);
        loadedData = basedata.concat(localData);
    }else{
        loadedData = basedata;
    }
    return;
}
function downloadData(){
    var element = document.createElement('a');
    let text = "var basedata = " + JSON.stringify(loadedData) + ";";
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "data.js");
    element.style.display = 'none';
    document.body.appendChild(element);    
    element.click();
    document.body.removeChild(element); 
    return;   
}
var sid = 0;
function createSearch(){
    let text = "<tr><th>Name</th><th>Category</th><th>Saved On</th></tr>";
    for (let i = 0; i < loadedData.length; i++){
        text += "<tr onclick='searchpsd(" + i + ")' class='DataRow'><td>" + loadedData[i].topic + "</td><td>" + loadedData[i].category + "</td><td>" + loadedData[i].savedOn + "</td></tr>";
    }
    document.getElementById("savedPswd").innerHTML = text;
}
function searchpsd(x){
    document.getElementById("searchedpsd").style.display = 'block';
    document.getElementById("SavedContainer").style.display = 'none';
    sid = x;
    document.getElementById("sname").innerHTML = loadedData[sid].topic;
    document.getElementById("scategory").innerHTML = loadedData[sid].category;
    document.getElementById("sdate").innerHTML = loadedData[sid].savedOn;    
    document.getElementById("sTable").innerHTML = "";    
}
var failedattempts = 0;
function decryptPassword(){
    let key = document.getElementById("deckey").value;
    if (key == "" || key == null){
        return;
    }
    try{
        let text = decryptWithAES(loadedData[sid].info, key);
        document.getElementById("sTable").innerHTML = text;    
        failedattempts = 0;
    }catch(error){
        alert("INVALID KEY. Try again.");
        failedattempts++;
    }
    if (failedattempts > 3){
        logoutUser();
        alert("Logged Out! You entered an invalid key for more than 3 times.");
    }
    return;
}
function closeSearch(){
    document.getElementById('searchedpsd').style.display='none';
    document.getElementById('SavedContainer').style.display='block';
    document.getElementById("deckey").value = "";
}