var addmode = true;
var editid;
var exemptid = new Array();

//Setup page to be edit or add
function findOperation() {
    var operationstring = sessionStorage.getItem("p_operation");
    if(operationstring != "ADD") {
        addmode = false;
        document.querySelector("#operations-title").textContent = "EDIT PRODUCT";
        const {pid,pname,quant} = JSON.parse(sessionStorage.getItem("p_editdets"))
        editid = pid;
        document.querySelector("#product-name").value = pname;
        document.querySelector("#quantity").value = quant;
        getProductComponents({"productid":editid}).then(() => getAvailableComponents());
    }
    else {
        document.querySelector("#operations-title").textContent= "ADD PRODUCT";
        getAvailableComponents();
    }
}

//Fill product components for edit
async function getProductComponents(param = {}) {
    const api_url = 'http://localhost:2090/component/showwithpid'
    const response = await fetch(api_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(param)
    });
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const cid = data[i].componentid;
        exemptid.push(cid);
        const cname = data[i].name;
        const cdesc = data[i].description;
        const list = document.querySelector("#product-components");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cid}</td>
            <td>${cname}</td>
            <td>${cdesc}</td>
            <td>
                <a class="btn btn-danger btn-sm deletecomp">Remove</a>
        `;
        list.append(row);
    }
}

//Fill component table
async function getAvailableComponents() {
    const api_url = 'http://localhost:2090/component/show'
    const response = await fetch(api_url);
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const cid = data[i].componentid;
        const cname = data[i].name;
        const cdesc = data[i].description;
        if(addmode) {
            const list = document.querySelector("#available-components");
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cid}</td>
                <td>${cname}</td>
                <td>${cdesc}</td>
                <td>
                    <a class="btn btn-success btn-sm addcomp">Add</a>
            `;
            list.append(row);
        }
        else {
            var isduplicate = false;
            for(n = 0; n < exemptid.length; n++) {
                if(cid == exemptid[n]) {
                    isduplicate = true;
                    break;
                }
            }
            if(!isduplicate) {
                const list = document.querySelector("#available-components");
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cid}</td>
                    <td>${cname}</td>
                    <td>${cdesc}</td>
                    <td>
                        <a class="btn btn-success btn-sm addcomp">Add</a>
                `;
                list.append(row);
            }
        }
    }
}

//Add component to product
document.querySelector("#available-components-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("addcomp")) {
        selectedRow = target.parentElement.parentElement;
        cid = selectedRow.children[0].textContent;
        cname = selectedRow.children[1].textContent;
        cdesc = selectedRow.children[2].textContent;
        const list = document.querySelector("#product-components");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cid}</td>
            <td>${cname}</td>
            <td>${cdesc}</td>
            <td>
                <a class="btn btn-danger btn-sm deletecomp">Remove</a>
        `;
        selectedRow.remove();
        list.append(row);
    }
})

//Remove component from product
document.querySelector("#product-components-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("deletecomp")) {
        selectedRow = target.parentElement.parentElement;
        cid = selectedRow.children[0].textContent;
        cname = selectedRow.children[1].textContent;
        cdesc = selectedRow.children[2].textContent;
        const list = document.querySelector("#available-components");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cid}</td>
            <td>${cname}</td>
            <td>${cdesc}</td>
            <td>
                <a class="btn btn-success btn-sm addcomp">Add</a>
        `;
        selectedRow.remove();
        list.append(row);
    }
})

//Show Alerts
function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector("#maincontainer");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);
    setTimeout(() => document.querySelector(".alert").remove(),2000);
}

//Validation
function validation() {
    var output = true;
    const pname = document.querySelector("#product-name").value.trim();
    const quantity = document.querySelector("#quantity").value.trim();
    let isnum = /^\d+$/.test(quantity);
    if(pname == "" || quantity == "") {
        showAlert("Please fill in all the fields!","danger");
        output = false;
    }
    else if(!isnum) {
        showAlert("Quantity field must only be numbers!","danger");
        output = false;
    }
    else if(document.getElementsByTagName("tbody")[1].rows.length <= 0) {
        showAlert("Product must at least have 1 component!","danger");
        output = false;
    }
    return output;
}

//Insert Product
async function insertData(data = {}) {
    const insert_url = 'http://localhost:2090/product/insert';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Get Last ID
async function getRecentID() {
    const api_url = 'http://localhost:2090/product/showlast'
    const response = await fetch(api_url);
    const data = await response.json();
    const output = data[0].productid;
    return output;
}

async function findID(param) {
    param = await getRecentID();
}

//Link components to product
async function linkComponenttoProduct(data = {}) {
    const insert_url = 'http://localhost:2090/prodtocomp/insert';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Update product
async function updateProduct(data = {}) {
    const update_url = 'http://localhost:2090/product/update';
    const response = await fetch(update_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Delete current links
async function deleteProductLinks(data = {}) {
    const update_url = 'http://localhost:2090/prodtocomp/deletewithpid';
    const response = await fetch(update_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}



//Go back
function goBack() {
    window.location.href = `./index.html`;
}

//Submit click 
function submit() {
    const productname = document.querySelector("#product-name").value;
    const quantity = document.querySelector("#quantity").value.trim();
    if(addmode == true) {
        if(validation()) {
            insertData({"productname":productname,"quantity":quantity}).then(() => {
                var table = document.getElementsByTagName("tbody")[1].rows;
                getRecentID().then(rpid => {
                    for(i = 0; i < table.length; i++) {
                        var cid = table[i].getElementsByTagName("td")[0];    
                        linkComponenttoProduct({"productid":rpid,"componentid":cid.innerText});
                    }
                });
                window.alert("Product added!");
                window.location.href = `./index.html`;
            });
        }
    }
    else {
        if(validation()) {
            updateProduct({"productname":productname,"quantity":quantity,"productid":editid}).then(() => {
                deleteProductLinks({"productid":editid}).then(() => {
                    var table = document.getElementsByTagName("tbody")[1].rows;
                    for(i = 0; i < table.length; i++) {
                        var cid = table[i].getElementsByTagName("td")[0];    
                        linkComponenttoProduct({"productid":editid,"componentid":cid.innerText});
                    }
                    window.alert("Product edited!");
                    window.location.href = `./index.html`;
                });
            })
        }
    }
}

