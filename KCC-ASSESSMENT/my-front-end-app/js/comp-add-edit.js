var addmode = true;
var editid;
var exemptid = new Array();

//Determine whether windows is used for adding/editing
function findOperationComponent() {
    var operationstring = sessionStorage.getItem("c_operation");
    if(operationstring != "ADD") {
        addmode = false;
        document.querySelector("#operations-title").textContent = "EDIT COMPONENT";
        const {cid,cname,desc} = JSON.parse(sessionStorage.getItem("c_editdets"))
        editid = cid;
        document.querySelector("#component-name").value = cname;
        document.querySelector("#description").value = desc;
        getComponentSuppliers({"componentid":editid}).then(() => getAvailableSuppliers());
    }
    else {
        document.querySelector("#operations-title").textContent= "ADD COMPONENT";
        getAvailableSuppliers();
    }
}

//Fill available suppliers
async function getAvailableSuppliers() {
    const api_url = 'http://localhost:2090/supplier/show'
    const response = await fetch(api_url);
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const sid = data[i].supplierid;
        const sname = data[i].suppliername;
        if(addmode) {
            const list = document.querySelector("#available-suppliers");
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sid}</td>
                <td>${sname}</td>
                <td>
                    <a class="btn btn-success btn-sm addsupp">Add</a>
            `;
            list.append(row);
        }
        else {
            var isduplicate = false;
            for(n = 0; n < exemptid.length; n++) {
                if(sid == exemptid[n]) {
                    isduplicate = true;
                    break;
                }
            }
            if(!isduplicate) {
                const list = document.querySelector("#available-suppliers");
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${sid}</td>
                    <td>${sname}</td>
                    <td>
                        <a class="btn btn-success btn-sm addsupp">Add</a>
                `;
                list.append(row);
            }
        }
    }
}

//Fill suppliers for editing
async function getComponentSuppliers(param = {}) {
    const api_url = 'http://localhost:2090/supplier/showwithcid'
    const response = await fetch(api_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(param)
    });
    const data = await response.json();
    for(i=0; i<data.length; i++) {
        const sid = data[i].supplierid;
        exemptid.push(sid);
        const sname = data[i].suppliername;
        const list = document.querySelector("#component-suppliers");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sid}</td>
            <td>${sname}</td>
            <td>
                <a class="btn btn-danger btn-sm deletesupp">Remove</a>
        `;
        list.append(row);
    }
}

//Go back
function goBack() {
    window.location.href = `./components.html`;
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

//Validation 
function validation() {
    var output = true;
    const sname = document.querySelector("#component-name").value.trim();
    const description = document.querySelector("#description").value.trim();
    if(sname == "" || description == "") {
        showAlert("Please fill in all the fields!","danger");
        output = false;
    }
    return output;
}

//Add supplier to component
document.querySelector("#available-suppliers-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("addsupp")) {
        selectedRow = target.parentElement.parentElement;
        sid = selectedRow.children[0].textContent;
        sname = selectedRow.children[1].textContent;
        const list = document.querySelector("#component-suppliers");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sid}</td>
            <td>${sname}</td>
            <td>
                <a class="btn btn-danger btn-sm deletesupp">Remove</a>
        `;
        selectedRow.remove();
        list.append(row);
    }
})

//Remove supplier from component
document.querySelector("#component-suppliers-table").addEventListener("click",(e) =>{
    target = e.target;
    if(target.classList.contains("deletesupp")) {
        selectedRow = target.parentElement.parentElement;
        sid = selectedRow.children[0].textContent;
        sname = selectedRow.children[1].textContent;
        const list = document.querySelector("#available-suppliers");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sid}</td>
            <td>${sname}</td>
            <td>
                <a class="btn btn-success btn-sm addsupp">Add</a>
        `;
        selectedRow.remove();
        list.append(row);
    }
})

//Add component
async function insertComponent(data = {}) {
    const insert_url = 'http://localhost:2090/component/insert';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Get recent component
async function getRecentComponent() {
    const api_url = 'http://localhost:2090/component/showlast'
    const response = await fetch(api_url);
    const data = await response.json();
    const output = data[0].componentid;
    return output;
}

//Link component to supplier
async function linkComponenttoSupplier(data = {}) {
    const insert_url = 'http://localhost:2090/comptosupp/insert';
    const response = await fetch(insert_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Update component
async function updateComponent(data = {}) {
    const update_url = 'http://localhost:2090/component/update';
    const response = await fetch(update_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

//Delete component links
async function deleteComponentLinks(data = {}) {
    const update_url = 'http://localhost:2090/comptosupp/deletewithcid';
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
function submit() {
    const componentname = document.querySelector("#component-name").value;
    const description = document.querySelector("#description").value;
    if(addmode == true) {
        if(validation()) {
            insertComponent({"name":componentname,"description":description}).then(() => {
                var table = document.getElementsByTagName("tbody")[1].rows;
                getRecentComponent().then(rcid => {
                    if(table.length > 0) {
                        for(i = 0; i < table.length; i++) {
                            var cid = table[i].getElementsByTagName("td")[0];    
                            linkComponenttoSupplier({"componentid":rcid,"supplierid":cid.innerText});
                        }
                    }
                });
                window.alert("Component added!");
                window.location.href = `./components.html`;
            });
        }
    }
    else {
        if(validation()) {
            updateComponent({"name":componentname,"description":description,"componentid":editid}).then(() => {
                deleteComponentLinks({"componentid":editid}).then(() => {
                    var table = document.getElementsByTagName("tbody")[1].rows;
                    if(table.length > 0) {
                        for(i = 0; i < table.length; i++) {
                            var cid = table[i].getElementsByTagName("td")[0];    
                            linkComponenttoSupplier({"componentid":editid,"supplierid":cid.innerText});
                        }
                    }
                    window.alert("Component edited!");
                    window.location.href = `./components.html`;
                });
            })
        }
    }
}