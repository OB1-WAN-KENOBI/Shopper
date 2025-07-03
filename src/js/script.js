let cart = [];

// Для быстрой привязки кнопок "Add"
document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const title = this.getAttribute("data-title");
    const price = parseFloat(this.getAttribute("data-price"));
    let img = null;
    // Пытаемся найти картинку товара (соседний .price или ближайший img)
    let card = this.closest(".seller-card, .deal-card, .featured-actions");
    if (card && card.querySelector("img")) {
      img = card.querySelector("img").getAttribute("src");
    }
    addToCart(title, price, img);
  });
});



function addToCart(title, price, img) {
  const existing = cart.find((item) => item.title === title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title, price, qty: 1, img });
  }
  updateCartDisplay();
  showCartToast();
  animateCartIcon();
}


function removeFromCart(title) {
  cart = cart.filter((item) => item.title !== title);
  updateCartDisplay();
}

function changeQty(title, delta) {
  const item = cart.find((item) => item.title === title);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(title);
  updateCartDisplay();
}

function updateCartDisplay() {
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cart-count").textContent =
    count + (count === 1 ? " item" : " items");
  document.getElementById("cart-total").textContent = "$" + total.toFixed(2);

  // Модалка
  const body = document.getElementById("cart-modal-body");
  if (body) {
    body.innerHTML = "";
    if (cart.length === 0) {
      body.innerHTML =
        "<div style='color:#888;margin:40px 0;text-align:center;'>Cart is empty</div>";
    } else {
      cart.forEach((item) => {
        body.innerHTML += `
        <div class="cart-modal-item">
          <img src="${
            item.img ? item.img : "src/images/Apple wireless Airpod.jpg"
          }" class="cart-modal-item-img" alt="">
          <div class="cart-modal-item-info">
            <div class="cart-modal-item-title">${item.title}</div>
            <div class="cart-modal-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-modal-qty">
              <button class="cart-modal-qty-btn" data-title="${
                item.title
              }" data-delta="-1">-</button>
              <span>${item.qty}</span>
              <button class="cart-modal-qty-btn" data-title="${
                item.title
              }" data-delta="1">+</button>
              <button class="cart-modal-remove-btn" data-title="${
                item.title
              }" title="Remove">&times;</button>
            </div>
          </div>
        </div>
        `;
      });
    }
    document.getElementById("cart-modal-total").textContent =
      "$" + total.toFixed(2);

    // Снова навесить обработчики на появившиеся кнопки
    document.querySelectorAll(".cart-modal-qty-btn").forEach((btn) => {
      btn.onclick = function () {
        changeQty(
          this.getAttribute("data-title"),
          Number(this.getAttribute("data-delta"))
        );
      };
    });
    document.querySelectorAll(".cart-modal-remove-btn").forEach((btn) => {
      btn.onclick = function () {
        removeFromCart(this.getAttribute("data-title"));
      };
    });
  }
}

// Открытие/закрытие корзины
document.querySelector(".cart-btn").addEventListener("click", function (e) {
  document.getElementById("cart-modal").classList.add("open");
});
document.getElementById("cart-modal-close").onclick = function () {
  document.getElementById("cart-modal").classList.remove("open");
};
document.querySelector(".cart-modal-overlay").onclick = function () {
  document.getElementById("cart-modal").classList.remove("open");
};
// (Доп) закрытие по ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document.getElementById("cart-modal").classList.remove("open");
});

// Простой Checkout
document.getElementById("cart-modal-checkout").onclick = function () {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  alert("Thank you for your order!");
  cart = [];
  updateCartDisplay();
  document.getElementById("cart-modal").classList.remove("open");
};

