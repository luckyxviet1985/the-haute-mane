/**
 * THE HAUTE MANE — Client-side Application Logic
 * Intuitive navigation, interactive services, lightbox, reviews, and 4-step booking modal
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Sticky Header Scroll Effect
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileDrawer(open) {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    } else {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileDrawer());
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileDrawer(false));
  });

  // --------------------------------------------------------------------------
  // 3. Services Filter Tabs
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const serviceCards = document.querySelectorAll('.service-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Lookbook Lightbox Modal
  // --------------------------------------------------------------------------
  const lookbookItems = document.querySelectorAll('.lookbook-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');

  function openLightbox(item) {
    const imgSrc = item.getAttribute('data-img');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxImg) lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lookbookItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeBookingModal();
    }
  });

  // --------------------------------------------------------------------------
  // 5. Client Reviews Testimonial Carousel
  // --------------------------------------------------------------------------
  const reviewSlides = document.querySelectorAll('.review-slide');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  let currentReviewIndex = 0;
  let carouselInterval;

  function showSlide(index) {
    reviewSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentReviewIndex = index;
  }

  function nextSlide() {
    const next = (currentReviewIndex + 1) % reviewSlides.length;
    showSlide(next);
  }

  carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      resetCarouselTimer();
    });
  });

  function startCarouselTimer() {
    carouselInterval = setInterval(nextSlide, 6000);
  }

  function resetCarouselTimer() {
    clearInterval(carouselInterval);
    startCarouselTimer();
  }

  if (reviewSlides.length > 0) {
    startCarouselTimer();
  }

  // --------------------------------------------------------------------------
  // 6. Interactive 4-Step Booking Modal
  // --------------------------------------------------------------------------
  const bookingModal = document.getElementById('bookingModal');
  const bookingBackdrop = document.getElementById('bookingBackdrop');
  const modalClose = document.getElementById('modalClose');

  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepPanels = document.querySelectorAll('.modal-step-panel');
  const stepPrevBtn = document.getElementById('stepPrevBtn');
  const stepNextBtn = document.getElementById('stepNextBtn');
  const bookingDateInput = document.getElementById('bookingDate');
  const bookingSummaryBox = document.getElementById('bookingSummaryBox');

  // Trigger buttons
  const bookButtons = [
    document.getElementById('headerBookBtn'),
    document.getElementById('mobileBookBtn'),
    document.getElementById('heroBookBtn'),
    document.getElementById('aboutBookBtn'),
    document.getElementById('footerBookBtn')
  ];

  // Set minimum date to today
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  let currentStep = 1;

  function openBookingModal(preselectedService = null) {
    if (preselectedService) {
      const targetRadio = document.querySelector(`input[name="modalServiceRadio"][value="${preselectedService}"]`);
      if (targetRadio) targetRadio.checked = true;
    }
    setStep(1);
    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    toggleMobileDrawer(false);
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  bookButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => openBookingModal());
    }
  });

  // Direct "Book This Service" triggers from service cards
  document.querySelectorAll('.service-book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = e.currentTarget.getAttribute('data-service');
      openBookingModal(serviceName);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeBookingModal);
  if (bookingBackdrop) bookingBackdrop.addEventListener('click', closeBookingModal);

  function setStep(step) {
    currentStep = step;

    // Update indicator visuals
    stepIndicators.forEach(indicator => {
      const s = parseInt(indicator.getAttribute('data-step'), 10);
      indicator.classList.toggle('active', s <= step);
    });

    // Update panels
    stepPanels.forEach((panel, i) => {
      panel.classList.toggle('active', (i + 1) === step);
    });

    // Update Footer Buttons
    if (step === 1) {
      stepPrevBtn.style.display = 'none';
      stepNextBtn.textContent = 'Continue to Stylist';
    } else if (step === 2) {
      stepPrevBtn.style.display = 'inline-flex';
      stepNextBtn.textContent = 'Continue to Date & Time';
    } else if (step === 3) {
      stepPrevBtn.style.display = 'inline-flex';
      stepNextBtn.textContent = 'Review & Details';
    } else if (step === 4) {
      stepPrevBtn.style.display = 'inline-flex';
      stepNextBtn.textContent = 'Confirm Appointment';
      updateBookingSummary();
    }
  }

  function updateBookingSummary() {
    const selectedService = document.querySelector('input[name="modalServiceRadio"]:checked')?.value || 'Signature Blonding';
    const selectedStylist = document.querySelector('input[name="modalStylistRadio"]:checked')?.value || 'First Available Master Stylist';
    const selectedDate = bookingDateInput?.value || 'Selected Date';
    const selectedTime = document.querySelector('input[name="modalTimeSlot"]:checked')?.value || 'Morning Slot';

    if (bookingSummaryBox) {
      bookingSummaryBox.innerHTML = `
        <div style="margin-bottom: 0.5rem;"><strong>Selected Ritual:</strong> ${selectedService}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Stylist:</strong> ${selectedStylist}</div>
        <div><strong>Date & Window:</strong> ${selectedDate} · ${selectedTime}</div>
      `;
    }
  }

  if (stepPrevBtn) {
    stepPrevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        setStep(currentStep - 1);
      }
    });
  }

  if (stepNextBtn) {
    stepNextBtn.addEventListener('click', () => {
      if (currentStep < 4) {
        setStep(currentStep + 1);
      } else {
        // Validation on Step 4
        const firstName = document.getElementById('guestFirstName')?.value.trim();
        const lastName = document.getElementById('guestLastName')?.value.trim();
        const email = document.getElementById('guestEmail')?.value.trim();
        const phone = document.getElementById('guestPhone')?.value.trim();

        if (!firstName || !lastName || !email || !phone) {
          showToast('Please complete all required contact fields.', 'error');
          return;
        }

        // Complete Booking
        closeBookingModal();
        showToast(`Thank you, ${firstName}! Your reservation request has been received. Our concierge will text you shortly to confirm.`);
        
        // Reset form
        document.getElementById('guestFirstName').value = '';
        document.getElementById('guestLastName').value = '';
        document.getElementById('guestEmail').value = '';
        document.getElementById('guestPhone').value = '';
        if (document.getElementById('guestNotes')) document.getElementById('guestNotes').value = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Inquiry Form Submission
  // --------------------------------------------------------------------------
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Guest';
      showToast(`Thank you, ${name}! Your inquiry has been sent to our concierge team.`);
      inquiryForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 8. Newsletter Form Submission
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to The Haute Club! You will receive our next seasonal opening announcement.');
      newsletterForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 9. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.borderLeftColor = '#D9534F';
    }

    toast.innerHTML = `
      <span>✦</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

});
