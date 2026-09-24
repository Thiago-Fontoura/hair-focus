document.addEventListener('DOMContentLoaded', () => {
  // Header Menu
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Modal & Agendamento
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtn = document.getElementById('openBookingModalBtn');
  const closeModalBtn = document.getElementById('closeBookingModal');
  const heroBookBtn = document.getElementById('heroBookBtn');
  const footerBookBtn = document.getElementById('footerBookBtn');

  // Agendamento Online
  const phoneScheduleBtn = document.getElementById('phoneScheduleBtn');
  const phoneDays = document.querySelectorAll('.phone-days-grid .day-num:not(.muted)');
  const timeSlots = document.querySelectorAll('.time-slot');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const calMonthDisplay = document.getElementById('calMonthDisplay');

  // Catálogo de Serviços
  const catPills = document.querySelectorAll('.cat-pill');
  const catalogRows = document.querySelectorAll('.service-item-row');
  const catalogBookBtns = document.querySelectorAll('.btn-catalog-book');
  const specialtyCards = document.querySelectorAll('.specialty-card');

  // Formulários & Notificações
  const modalServiceSelect = document.getElementById('modalServiceSelect');
  const modalSummaryPrice = document.getElementById('modalSummaryPrice');
  const modalBookingForm = document.getElementById('modalBookingForm');
  const fastBookingForm = document.getElementById('fastBookingForm');
  const toastNotification = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  const fastDateInput = document.getElementById('fastDate');
  const modalDateInput = document.getElementById('modalDatePicker');

  const todayStr = new Date().toISOString().split('T')[0];
  if (fastDateInput) {
    fastDateInput.min = todayStr;
    fastDateInput.value = todayStr;
  }
  if (modalDateInput) {
    modalDateInput.min = todayStr;
    modalDateInput.value = todayStr;
  }

  // Header Menu
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // Agendamento Online
  let currentSelectedDay = '14';
  let currentSelectedTime = '09:00';

  phoneDays.forEach(day => {
    day.addEventListener('click', () => {
      phoneDays.forEach(d => d.classList.remove('active'));
      day.classList.add('active');
      currentSelectedDay = day.getAttribute('data-day') || day.textContent.trim();
    });
  });

  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      currentSelectedTime = slot.getAttribute('data-time') || slot.textContent.trim();
    });
  });

  const months = ['Agosto 2026', 'Setembro 2026', 'Outubro 2026', 'Novembro 2026'];
  let currentMonthIndex = 1;

  if (calPrev && calNext && calMonthDisplay) {
    calPrev.addEventListener('click', () => {
      if (currentMonthIndex > 0) {
        currentMonthIndex--;
        calMonthDisplay.textContent = months[currentMonthIndex];
      }
    });

    calNext.addEventListener('click', () => {
      if (currentMonthIndex < months.length - 1) {
        currentMonthIndex++;
        calMonthDisplay.textContent = months[currentMonthIndex];
      }
    });
  }

  if (phoneScheduleBtn) {
    phoneScheduleBtn.addEventListener('click', () => {
      openModalWithService('Corte Feminino', '80.00');
      if (modalDateInput) {
        modalDateInput.value = '2026-09-' + currentSelectedDay.padStart(2, '0');
      }
      const modalTimePicker = document.getElementById('modalTimePicker');
      if (modalTimePicker) {
        modalTimePicker.value = currentSelectedTime;
      }
    });
  }

  // Catálogo de Serviços
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const category = pill.getAttribute('data-category');
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      catalogRows.forEach(row => {
        const itemCat = row.getAttribute('data-cat');
        if (category === 'all' || itemCat === category) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  specialtyCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-cat-select');
      const targetPill = document.querySelector(`.cat-pill[data-category="${category}"]`);
      if (targetPill) {
        targetPill.click();
      }
      const servicosSection = document.getElementById('servicos');
      if (servicosSection) {
        servicosSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Modal de Agendamento
  function openModal() {
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function openModalWithService(serviceName, price) {
    if (modalServiceSelect) {
      let found = false;
      for (let i = 0; i < modalServiceSelect.options.length; i++) {
        if (modalServiceSelect.options[i].value === serviceName) {
          modalServiceSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found && serviceName) {
        const opt = new Option(`${serviceName} - R$ ${price}`, serviceName, true, true);
        opt.setAttribute('data-price', price);
        modalServiceSelect.add(opt);
      }
      updateModalPrice();
    }
    openModal();
  }

  function updateModalPrice() {
    if (modalServiceSelect && modalSummaryPrice) {
      const selectedOption = modalServiceSelect.options[modalServiceSelect.selectedIndex];
      const price = selectedOption.getAttribute('data-price') || '80';
      modalSummaryPrice.textContent = `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
    }
  }

  if (modalServiceSelect) {
    modalServiceSelect.addEventListener('change', updateModalPrice);
  }

  if (openModalBtn) openModalBtn.addEventListener('click', () => openModalWithService('Corte Feminino', '80.00'));
  if (heroBookBtn) heroBookBtn.addEventListener('click', () => openModalWithService('Corte Feminino', '80.00'));
  if (footerBookBtn) footerBookBtn.addEventListener('click', () => openModalWithService('Corte Feminino', '80.00'));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
      closeModal();
    }
  });

  catalogBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      const price = btn.getAttribute('data-price');
      openModalWithService(serviceName, price);
    });
  });

  function showToast(title, message) {
    if (toastNotification && toastTitle && toastMessage) {
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      toastNotification.classList.add('show');
      setTimeout(() => {
        toastNotification.classList.remove('show');
      }, 4500);
    }
  }

  // Supabase & Formulários
  async function saveAppointmentToSupabase(appointmentData) {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('agendamentos')
          .insert([appointmentData]);
        if (error) {
          console.error(error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const service = modalServiceSelect.value;
      const stylist = document.getElementById('modalStylistSelect').value;
      const date = modalDateInput.value;
      const time = document.getElementById('modalTimePicker').value;
      const name = document.getElementById('modalClientName').value;
      const phone = document.getElementById('modalClientPhone').value;
      const selectedOption = modalServiceSelect.options[modalServiceSelect.selectedIndex];
      const price = parseFloat(selectedOption.getAttribute('data-price') || '80');

      closeModal();
      modalBookingForm.reset();

      await saveAppointmentToSupabase({
        servico: service,
        profissional: stylist,
        data: date,
        horario: time,
        nome_cliente: name,
        telefone_cliente: phone,
        valor: price,
        status: 'confirmado'
      });

      showToast('Agendamento Confirmado! ✨', `Obrigada, ${name}! Seu horário para ${service} com ${stylist} no dia ${date} às ${time} foi reservado com sucesso.`);
    });
  }

  if (fastBookingForm) {
    fastBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const service = document.getElementById('fastService').value;
      const professional = document.getElementById('fastProfessional').value;
      const date = fastDateInput.value;
      const time = document.getElementById('fastTime').value;
      const name = document.getElementById('fastName').value;
      const phone = document.getElementById('fastPhone').value;
      const selectedOption = document.getElementById('fastService').options[document.getElementById('fastService').selectedIndex];
      const price = parseFloat(selectedOption.getAttribute('data-price') || '80');

      fastBookingForm.reset();
      fastDateInput.value = todayStr;

      await saveAppointmentToSupabase({
        servico: service,
        profissional: professional,
        data: date,
        horario: time,
        nome_cliente: name,
        telefone_cliente: phone,
        valor: price,
        status: 'confirmado'
      });

      showToast('Horário Agendado com Sucesso! 💇‍♀️', `Parabéns ${name}! Agendamento de ${service} (${professional}) para o dia ${date} às ${time} confirmado.`);
    });
  }
});
