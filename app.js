/**
 * THE HAUTE MANE — INTERACTIVE FRONTEND LOGIC
 * Includes:
 * - 3 Theme Modes (Chic Ivory, Midnight Noir, Botanical Sanctuary)
 * - Interactive Before & After Transformation Slider
 * - 5-Step Atelier Concierge Booking Modal
 * - Dynamic Service Category Filter
 * - Lookbook Filter
 * - Testimonial Carousel
 * - Toast Notification System
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. THEME SWITCHER (CHIC, NOIR, BOTANICAL)
  // ==========================================================================
  const htmlRoot = document.documentElement;
  const themeBtns = document.querySelectorAll('.theme-btn');
  
  // Check for fixed theme on body (for dedicated concept pages), then URL param, then localStorage
  const fixedTheme = document.body.getAttribute('data-fixed-theme');
  const urlParams = new URLSearchParams(window.location.search);
  const themeFromUrl = urlParams.get('theme');
  const initialTheme = fixedTheme || themeFromUrl || localStorage.getItem('haute_mane_theme') || 'chic';

  function setTheme(theme, save = true) {
    htmlRoot.setAttribute('data-theme', theme);
    if (save && !fixedTheme) {
      localStorage.setItem('haute_mane_theme', theme);
    }
    
    themeBtns.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  setTheme(initialTheme, !fixedTheme && !themeFromUrl);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedTheme = btn.getAttribute('data-theme');
      if (selectedTheme) {
        setTheme(selectedTheme);
        showToast(`Switched atmosphere to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}`);
      }
    });
  });

  const switchThemeActionBtns = document.querySelectorAll('.switch-theme-action');
  switchThemeActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme');
      if (selectedTheme) {
        setTheme(selectedTheme);
        showToast(`Activated ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} Atmosphere`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // ==========================================================================
  // 2. MOBILE MENU DRAWER
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // 3. SERVICE CATEGORY TABS
  // ==========================================================================
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      serviceCards.forEach(card => {
        if (card.getAttribute('data-category') === category || category === 'all') {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 4. INTERACTIVE BEFORE & AFTER SLIDER
  // ==========================================================================
  const comparisonSlider = document.getElementById('comparisonSlider');
  const beforeWrapper = document.getElementById('beforeWrapper');
  const sliderHandle = document.getElementById('sliderHandle');
  let isDragging = false;

  function updateSlider(xPos) {
    if (!comparisonSlider || !beforeWrapper || !sliderHandle) return;
    const rect = comparisonSlider.getBoundingClientRect();
    let position = ((xPos - rect.left) / rect.width) * 100;
    
    // Clamp between 5% and 95%
    if (position < 5) position = 5;
    if (position > 95) position = 95;

    beforeWrapper.style.width = `${position}%`;
    sliderHandle.style.left = `${position}%`;
  }

  if (comparisonSlider) {
    comparisonSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support
    comparisonSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // ==========================================================================
  // 5. LOOKBOOK FILTER
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lookbookItems = document.querySelectorAll('.lookbook-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      lookbookItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 6. PRAISE / TESTIMONIAL CAROUSEL
  // ==========================================================================
  const slides = document.querySelectorAll('.praise-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('prevPraiseBtn');
  const nextBtn = document.getElementById('nextPraiseBtn');
  let currentSlide = 0;
  let carouselInterval;

  function showSlide(index) {
    if (!slides.length) return;
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetCarouselTimer();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetCarouselTimer();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        showSlide(idx);
        resetCarouselTimer();
      });
    });

    function startCarouselTimer() {
      carouselInterval = setInterval(nextSlide, 7000);
    }

    function resetCarouselTimer() {
      clearInterval(carouselInterval);
      startCarouselTimer();
    }

    startCarouselTimer();
  }

  // ==========================================================================
  // 7. INTERACTIVE 5-STEP BOOKING CONCIERGE MODAL
  // ==========================================================================
  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtn = document.getElementById('openBookingBtn');
  const heroBookingBtn = document.getElementById('heroBookingBtn');
  const mobileBookBtn = document.getElementById('mobileBookBtn');
  const transformBookBtn = document.getElementById('transformBookBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeConfirmationBtn = document.getElementById('closeConfirmationBtn');

  // Modal Step elements
  const steps = [
    document.getElementById('bookingStep1'),
    document.getElementById('bookingStep2'),
    document.getElementById('bookingStep3'),
    document.getElementById('bookingStep4'),
    document.getElementById('bookingStep5')
  ];
  const stepBadges = document.querySelectorAll('.step-badge');

  // Summary elements
  const sumService = document.getElementById('sumService');
  const sumArtisan = document.getElementById('sumArtisan');
  const sumDateTime = document.getElementById('sumDateTime');
  const sumPrice = document.getElementById('sumPrice');

  // Confirmation elements
  const confirmedRefCode = document.getElementById('confirmedRefCode');
  const confirmedGuest = document.getElementById('confirmedGuest');
  const confirmedRitual = document.getElementById('confirmedRitual');
  const confirmedArtisan = document.getElementById('confirmedArtisan');
  const confirmedSchedule = document.getElementById('confirmedSchedule');

  // Form Inputs
  const bookingDateInput = document.getElementById('bookingDate');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  let selectedTimeSlot = "09:30 AM";

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
  if (bookingDateInput) {
    bookingDateInput.value = tomorrowFormatted;
    bookingDateInput.min = tomorrowFormatted;
  }

  // Quick reservation inputs
  const quickDatePicker = document.getElementById('quickDatePicker');
  if (quickDatePicker) {
    quickDatePicker.value = tomorrowFormatted;
    quickDatePicker.min = tomorrowFormatted;
  }

  function openModal(initialStep = 1) {
    if (!bookingModal) return;
    goToStep(initialStep);
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function goToStep(stepNumber) {
    steps.forEach((stepEl, idx) => {
      if (stepEl) {
        stepEl.classList.toggle('active', idx + 1 === stepNumber);
      }
    });

    stepBadges.forEach((badge, idx) => {
      badge.classList.toggle('active', idx + 1 <= stepNumber);
    });

    updateSummary();
  }

  function updateSummary() {
    const selectedServiceRadio = document.querySelector('input[name="selectedService"]:checked');
    const selectedArtisanRadio = document.querySelector('input[name="selectedArtisan"]:checked');
    const dateVal = bookingDateInput ? bookingDateInput.value : tomorrowFormatted;

    if (selectedServiceRadio && sumService && sumPrice) {
      sumService.textContent = selectedServiceRadio.value;
      sumPrice.textContent = selectedServiceRadio.getAttribute('data-price') || '$380';
    }

    if (selectedArtisanRadio && sumArtisan) {
      sumArtisan.textContent = selectedArtisanRadio.value;
    }

    if (sumDateTime) {
      sumDateTime.textContent = `${dateVal || 'Tomorrow'} at ${selectedTimeSlot}`;
    }
  }

  // Bind Openers
  [openBookingBtn, heroBookingBtn, mobileBookBtn, transformBookBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(1));
  });

  // Direct Book buttons in Service cards
  const bookServiceBtns = document.querySelectorAll('.book-service-btn');
  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      const radio = document.querySelector(`input[name="selectedService"][value="${serviceName}"]`);
      if (radio) radio.checked = true;
      openModal(2); // Jump directly to Artisan step
    });
  });

  // Direct Book buttons in Artisan cards
  const selectArtisanBtns = document.querySelectorAll('.select-artisan-btn');
  selectArtisanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const artisanName = btn.getAttribute('data-artisan-name');
      const radios = document.querySelectorAll('input[name="selectedArtisan"]');
      radios.forEach(r => {
        if (r.value.includes(artisanName)) {
          r.checked = true;
        }
      });
      openModal(3); // Jump to Schedule
    });
  });

  // Quick Concierge Bar "Check Availability"
  const quickReserveBtn = document.getElementById('quickReserveBtn');
  const quickServiceSelect = document.getElementById('quickServiceSelect');
  const quickStylistSelect = document.getElementById('quickStylistSelect');

  if (quickReserveBtn && quickServiceSelect && quickStylistSelect) {
    quickReserveBtn.addEventListener('click', () => {
      const serviceVal = quickServiceSelect.value;
      const stylistVal = quickStylistSelect.value;
      const dateVal = quickDatePicker ? quickDatePicker.value : '';

      // Match service
      const servRadio = document.querySelector(`input[name="selectedService"][value="${serviceVal}"]`);
      if (servRadio) servRadio.checked = true;

      // Match stylist
      const stylRadio = document.querySelector(`input[name="selectedArtisan"][value="${stylistVal}"]`);
      if (stylRadio) stylRadio.checked = true;

      // Match date
      if (dateVal && bookingDateInput) {
        bookingDateInput.value = dateVal;
      }

      openModal(3); // Jump to schedule
    });
  }

  // Close buttons
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (closeConfirmationBtn) closeConfirmationBtn.addEventListener('click', closeModal);

  // Close on outside click
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  // Step Navigation Buttons (Next / Prev)
  const nextStepBtns = document.querySelectorAll('.next-step-btn');
  const prevStepBtns = document.querySelectorAll('.prev-step-btn');

  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next'), 10);
      goToStep(nextStep);
    });
  });

  prevStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(prevStep);
    });
  });

  // Time slot selection
  timeSlotBtns.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlotBtns.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      selectedTimeSlot = slot.textContent.trim();
      updateSummary();
    });
  });

  // Listen for radio changes
  document.querySelectorAll('input[name="selectedService"], input[name="selectedArtisan"]').forEach(input => {
    input.addEventListener('change', updateSummary);
  });

  if (bookingDateInput) {
    bookingDateInput.addEventListener('change', updateSummary);
  }

  // Confirm Reservation Button (Step 4 -> Step 5)
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');
  const guestName = document.getElementById('guestName');
  const guestEmail = document.getElementById('guestEmail');
  const guestPhone = document.getElementById('guestPhone');

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      if (!guestName.value.trim() || !guestEmail.value.trim() || !guestPhone.value.trim()) {
        showToast('Please provide your name, email, and contact number.');
        return;
      }

      // Generate confirmation code
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      confirmedRefCode.textContent = randomCode;
      confirmedGuest.textContent = guestName.value.trim();

      const selectedServiceRadio = document.querySelector('input[name="selectedService"]:checked');
      const selectedArtisanRadio = document.querySelector('input[name="selectedArtisan"]:checked');

      if (confirmedRitual && selectedServiceRadio) {
        confirmedRitual.textContent = selectedServiceRadio.value;
      }
      if (confirmedArtisan && selectedArtisanRadio) {
        confirmedArtisan.textContent = selectedArtisanRadio.value;
      }
      if (confirmedSchedule && bookingDateInput) {
        confirmedSchedule.textContent = `${bookingDateInput.value} • ${selectedTimeSlot}`;
      }

      goToStep(5);
      showToast('✦ Your suite has been reserved at The Haute Mane.');
    });
  }

  // ==========================================================================
  // 8. ATELIER INQUIRY & NEWSLETTER FORMS
  // ==========================================================================
  const atelierInquiryForm = document.getElementById('atelierInquiryForm');
  if (atelierInquiryForm) {
    atelierInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inquiryName').value;
      showToast(`Thank you, ${name}. Our head concierge will contact you within 2 business hours.`);
      atelierInquiryForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome to The Mane Gazette. Your invitation has been dispatched.');
      newsletterForm.reset();
    });
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION HELPER
  // ==========================================================================
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚜</span> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
});