function showCartToast() {
  const toast = document.getElementById("cart-toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1200);
}

function animateCartIcon() {
  const cartBtn = document.querySelector(".cart-btn");
  cartBtn.classList.add("animated");
  setTimeout(() => cartBtn.classList.remove("animated"), 350);
}

function flyToCart(imgElem) {
  if (!imgElem) return;
  const cartBtn = document.querySelector(".cart-btn");
  const imgRect = imgElem.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  // Создаем клон картинки
  const flyImg = imgElem.cloneNode(true);
  flyImg.style.position = "fixed";
  flyImg.style.left = imgRect.left + "px";
  flyImg.style.top = imgRect.top + "px";
  flyImg.style.width = imgRect.width + "px";
  flyImg.style.height = imgRect.height + "px";
  flyImg.style.zIndex = 9999;
  flyImg.style.borderRadius = "50%";
  flyImg.style.transition = "all 0.75s cubic-bezier(.56,1.52,.56,1)";
  flyImg.style.pointerEvents = "none";
  document.body.appendChild(flyImg);

  // Форсируем reflow (хак для перехода)
  flyImg.getBoundingClientRect();

  // Куда лететь (центр иконки корзины)
  const endLeft = cartRect.left + cartRect.width / 2 - imgRect.width / 4;
  const endTop = cartRect.top + cartRect.height / 2 - imgRect.height / 4;

  // Анимируем!
  flyImg.style.left = endLeft + "px";
  flyImg.style.top = endTop + "px";
  flyImg.style.width = "28px";
  flyImg.style.height = "28px";
  flyImg.style.opacity = 0.5;
  flyImg.style.transform = "rotate(-22deg) scale(0.5)";

  // После окончания анимации — удалить картинку
  setTimeout(() => {
    flyImg.remove();
  }, 770);
}

// Открыть модалку товара по клику на карточку
document.querySelectorAll('.seller-card, .deal-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Чтобы не открывать при клике по кнопке "Add"
    if (e.target.closest('.add-btn')) return;

    // Данные товара
    const title = card.querySelector('h3, h4') ? card.querySelector('h3, h4').textContent : "Product";
    const price = card.querySelector('.price') ? card.querySelector('.price').textContent : "";
    const img = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : "";
    const desc = card.querySelector('p') ? card.querySelector('p').textContent : "No description";

    // Заполняем модалку
    document.getElementById('product-modal-title').textContent = title;
    document.getElementById('product-modal-body').innerHTML = `
      <img src="${img}" style="width:140px;height:140px;object-fit:contain;display:block;margin:10px auto 18px;border-radius:16px;background:#f6f6f6;box-shadow:0 1px 6px rgba(20,206,108,0.07);" alt="">
      <div style="font-size:1.15rem;color:#252525;text-align:center;margin-bottom:10px;">${title}</div>
      <div style="color:#666;text-align:center;margin-bottom:16px;font-size:1rem;">${desc}</div>
      <div style="text-align:center;font-weight:bold;font-size:1.2rem;color:#14ce6c;margin-bottom:18px;">${price}</div>
      <button class="add-btn" style="display:block;margin:0 auto;" data-title="${title}" data-price="${parseFloat(price.replace(/[^0-9.]/g, ''))}">Add to cart</button>
    `;
    document.getElementById('product-modal').classList.add('open');

    // Навесить обработчик на новую кнопку "Add" в модалке
    document.querySelector('#product-modal .add-btn').onclick = function() {
      addToCart(
        title,
        parseFloat(price.replace(/[^0-9.]/g, '')),
        img,
        document.querySelector('#product-modal img')
      );
      document.getElementById('product-modal').classList.remove('open');
    };
  });
});

// Закрытие модалки товара
document.getElementById('product-modal-close').onclick = function() {
  document.getElementById('product-modal').classList.remove('open');
};
document.querySelectorAll('#product-modal .cart-modal-overlay').forEach(el => {
  el.onclick = function() {
    document.getElementById('product-modal').classList.remove('open');
  };
});
window.addEventListener('keydown', e => {
  if (e.key === "Escape") document.getElementById('product-modal').classList.remove('open');
});

// Первичная инициализация
updateCartDisplay();
