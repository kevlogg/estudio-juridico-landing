/* ==========================================================================
   ESTUDIO JURÍDICO - DRA. ELENA VALENZUELA
   Lógica Interactivas, Animaciones de Scroll, Modal y Formulario
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de Iconos Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. ANIMACIONES DE ENTRADA AL SCROLL (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animación de entrada única
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 2. NAVBAR STICKY & CAMBIO DE CONTEXTO AL SCROLL
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-sm', 'border-b', 'border-slate-200/80');
    } else {
      header.classList.remove('shadow-sm', 'border-b', 'border-slate-200/80');
    }
  });

  // 3. MENÚ NAVEGACIÓN MÓVIL (HAMBURGER DRAWER)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenuDrawer.classList.remove('translate-x-full');
    mobileMenuOverlay.classList.remove('hidden');
    mobileMenuOverlay.classList.add('block');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuDrawer.classList.add('translate-x-full');
    mobileMenuOverlay.classList.classList ? mobileMenuOverlay.classList.add('hidden') : null;
    mobileMenuOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }
  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  }
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // 4. MODAL DE AGENDAMIENTO DE CONSULTA
  const modalOverlay = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('close-modal-btn');
  const openModalBtns = document.querySelectorAll('.btn-open-modal');
  const modalForm = document.getElementById('modal-booking-form');

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });

  // 5. FILTRADO INTERACTIVO DE ÁREAS DE PRÁCTICA (TAB SELECTION)
  const areaTabs = document.querySelectorAll('.area-tab');
  const practiceCards = document.querySelectorAll('.practice-card');

  areaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      // Actualizar estilo activo del tab
      areaTabs.forEach(t => {
        t.classList.remove('bg-slate-900', 'text-white');
        t.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      tab.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      tab.classList.add('bg-slate-900', 'text-white');

      // Filtrar tarjetas con transición suave
      practiceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 6. PROCESAMIENTO DE FORMULARIOS & INTEGRACIÓN DE WHATSAPP DIRECTO
  const mainContactForm = document.getElementById('main-contact-form');
  const toastNotification = document.getElementById('toast-notification');

  function showToast(message, type = 'success') {
    if (!toastNotification) return;
    const toastMsg = document.getElementById('toast-message');
    if (toastMsg) toastMsg.textContent = message;

    toastNotification.classList.remove('hidden', 'translate-y-10', 'opacity-0');
    toastNotification.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toastNotification.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toastNotification.classList.add('hidden'), 300);
    }, 4500);
  }

  function handleFormSubmit(formElement, isModal = false) {
    if (!formElement) return;

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = formElement.querySelector('[name="fullName"]');
      const emailInput = formElement.querySelector('[name="email"]');
      const phoneInput = formElement.querySelector('[name="phone"]');
      const categorySelect = formElement.querySelector('[name="category"]');
      const messageInput = formElement.querySelector('[name="message"]');

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        alert('Por favor, complete al menos su Nombre completo y Teléfono de contacto.');
        return;
      }

      // Generar mensaje para WhatsApp
      const lawyerNumber = '5491123456789'; // Número oficial configurable
      const area = categorySelect ? categorySelect.value : 'Consulta General';
      const text = `Hola Dra. Elena Valenzuela, mi nombre es *${nameInput.value.trim()}*.\n\nRequiero asistencia legal referente a: *${area}*.\n\nTeléfono de contacto: ${phoneInput.value.trim()}\nEmail: ${emailInput ? emailInput.value.trim() : 'N/A'}\n\nDetalle de la consulta: ${messageInput ? messageInput.value.trim() : 'Solicitud de agendamiento directo.'}`;

      const whatsappUrl = `https://wa.me/${lawyerNumber}?text=${encodeURIComponent(text)}`;

      if (isModal) closeModal();
      formElement.reset();

      showToast('¡Mensaje procesado con éxito! Redirigiendo a WhatsApp para agendar...');
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1200);
    });
  }

  handleFormSubmit(mainContactForm, false);
  handleFormSubmit(modalForm, true);

  // 7. BOTÓN VOLVER ARRIBA (BACK TO TOP)
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
