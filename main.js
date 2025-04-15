document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('pizza-container');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const goToCartButton = document.getElementById('go-to-cart');

  let allPizzas = [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const API_URL = "https://run.mocky.io/v3/8679de6d-ced1-4ef9-a8db-a781b8b08448";

  // Pizzalarni yuklash
  fetch("https://run.mocky.io/v3/8679de6d-ced1-4ef9-a8db-a781b8b08448")
    .then(res => res.json())
    .then(data => {
      allPizzas = data.pizzas;
      renderPizzas(allPizzas);
      updateCart(); // localStorage'dan qayta yuklash
    })
    .catch(err => console.log("Xatolik: ", err));

  // Pizzalarni chiqarish
  function renderPizzas(pizzas) {
    container.innerHTML = '';
    pizzas.forEach(pizza => {
      const pizzaCard = document.createElement('div');
      pizzaCard.className = 'pizza-card';
      pizzaCard.innerHTML = `
        <img src="${pizza.imageUrl}" alt="${pizza.title}" width="200" />
        <h3>${pizza.title}</h3>
        <p>от ${pizza.price} ₽</p>
        <div class="types">
          ${pizza.types.map(type => `<button>${type}</button>`).join('')}
        </div>
        <div class="sizes">
          ${pizza.sizes.map(size => `<button>${size} см.</button>`).join('')}
        </div>
        <button class="add-btn" data-id="${pizza.id}" data-price="${pizza.price}" data-title="${pizza.title}">+ Добавить</button>
      `;
      container.appendChild(pizzaCard);
    });

    // Har bir "+" tugmasi uchun hodisa
    document.querySelectorAll('.add-btn').forEach(button => {
      button.addEventListener('click', addToCart);
    });
  }

  // Savatga qo‘shish
  function addToCart(event) {
    const pizzaId = event.target.getAttribute('data-id');
    const pizzaPrice = parseInt(event.target.getAttribute('data-price'));
    const pizzaTitle = event.target.getAttribute('data-title');

    const index = cart.findIndex(item => item.id === pizzaId);
    if (index === -1) {
      cart.push({ id: pizzaId, price: pizzaPrice, title: pizzaTitle, quantity: 1 });
    } else {
      cart[index].quantity += 1;
    }

    updateCart();
  }

  // Savatni yangilash
  function updateCart() {
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      count += item.quantity;
    });

    cartTotal.innerText = `${total} ₽`;
    cartCount.innerText = `${count} 🛒`;

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Filtrlash
  document.querySelectorAll('.filters button').forEach(button => {
    button.addEventListener('click', (e) => {
      const category = e.target.textContent.toLowerCase();
      let filteredPizzas = allPizzas;

      if (category !== "все") {
        filteredPizzas = allPizzas.filter(pizza => {
          if (category === "мясные" && pizza.category === 0) return true;
          if (category === "вегетарианская" && pizza.category === 1) return true;
          if (category === "гриль" && pizza.category === 2) return true;
          if (category === "острые" && pizza.category === 3) return true;
          if (category === "закрытые" && pizza.category === 4) return true;
          return false;
        });
      }

      renderPizzas(filteredPizzas);

      document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Tartiblash
  document.querySelector('.sort select').addEventListener('change', (e) => {
    const sortOption = e.target.value;
    let sortedPizzas = [...allPizzas];

    if (sortOption === "по цене") {
      sortedPizzas.sort((a, b) => a.price - b.price);
    } else if (sortOption === "по алфавиту") {
      sortedPizzas.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderPizzas(sortedPizzas);
  });

  // Savat sahifasiga o'tish
  goToCartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
});
