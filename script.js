// Função para calcular o status do semáforo baseado na data de validade
function getSemaphoreColor(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays > 30) {
        return 'green';
    } else if (diffDays >= 16) {
        return 'yellow';
    } else if (diffDays >= 2) {
        return 'red';
    } else {
        return 'black';
    }
}

// Função para formatar a data (caso precise)
function formatDate(date) {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// Função para salvar os produtos no localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Função para carregar os produtos do localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products;
}

// Função para criar um item na lista de produtos
function createProductItem(product) {
    const li = document.createElement('li');
    const expiryFormatted = formatDate(product.expiry);
    const semaphoreClass = getSemaphoreColor(product.expiry);
    
    li.classList.add(semaphoreClass);
    li.innerHTML = `
        <span><strong>${product.name}</strong> - Validade: ${expiryFormatted} - Quantidade: ${product.quantity} - Setor: ${product.sector}</span>
        <button class="delete-btn" onclick="deleteProduct('${product.name}')">Eliminar</button>
    `;
    return li;
}

// Função para deletar um produto
function deleteProduct(productName) {
    let products = loadProducts();
    products = products.filter(product => product.name !== productName);
    saveProducts(products);
    renderProductList();
}

// Função para renderizar a lista de produtos
function renderProductList() {
    const products = loadProducts();
    products.sort((a, b) => new Date(a.expiry) - new Date(b.expiry)); // Ordenar por validade

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productItem = createProductItem(product);
        productList.appendChild(productItem);
    });
}

// Função para adicionar um produto
document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const expiry = document.getElementById('product-expiry').value;
    const quantity = document.getElementById('product-quantity').value;
    const sector = document.getElementById('product-sector').value;

    const newProduct = { name, expiry, quantity, sector };

    const products = loadProducts();
    products.push(newProduct);
    saveProducts(products);

    document.getElementById('product-form').reset(); // Limpar o formulário
    renderProductList();
});

// Inicializa a lista de produtos
renderProductList();
