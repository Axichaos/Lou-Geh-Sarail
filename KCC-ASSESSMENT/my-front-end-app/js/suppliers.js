var editmode = false;
var editid;
//Clear table
function clearTable() {
    var productbody = document.querySelector("#supplier-list");
    productbody.innerHTML = "";
}

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

//Get Table Data then add to table
async function getTableData() {
    clearTable();
    const api_url = 'http://localhost:2090/supplier/show'
    const response = await fetch(api_url);
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const sid = data[i].supplierid;
        const sname = data[i].suppliername;
        const list = document.querySelector("#supplier-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sid}</td>
            <td>${sname}</td>
            <td>
            <a class="btn btn-warning btn-sm edit">Edit</a>
            <a class="btn btn-danger btn-sm delete">Delete</a>
        `;
        list.append(row);
    }
}

//Validation
function validation() {
    var isvalid = true;
    var sname = document.querySelector("#supplier-name").value;
    if(sname == "") {
        showAlert("Please fill in the fields!","danger");
        isvalid = false;
    }
    return isvalid;
}

//Clear fields
function clearFields() {
    document.querySelector("#supplier-name").value = "";
}
//Insert supplier
async function addSupplier(data = {}) {
    const insert_url = 'http://localhost:2090/supplier/insert';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
//Edit Supplier
document.querySelector("#supplier-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("edit")) {
        selectedRow = target.parentElement.parentElement;
        editid = selectedRow.children[0].textContent;
        const text = selectedRow.children[1].textContent
        editmode = true;
        document.querySelector("#supplier-name").value = text;
    }
})

//Update supplier 
async function updateSupplier(data = {}) {
    const update_url = 'http://localhost:2090/supplier/update';
    const response = await fetch(update_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Submit click
function onSubmit() {
    var sname = document.querySelector("#supplier-name").value
    if(editmode) {
        if(validation()) {
            updateSupplier({"suppliername":sname,"supplierid":editid}).then(() => {
                clearFields();
                showAlert("Supplier edited!","success")
                editmode = false;
                getTableData();
            })
        }
    }
    else {
        if(validation()) {
            addSupplier({"suppliername":sname}).then(() => {
                clearFields();
                showAlert("Supplier added!","success")
                getTableData();
            })
        }
    }
}

//Delete from database
async function deleteSuppliers(data = {}) {
    const delete_url = 'http://localhost:2090/supplier/delete';
    const response = await fetch(delete_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Delete supplier
document.querySelector("#supplier-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("delete")) {
        selectedRow = target.parentElement.parentElement;
        const delid = selectedRow.children[0].textContent;
        if(window.confirm("Are you sure you want to delete this supplier?")) {
            deleteSuppliers({"supplierid":delid}).then(() => {
                getTableData();
                showAlert("Supplier deleted!","success");
            })
        }
        
    }
})