let products = [];
let customers = [];
let selectedProducts = [];
let selectedCustomer = null;

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;

    if (name && price) {
        products.push({ name, price });
        updateProductTable();
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';

        // Show the product table wrapper
        document.getElementById('productTableWrapper').style.display = 'block';
    }
}

function updateProductTable() {
    const tableBody = document.getElementById('productTable').querySelector('tbody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                <button onclick="orderProduct(${index})">Order</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Hide the product table wrapper if there are no products
    if (products.length === 0) {
        document.getElementById('productTableWrapper').style.display = 'none';
    }
}

function orderProduct(index) {
    const product = products[index];
    const existingProduct = selectedProducts.find(p => p.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        selectedProducts.push({ ...product, quantity: 1 });
    }

    updateSummaryTable();
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

        // Show the customer section
        document.getElementById('customerSection').style.display = 'block';
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

function toggleCustomerDropdown() {
    const dropdown = document.getElementById('customerDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectCustomer() {
    const customerList = document.getElementById('customerList');
    const selectedIndex = customerList.value;
    if (selectedIndex) {
        selectedCustomer = customers[selectedIndex];
    } else {
        selectedCustomer = null;
    }
    
    // Show the summary section when a customer is selected
    if (selectedCustomer) {
        document.getElementById('summarySection').style.display = 'block';
        updateSummaryTable();
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
            <td>${product.price}</td>
            <td><input type="number" value="${product.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" class="quantity-input"></td>
            <td>${totalPrice}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalAmount').textContent = `TOTAL AMOUNT OF PURCHASE : ₹${totalAmount}/-`;
}

function updateQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1; // Set quantity to 1 if it's NaN or less than 1
    }

    selectedProducts[index].quantity = newQuantity;
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
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${totalPrice}</td>
        `;
        invoiceTableBody.appendChild(row);
    });

    invoiceTotalAmount.textContent = `TOTAL AMOUNT OF PURCHASE : ₹${totalAmount}/-`;

    invoiceSection.style.display = 'block';
}

function printInvoice() {
    const invoiceSection = document.getElementById('invoiceSection');

    // Show the invoice section
    invoiceSection.style.display = 'block';

    // Print the invoice
    window.print();

    // Hide the invoice section after printing (optional)
    invoiceSection.style.display = 'none';
}
