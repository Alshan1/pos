let products = [];
let customers = [];
let selectedProducts = [];
let selectedCustomer = null;

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);

    if (name && !isNaN(price)) {
        products.push({ name, price });
        updateProductTable();
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';

        // Show the order section if customers exist, otherwise show customer section
        if (customers.length > 0) {
            hideAllSections();
            document.getElementById('orderSection').style.display = 'block';
        } else {
            hideAllSections();
            document.getElementById('customerSection').style.display = 'block';
        }
    } else {
        alert("Please enter both product name and a valid price.");
    }
}

function updateProductTable() {
    const tableBody = document.getElementById('productTable').querySelector('tbody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
                <button onclick="orderProduct(${index})">Order</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteProduct(index) {
    products.splice(index, 1);
    updateProductTable();
}

function addCustomer() {
    const customerName = document.getElementById('customerName').value;
    if (customerName) {
        customers.push(customerName);
        updateCustomerList();
        document.getElementById('customerName').value = '';

        // Always show the order section after adding a customer
        hideAllSections();
        document.getElementById('orderSection').style.display = 'block';
    } else {
        alert("Please enter a customer name.");
    }
}

function updateCustomerList() {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '<option value="">Select Customer</option>';
    
    customers.forEach((customer, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = customer;
        customerList.appendChild(option);
    });
}

function selectCustomer() {
    const customerList = document.getElementById('customerList');
    const selectedIndex = customerList.value;
    if (selectedIndex) {
        selectedCustomer = customers[selectedIndex];
        document.getElementById('summarySection').style.display = 'block';
        updateSummaryTable();
    } else {
        selectedCustomer = null;
        document.getElementById('summarySection').style.display = 'none';
    }
}

function updateSummaryTable() {
    const tableBody = document.getElementById('summaryTable').querySelector('tbody');
    tableBody.innerHTML = '';

    let totalAmount = 0;

    selectedProducts.forEach((product, index) => {
        const totalPrice = product.price * product.quantity;
        totalAmount += totalPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td><input type="number" value="${product.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" class="quantity-input"></td>
            <td>${totalPrice.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalAmount').textContent = `TOTAL AMOUNT OF PURCHASE : ₹${totalAmount.toFixed(2)}/-`;
}

function updateQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1; // Set quantity to 1 if it's NaN or less than 1
    }

    selectedProducts[index].quantity = newQuantity;
    updateSummaryTable();
}

function orderProduct(index) {
    if (!selectedCustomer) {
        alert("Please select a customer before adding products to the order.");
        return;
    }

    const product = products[index];
    const existingProduct = selectedProducts.find(p => p.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        selectedProducts.push({ ...product, quantity: 1 });
    }

    // Show the order section if not already visible
    if (document.getElementById('orderSection').style.display === 'none') {
        hideAllSections();
        document.getElementById('orderSection').style.display = 'block';
    }

    updateSummaryTable();
}

function completePurchase() {
    if (!selectedCustomer) {
        alert("Please select a customer.");
        return;
    }

    if (selectedProducts.length === 0) {
        alert("Please add products to the purchase.");
        return;
    }

    const invoiceSection = document.getElementById('invoiceSection');
    const invoiceCustomer = document.getElementById('invoiceCustomer');
    const invoiceTableBody = document.getElementById('invoiceTable').querySelector('tbody');
    const invoiceTotalAmount = document.getElementById('invoiceTotalAmount');
    const currentDate = new Date().toLocaleDateString('en-IN'); // Get today's date

    invoiceCustomer.textContent = `Customer: ${selectedCustomer} - Date: ${currentDate}`;
    invoiceTableBody.innerHTML = '';

    let totalAmount = 0;

    selectedProducts.forEach(product => {
        const totalPrice = product.price * product.quantity;
        totalAmount += totalPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${totalPrice.toFixed(2)}</td>
        `;
        invoiceTableBody.appendChild(row);
    });

    invoiceTotalAmount.textContent = `TOTAL AMOUNT OF PURCHASE : ₹${totalAmount.toFixed(2)}/-`;

    // Show the invoice section
    hideAllSections();
    invoiceSection.style.display = 'block';
}

function printInvoice() {
    window.print();
}

function showAddProductSection() {
    hideAllSections();
    document.getElementById('formSection').style.display = 'block';
}

function showAddCustomerSection() {
    hideAllSections();
    document.getElementById('customerSection').style.display = 'block';
}

function hideAllSections() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('customerSection').style.display = 'none';
    document.getElementById('orderSection').style.display = 'none';
    document.getElementById('invoiceSection').style.display = 'none';
}
