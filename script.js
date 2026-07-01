// ============================================
// LapTech - Laptop Sales Management System
// Main JavaScript File
// ============================================

// Sample Data
let salesData = [
    { id: 1, customer: 'Ali Khan', model: 'Dell XPS 13', qty: 1, price: 125000, date: new Date().toLocaleDateString() }
];

let purchaseData = [
    { id: 1, vendor: 'Hafeez Center Wholesaler', model: 'Dell XPS 13', qty: 5, price: 500000, date: new Date().toLocaleDateString() },
    { id: 2, vendor: 'Techno City Distributor', model: 'HP EliteBook 840', qty: 10, price: 800000, date: new Date().toLocaleDateString() }
];

// ============================================
// DATA MANAGEMENT FUNCTIONS
// ============================================

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('laptopSalesData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            salesData = data.sales || salesData;
            purchaseData = data.purchase || purchaseData;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('laptopSalesData', JSON.stringify({ sales: salesData, purchase: purchaseData }));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// ============================================
// INVOICE FUNCTIONS
// ============================================

// Generate and Show Invoice
function showInvoice(sale) {
    const invoiceHTML = generateInvoiceHTML(sale);
    
    // Create invoice modal
    let modal = document.getElementById('invoiceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'invoiceModal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                    <h2 class="text-2xl font-bold"><i class="fa-solid fa-file-invoice mr-2"></i>Sale Invoice</h2>
                    <button onclick="document.getElementById('invoiceModal').innerHTML = ''" class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                <div id="invoiceContent" class="p-8">
                    ${invoiceHTML}
                </div>
                <div class="bg-gray-100 p-6 flex flex-wrap gap-4 justify-end rounded-b-2xl">
                    <button onclick="document.getElementById('invoiceModal').innerHTML = ''" class="bg-gray-400 hover:bg-gray-500 text-white font-bold px-6 py-2.5 rounded-lg transition">Close</button>
                    <button onclick="deleteSale(${sale.id})" class="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition">Delete Invoice</button>
                    <button onclick="printInvoice('${sale.id}')" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg text-white font-bold px-6 py-2.5 rounded-lg transition transform hover:scale-105">
                        <i class="fa-solid fa-print mr-2"></i>Print Invoice
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate Invoice HTML
function generateInvoiceHTML(sale) {
    const invoiceNo = 'INV-' + String(sale.id).padStart(5, '0');
    const invoiceDate = sale.date || new Date().toLocaleDateString();
    const subtotal = sale.price;
    const tax = Math.round(subtotal * 0.17); // 17% tax
    const total = subtotal + tax;
    
    return `
        <div class="font-sans">
            <!-- Header -->
            <div class="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                            <i class="fa-solid fa-laptop"></i>
                        </div>
                        <div>
                            <h1 class="text-3xl font-black text-gray-800">LapTech</h1>
                            <p class="text-xs text-cyan-600 font-bold">Laptop Sales & Service</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">📍 Islamabad, Pakistan</p>
                    <p class="text-sm text-gray-600">📧 sales@laptech.com</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold text-gray-700 mb-1">Invoice Number</p>
                    <p class="text-2xl font-black text-cyan-600 mb-4">${invoiceNo}</p>
                    <p class="text-xs text-gray-600 mb-1">Date</p>
                    <p class="text-sm font-semibold text-gray-800">${invoiceDate}</p>
                </div>
            </div>
            
            <!-- Customer Details -->
            <div class="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p class="text-lg font-bold text-gray-800">${sale.customer}</p>
                        <p class="text-sm text-gray-600 mt-2">Customer Sale Invoice</p>
                    </div>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Details</p>
                    <div class="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                        <p class="text-sm text-gray-700"><span class="font-bold">Order ID:</span> ${invoiceNo}</p>
                        <p class="text-sm text-gray-700 mt-1"><span class="font-bold">Order Date:</span> ${invoiceDate}</p>
                        <p class="text-sm text-gray-700 mt-1"><span class="font-bold">Status:</span> <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">PAID</span></p>
                    </div>
                </div>
            </div>
            
            <!-- Items Table -->
            <div class="mb-8">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                            <th class="px-4 py-3 text-left text-sm font-bold">Item Description</th>
                            <th class="px-4 py-3 text-center text-sm font-bold">Qty</th>
                            <th class="px-4 py-3 text-right text-sm font-bold">Unit Price</th>
                            <th class="px-4 py-3 text-right text-sm font-bold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="px-4 py-4">
                                <p class="font-bold text-gray-800">${sale.model}</p>
                                <p class="text-xs text-gray-600">Premium Laptop</p>
                            </td>
                            <td class="px-4 py-4 text-center font-bold text-gray-800">${sale.qty}</td>
                            <td class="px-4 py-4 text-right font-bold text-gray-800">Rs. ${(sale.price / sale.qty).toLocaleString()}</td>
                            <td class="px-4 py-4 text-right font-bold text-gray-800">Rs. ${sale.price.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Totals Section -->
            <div class="flex justify-end mb-8">
                <div class="w-80">
                    <div class="flex justify-between py-3 border-b border-gray-300">
                        <span class="text-gray-700 font-semibold">Subtotal:</span>
                        <span class="text-gray-800 font-bold">Rs. ${subtotal.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between py-3 border-b border-gray-300">
                        <span class="text-gray-700 font-semibold">Tax (17%):</span>
                        <span class="text-gray-800 font-bold">Rs. ${tax.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 rounded-lg">
                        <span class="font-bold text-lg">Total Amount:</span>
                        <span class="font-black text-xl">Rs. ${total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="border-t-2 border-gray-300 pt-6 text-center text-xs text-gray-600">
                <p class="font-semibold text-gray-800 mb-2">Thank you for your purchase!</p>
                <p>This invoice is computer generated and valid without signature.</p>
                <p class="mt-2 text-cyan-600 font-bold">📞 Support: 0300-1234567</p>
            </div>
        </div>
    `;
}

// Print Invoice
function printInvoice(saleId) {
    const sale = salesData.find(s => s.id == saleId);
    if (!sale) return;
    
    const printWindow = window.open('', '_blank');
    const invoiceHTML = generateInvoiceHTML(sale);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice - ${sale.id}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                @media print {
                    body { margin: 0; padding: 20px; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body class="bg-white p-8">
            <div class="max-w-2xl mx-auto">
                ${invoiceHTML}
            </div>
            <div class="text-center mt-8 no-print">
                <button onclick="window.print()" class="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold">Print</button>
                <button onclick="window.close()" class="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold ml-4">Close</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

// Calculate Stock & Render Dashboard Data
function renderDashboard() {
    // Calculate Stocks dynamically
    let stockMap = {};
    purchaseData.forEach(p => {
        stockMap[p.model] = (stockMap[p.model] || 0) + p.qty;
    });
    salesData.forEach(s => {
        stockMap[s.model] = (stockMap[s.model] || 0) - s.qty;
    });

    // Render Dashboard Totals
    let totalSales = salesData.reduce((sum, item) => sum + item.price, 0);
    let totalPurchase = purchaseData.reduce((sum, item) => sum + item.price, 0);
    let totalStockUnits = Object.values(stockMap).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0);

    const dashSales = document.getElementById('dash-sales');
    const dashPurchase = document.getElementById('dash-purchase');
    const dashStock = document.getElementById('dash-stock');

    if (dashSales) dashSales.innerText = totalSales.toLocaleString();
    if (dashPurchase) dashPurchase.innerText = totalPurchase.toLocaleString();
    if (dashStock) dashStock.innerText = totalStockUnits;
}

// ============================================
// SALES FUNCTIONS
// ============================================

// Handle Sale Form Submission
function handleSale(event) {
    event.preventDefault();
    
    const customer = document.getElementById('saleCustomer').value;
    const model = document.getElementById('saleModel').value;
    const qty = parseInt(document.getElementById('saleQty').value);
    const price = parseInt(document.getElementById('salePrice').value);

    if (!customer || !model || !qty || !price) {
        alert('Please fill all fields');
        return;
    }

    const saleId = salesData.length > 0 ? Math.max(...salesData.map(s => s.id)) + 1 : 1;
    const saleDate = new Date().toLocaleDateString();
    
    const saleRecord = { id: saleId, customer, model, qty, price, date: saleDate };
    salesData.push(saleRecord);
    saveData();
    document.getElementById('salesForm').reset();
    renderSalesTable();
    
    // Show success and generate invoice
    setTimeout(() => {
        showInvoice(saleRecord);
    }, 300);
}

// Render Sales Table
function renderSalesTable() {
    const salesTable = document.getElementById('salesTableBody');
    if (!salesTable) return;

    salesTable.innerHTML = salesData.map(s => `
        <tr>
            <td class="py-4 pl-2 font-semibold text-green-400">${s.customer}</td>
            <td class="py-4 text-slate-300">${s.model}</td>
            <td class="py-4 font-mono text-slate-300">${s.qty}</td>
            <td class="py-4 font-bold text-emerald-400">Rs. ${s.price.toLocaleString()}</td>
            <td class="py-4 space-x-2">
                <button onclick="showInvoice(${JSON.stringify(s).replace(/"/g, '&quot;')})" class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition transform hover:scale-105 inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-file-pdf"></i>Invoice
                </button>
                <button onclick="deleteSale(${s.id})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition transform hover:scale-105 inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-trash"></i>Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Delete Sale Record
function deleteSale(saleId) {
    if (!confirm('Are you sure you want to delete this invoice and sale record?')) return;
    salesData = salesData.filter(s => s.id !== saleId);
    saveData();
    renderSalesTable();
    renderDashboard && renderDashboard();
    renderStockTable && renderStockTable();
    const invoiceModal = document.getElementById('invoiceModal');
    if (invoiceModal) invoiceModal.innerHTML = '';
}

// ============================================
// PURCHASE FUNCTIONS
// ============================================

// Handle Purchase Form Submission
function handlePurchase(event) {
    event.preventDefault();
    
    const vendor = document.getElementById('purVendor').value;
    const model = document.getElementById('purModel').value;
    const qty = parseInt(document.getElementById('purQty').value);
    const price = parseInt(document.getElementById('purPrice').value);

    if (!vendor || !model || !qty || !price) {
        alert('Please fill all fields');
        return;
    }

    const purchaseId = purchaseData.length > 0 ? Math.max(...purchaseData.map(p => p.id)) + 1 : 1;
    const purchaseDate = new Date().toLocaleDateString();
    
    purchaseData.push({ id: purchaseId, vendor, model, qty, price, date: purchaseDate });
    saveData();
    document.getElementById('purchaseForm').reset();
    renderPurchaseTable();
}

// Render Purchase Table
function renderPurchaseTable() {
    const purchaseTable = document.getElementById('purchaseTableBody');
    if (!purchaseTable) return;

    purchaseTable.innerHTML = purchaseData.map(p => `
        <tr>
            <td class="py-4 pl-2 font-semibold text-amber-400">${p.vendor}</td>
            <td class="py-4 text-slate-300">${p.model}</td>
            <td class="py-4 font-mono text-slate-300">${p.qty}</td>
            <td class="py-4 font-bold text-orange-400">Rs. ${p.price.toLocaleString()}</td>
            <td class="py-4 text-xs text-slate-500">${p.date || new Date().toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// ============================================
// STOCK FUNCTIONS
// ============================================

// Calculate Stock & Render Stock Table
function renderStockTable() {
    // Calculate Stocks dynamically
    let stockMap = {};
    purchaseData.forEach(p => {
        stockMap[p.model] = (stockMap[p.model] || 0) + p.qty;
    });
    salesData.forEach(s => {
        stockMap[s.model] = (stockMap[s.model] || 0) - s.qty;
    });

    // Render Stock Table
    const stockTable = document.getElementById('stockTableBody');
    if (!stockTable) return;

    stockTable.innerHTML = Object.keys(stockMap).map(model => {
        const qty = stockMap[model];
        const statusBadge = qty > 3 
            ? `<span class="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">In Stock</span>`
            : qty > 0 
            ? `<span class="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">Low Stock</span>`
            : `<span class="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">Out of Stock</span>`;

        return `
            <tr class="hover:bg-indigo-50 transition">
                <td class="py-4 font-semibold text-gray-800">${model}</td>
                <td class="py-4 font-bold ${qty <= 0 ? 'text-red-600 text-lg' : 'text-gray-700'}">${qty} units</td>
                <td class="py-4">${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Render appropriate content based on current page
    const dashSales = document.getElementById('dash-sales');
    const salesForm = document.getElementById('salesForm');
    const purchaseForm = document.getElementById('purchaseForm');
    const stockTable = document.getElementById('stockTableBody');

    if (dashSales) {
        renderDashboard();
    }
    
    if (salesForm) {
        renderSalesTable();
    }
    
    if (purchaseForm) {
        renderPurchaseTable();
    }
    
    if (stockTable) {
        renderStockTable();
    }
});
