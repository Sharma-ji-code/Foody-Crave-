/* ============================================================
   FOODY CRAVE — Shared JavaScript
   ============================================================ */
(function () {
  'use strict';

  var OWA = '916371471048'; // Owner WhatsApp number

  /* ── ACTIVE NAV LINK ── */
  function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
  setActiveNav();

  /* ── HAMBURGER ── */
  var ham = document.getElementById('ham');
  var navLinks = document.getElementById('navLinks');
  if (ham && navLinks) {
    ham.addEventListener('click', function () {
      ham.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        ham.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── TOAST ── */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  window.showToast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  };

  /* ── CART ── */
  var cart = [];
  var PRICES = {
    'Signature Espresso': 120, 'Hazelnut Latte': 180, 'Dalgona Coffee': 160, 'Masala Chai': 80,
    'Cold Brew': 200, 'Passion Fruit Cooler': 180, 'Mango Lassi': 140, 'Nutella Milkshake': 220,
    'Avocado Toast': 260, 'Veggie Eggs Royale': 280, 'Masala Omelette': 180, 'Pancake Stack': 240,
    'Paneer Tikka': 280, 'Crispy Cauliflower Wings': 280, 'Loaded Nachos': 300, 'Soup of the Day': 160,
    'Paneer Butter Masala': 320, 'Dal Makhani': 280, 'Grilled Paneer Steak': 380, 'Veg Biryani': 320,
    'Margherita Pizza': 320, 'BBQ Veggie Pizza': 360, 'Pasta Arrabbiata': 280, 'Mushroom Alfredo': 320,
    'Chocolate Lava Cake': 240, 'Gulab Jamun Cheesecake': 280, 'Kulfi Falooda': 180, 'Tiramisu': 260
  };

  function updBadge() {
    var n = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    var el = document.getElementById('cartN');
    if (el) el.textContent = n;
  }

  function cartLines() {
    if (!cart.length) return '(No items added from menu)';
    return cart.map(function (i) { return i.name + ' ×' + i.qty + ' = ₹' + (i.price * i.qty); }).join('\n');
  }

  function cartTotal() {
    return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }

  /* Add to cart via .add-btn and .addon-item */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.add-btn')) {
      var mi = e.target.closest('.menu-item');
      var name = mi ? mi.querySelector('.mi-name').textContent.trim() : 'Item';
      var price = PRICES[name] || 100;
      var found = cart.find(function (i) { return i.name === name; });
      if (found) found.qty++;
      else cart.push({ name: name, price: price, qty: 1 });
      updBadge();
      showToast('✅ ' + name + ' added to cart!');
    }
    if (e.target.closest('.addon-item')) {
      var ai = e.target.closest('.addon-item');
      var an = ai.querySelector('.addon-name').textContent.trim();
      var ap = parseInt((ai.querySelector('.addon-price').textContent || '0').replace(/[^0-9]/g, '')) || 0;
      var f2 = cart.find(function (i) { return i.name === an; });
      if (f2) f2.qty++;
      else cart.push({ name: an, price: ap, qty: 1 });
      updBadge();
      showToast('✅ ' + an + ' added!');
    }
    if (e.target.closest('.chip')) {
      showToast('✅ Add-on noted! Mention in order notes.');
    }
  });

  /* Cart FAB */
  var cartFab = document.getElementById('cartFab');
  if (cartFab) {
    cartFab.addEventListener('click', function () {
      if (!cart.length) { showToast('Cart is empty! Add items from the menu.'); return; }
      var n = cart.reduce(function (s, i) { return s + i.qty; }, 0);
      showToast(n + ' item(s) — go to Order page to checkout!');
      setTimeout(function () { window.location.href = 'order.html'; }, 1200);
    });
  }

  /* ── MENU TABS ── */
  document.querySelectorAll('.menu-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var p = this.getAttribute('data-p');
      document.querySelectorAll('.menu-tab').forEach(function (t) { t.classList.remove('on'); });
      document.querySelectorAll('.panel').forEach(function (x) { x.classList.remove('on'); });
      this.classList.add('on');
      var el = document.getElementById(p);
      if (el) el.classList.add('on');
    });
  });

  /* ── DELIVERY TYPE ── */
  document.querySelectorAll('.del-opt').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.del-opt').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });

  function getDeliveryType() {
    var p = document.getElementById('dPickup'), a = document.getElementById('dApp');
    if (p && p.classList.contains('on')) return 'Pickup (Self)';
    if (a && a.classList.contains('on')) return 'Swiggy / Zomato';
    return 'Home Delivery';
  }

  /* ── ORDER CHECKOUT ── */
  var orderBtn = document.getElementById('orderBtn');
  if (orderBtn) {
    orderBtn.addEventListener('click', function () {
      var name  = (document.getElementById('oName').value || '').trim();
      var phone = (document.getElementById('oPhone').value || '').trim();
      var addr  = (document.getElementById('oAddr').value || '').trim();
      var items = (document.getElementById('oItems').value || '').trim();
      var pay   = document.getElementById('oPayment').value || '';
      var promo = (document.getElementById('oPromo').value || '').trim();
      var dtype = getDeliveryType();

      if (!name)  { showToast('⚠️ Please enter your name!'); return; }
      if (!phone) { showToast('⚠️ Please enter your phone number!'); return; }
      if (!items && !cart.length) { showToast('⚠️ Please enter items you want to order!'); return; }
      if (dtype === 'Home Delivery' && !addr) { showToast('⚠️ Please enter your delivery address!'); return; }

      var oid = '#FC' + Date.now().toString().slice(-5);
      var allItems = items || cartLines();
      var total = cartTotal();

      // Fill checkout modal
      document.getElementById('coId').textContent    = oid;
      document.getElementById('coName').textContent  = name;
      document.getElementById('coPhone').textContent = phone;
      document.getElementById('coType').textContent  = dtype;
      document.getElementById('coAddr').textContent  = addr || 'Self Pickup';
      document.getElementById('coPay').textContent   = pay;
      document.getElementById('coItems').textContent = allItems;
      if (total) {
        var te = document.getElementById('coTotal');
        if (te) { te.textContent = '₹' + total; te.parentElement.style.display = 'flex'; }
      }
      var pr = document.getElementById('coPromoRow');
      if (promo && pr) { document.getElementById('coPromo').textContent = promo; pr.style.display = 'flex'; }
      else if (pr) pr.style.display = 'none';

      // Store for WA
      var ov = document.getElementById('coOv');
      ov.dataset.n = name; ov.dataset.ph = phone; ov.dataset.ad = addr;
      ov.dataset.it = allItems; ov.dataset.py = pay; ov.dataset.pr = promo;
      ov.dataset.dt = dtype; ov.dataset.id = oid; ov.dataset.tot = total;

      openOverlay('coOv');
    });
  }

  /* ── BOOKING MODAL ── */
  function openModal(title) {
    document.getElementById('moTitle').textContent = title;
    openOverlay('moOv');
  }
  window.openModal = openModal;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-room');
    if (btn && !btn.classList.contains('off')) {
      var card = btn.closest('.room-card') || btn.closest('.pkg-card');
      if (card) {
        var n = card.querySelector('.room-name') || card.querySelector('.pkg-name');
        openModal('Book — ' + (n ? n.textContent : 'Experience'));
      }
    }
  });

  var moConfirm = document.getElementById('moConfirm');
  if (moConfirm) {
    moConfirm.addEventListener('click', function () {
      var nm = (document.getElementById('moName').value || 'Guest').trim();
      var ph = (document.getElementById('moPhone').value || '').trim();
      var dt = (document.getElementById('moDate') || {}).value || '';
      var oc = (document.getElementById('moOccasion') || {}).value || '';
      var msg = '📅 *BOOKING — FOODY CRAVE*\n👤 ' + nm + '\n📞 ' + ph + '\n📅 Date: ' + dt + '\n🎉 ' + oc + '\n✅ Please confirm!';
      window.open('https://wa.me/' + OWA + '?text=' + encodeURIComponent(msg), '_blank');
      closeOverlay('moOv');
      showToast('Booking sent on WhatsApp! 🎉');
    });
  }

  /* ── RESERVE TABLE ── */
  var reserveBtn = document.getElementById('reserveBtn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', function () {
      var nm = (document.getElementById('tName').value || 'Guest').trim();
      var ph = (document.getElementById('tPhone').value || '').trim();
      var dt = (document.getElementById('tDate') || {}).value || '';
      if (!nm || !ph) { showToast('⚠️ Please fill name and phone!'); return; }
      var msg = '🍽️ *TABLE BOOKING — FOODY CRAVE*\n👤 ' + nm + '\n📞 ' + ph + '\n📅 Date: ' + dt + '\n✅ Please confirm!';
      window.open('https://wa.me/' + OWA + '?text=' + encodeURIComponent(msg), '_blank');
      showToast('Table booking sent on WhatsApp! ✅');
    });
  }

  /* ── CONTACT FORM ── */
  var contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function () {
      showToast('Message sent! 📨 We will reply within 24 hrs.');
    });
  }

  /* ── WHATSAPP ORDER SEND ── */
  var sendWA = document.getElementById('sendWA');
  if (sendWA) {
    sendWA.addEventListener('click', function () {
      var d = document.getElementById('coOv').dataset;
      var msg =
        '🍽️ *NEW ORDER — FOODY CRAVE* 🍽️\n' +
        '━━━━━━━━━━━━━━━\n' +
        '🔖 Order ID: ' + d.id + '\n' +
        '👤 Name: ' + d.n + '\n' +
        '📞 Phone: ' + d.ph + '\n' +
        '🚚 Type: ' + d.dt + '\n' +
        '📍 Address: ' + (d.ad || 'Self Pickup') + '\n' +
        '━━━━━━━━━━━━━━━\n' +
        '🛒 Items:\n' + d.it + '\n' +
        (d.tot > 0 ? '💰 Total: ₹' + d.tot + '\n' : '') +
        '━━━━━━━━━━━━━━━\n' +
        '💳 Payment: ' + d.py + '\n' +
        (d.pr ? '🎟️ Promo: ' + d.pr + '\n' : '') +
        '⏰ Time: ' + new Date().toLocaleString('en-IN') + '\n' +
        '━━━━━━━━━━━━━━━\n' +
        '✅ Please confirm & prepare!';
      window.open('https://wa.me/' + OWA + '?text=' + encodeURIComponent(msg), '_blank');
      closeOverlay('coOv');
      ['oName', 'oPhone', 'oAddr', 'oItems', 'oPromo'].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = '';
      });
      cart = []; updBadge();
      showToast('🎉 Order sent! We will confirm on WhatsApp shortly.');
    });
  }

  /* ── OVERLAY HELPERS ── */
  function openOverlay(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeOverlay(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  }
  window.closeOverlay = closeOverlay;

  /* Close overlays */
  ['coOv', 'moOv'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function (e) { if (e.target === el) closeOverlay(id); });
  });
  document.querySelectorAll('.co-x2,.mo-x').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ov = btn.closest('.co-ov, .mo-ov');
      if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
    });
  });
  var coBack = document.getElementById('coBack');
  if (coBack) coBack.addEventListener('click', function () { closeOverlay('coOv'); });

  /* ── LOCATION CARDS ── */
  document.querySelectorAll('.loc-card').forEach(function (c) {
    c.addEventListener('click', function () {
      document.querySelectorAll('.loc-card').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
    });
  });

  /* ── SCROLL REVEAL ── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── SMOOTH SCROLL (same-page anchors) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 68, behavior: 'smooth' });
      }
    });
  });

})();
