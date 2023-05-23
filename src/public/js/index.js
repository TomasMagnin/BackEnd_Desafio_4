const socket = io();
const form = document.getElementById('form');
let newProduct ={};
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = form.elements.title.value;
    const description = form.elements.description.value;
    const price = form.elements.price.value;
    const thumbnail = form.elements.thumbnail.value;
    const code = form.elements.code.value;
    const stock = form.elements.stock.value;
    const category = form.elements.category.value;
    const status = form.elements.status.value;
    
    newProduct = {title, description, price, thumbnail, code, stock, category, status};

    // Enviamos este formulario desde el Front
    socket.emit("front a servidor", newProduct);
    form.reset();
});

const deleteForm = document.getElementById('deleteForm');

deleteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = deleteForm.elements.id.value;
  socket.emit('deleteProduct', id);
  deleteForm.reset();
});


// Recivimos del Front
socket.on('updatedProducts', (data) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    productList.innerHTML += `
      ${data.productList.map((product) => `
        <div class="card product__container" style="width: 14rem;">
          <div>
            <img src=${product.thumbnail} class="card-img-top" alt="foto de Product ${product.id}">
          </div>
          <div class="card-body">
            <h3 class="card-title">${product.title}</h3>
            <p class="card-text">${product.description}</p>
            <p class="card-text">${product.price}</p>
          </div>
        </div>
      `).join('')}
    `;
  });