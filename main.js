

const items = [
    {
        id: 0,
        titulo: "Remera Blanca",
        precio: 100,
        cantidad: 4,
    },
    {
        id: 1,
        titulo: "Remera Verde",
        precio: 100,
        cantidad: 20,
    },
    {
        id: 2,
        titulo: "Remera mangas de color",
        precio: 150,
        cantidad: 80,
    },
];

const methods = {
    find: (id) => {
        return items.find((item) => item.id === id);
    },
    remove: (itemsToRemove) => {
        itemsToRemove.forEach((itemToRemove) => {
            const product = methods.find(itemToRemove.id);
            product.cantidad = product.cantidad - itemToRemove.cantidad;
        });

        console.log({ items, methods });
    },
};

const db = { items, methods };


const comprasCarrito = {
    items: [],
    methods: {
        add: (id, cantidad) => {
            const cartItem = comprasCarrito.methods.get(id);
            if (cartItem) {
                if (comprasCarrito.methods.hasInventory(id, cantidad + cartItem.cantidad)) {
                    cartItem.cantidad++;
                } else {
                    alert("Está agotado");
                }
            } else {
                comprasCarrito.items.push({ id, cantidad });
            }
        },

        remove: (id, cantidad) => {
            const cartItem = comprasCarrito.methods.get(id);

            if (cartItem.cantidad - 1 > 0) {
                cartItem.cantidad--;
            } else {
                comprasCarrito.items = comprasCarrito.items.filter(
                    (item) => item.id !== id
                );
            }
        },
        count: () => {
            return comprasCarrito.items.reduce((acc, item) => acc + item.cantidad, 0);
        },
        get: (id) => {
            const index = comprasCarrito.items.findIndex((item) => item.id === id);
            return index >= 0 ? comprasCarrito.items[index] : null;
        },
        getTotal: () => {
            let total = 0;
            comprasCarrito.items.forEach((item) => {
                const found = db.methods.find(item.id);
                total += found.precio * item.cantidad;
            });

            return total;
        },
        hasInventory: (id, cantidad) => {
            return db.items.find((item) => item.id === id).cantidad - cantidad >= 0;
        },
        purchase: () => {
            db.methods.remove(comprasCarrito.items);
        },
    },
};

renderAlmacen();

function renderAlmacen() {
    const html = db.items.map((item) => {
        return `
            <div class="item">
                <div class="titulo">${item.titulo}</div>
                <div class="precio">${numberToCurrency(item.precio)}</div>
                <div class="cantidad">${item.cantidad} unidades</div>
                <div class="actions"><button class="add" data-id="${item.id}">Añadir al carrito de compras</button></div>
            </div>`;
    });

    document.querySelector("#almacen-container").innerHTML = html.join("");

    document.querySelectorAll(".item .actions .add").forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = parseInt(button.getAttribute("data-id"));
            const item = db.methods.find(id);

            if (item && item.cantidad - 1 > 0) {
                comprasCarrito.methods.add(id, 1);
                console.log(db, comprasCarrito);
                rendercomprasCarrito();
            } else {
                w
                alert("Ya no hay existencia de ese producto");
            }
        });
    });
}

function rendercomprasCarrito() {
    const html = comprasCarrito.items.map((item) => {
        const dbItem = db.methods.find(item.id);
        return `
                <div class="item">
                    <div class="titulo">${dbItem.titulo}</div>
                    <div class="precio">${numberToCurrency(dbItem.precio)}</div>
                    <div class="cantidad">${item.cantidad} unidades</div>
                    <div class="subtotal">Subtotal: ${numberToCurrency(
            item.cantidad * dbItem.precio
        )}</div>
                    <div class="actions">
                        <button class="addOne" data-id="${dbItem.id}">+</button>
                        <button class="removeOne" data-id="${dbItem.id}">-</button>
                    </div>
                </div>
            `;
    });
    const closeButton = `
        <div class="cart-header">
        <button id="bClose">Cerrar</button>
        </div>`;
    const purchaseButton =
        comprasCarrito.items.length > 0
            ? `<div class="cart-actions">
        <button id="bPurchase">Terminar compra</button>
    </div>`
            : "";
    const total = comprasCarrito.methods.getTotal();
    const totalDiv = `<div class="total">Total: ${numberToCurrency(total)}</div>`;
    document.querySelector("#compras-carrito-container").innerHTML =
        closeButton + html.join("") + totalDiv + purchaseButton;

    document.querySelector("#compras-carrito-container").classList.remove("hide");
    document.querySelector("#compras-carrito-container").classList.add("show");

    document.querySelectorAll(".addOne").forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = parseInt(button.getAttribute("data-id"));
            comprasCarrito.methods.add(id, 1);
            rendercomprasCarrito();
        });
    });

    document.querySelectorAll(".removeOne").forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = parseInt(button.getAttribute("data-id"));
            comprasCarrito.methods.remove(id, 1);
            rendercomprasCarrito();
        });
    });

    document.querySelector("#bClose").addEventListener("click", (e) => {
        document.querySelector("#compras-carrito-container").classList.remove("show");
        document.querySelector("#compras-carrito-container").classList.add("hide");
    });
    const bPurchase = document.querySelector("#bPurchase");
    if (bPurchase) {
        bPurchase.addEventListener("click", (e) => {
            comprasCarrito.methods.purchase();
        });
    }
}

function numberToCurrency(n) {
    return new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 2,
        style: "currency",
        currency: "USD",
    }).format(n);
}

//formulario

const formulario = document.getElementById("formulario");
const tusCompras = document.getElementById("compras");
const comprasContainer = document.getElementById("comprasContainer");  

const compras = [];

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");

    if (
        String(nombre.value).trim() === "" ||
        String(email.value).trim() === ""
    ) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const compra = {  
        nombre: nombre.value,
        email: email.value,
    };

    compras.push(compra);  
    const comprasElement = generarCompra(compra);  -
    comprasContainer.appendChild(comprasElement);

    formulario.reset();
});

function generarCompra(compra) { 
    const div = document.createElement("div");

    div.innerHTML = `
    <h3>${compra.nombre}</h3>
    <p>${compra.email}</p>
    `;

    div.className = "card";

    return div;
}
