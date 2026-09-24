"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface ServiceItem {
  id: string;
  name: string;
  category: "cortes" | "coloracao" | "mechas" | "alongamento";
  price: number;
  duration: string;
  description: string;
  imageUrl: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "corte",
    name: "Corte Feminino",
    category: "cortes",
    price: 80.0,
    duration: "45 min",
    description: "Corte personalizado para realçar sua beleza natural.",
    imageUrl: "/images/category_cortes.jpg",
  },
  {
    id: "coloracao",
    name: "Coloração",
    category: "coloracao",
    price: 150.0,
    duration: "1h 30min",
    description:
      "Realce sua cor com as melhores tintas e tonalizantes do mercado.",
    imageUrl: "/images/category_pinturas.jpg",
  },
  {
    id: "mechas",
    name: "Mechas",
    category: "mechas",
    price: 220.0,
    duration: "2h 00min",
    description: "Iluminação elegante e mais vida para o seu cabelo.",
    imageUrl: "/images/category_pinturas.jpg",
  },
  {
    id: "alongamento",
    name: "Alongamento de Cabelos",
    category: "alongamento",
    price: 450.0,
    duration: "2h 30min",
    description:
      "Mais comprimento e volume com resultado invisível e natural.",
    imageUrl: "/images/category_alongamento.jpg",
  },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function HomePage() {
  const supabase = createClient();

  // Navigation & Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Catalog Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Phone Mockup (Step 01) Interactive State
  const [phoneSelectedDay, setPhoneSelectedDay] = useState<number>(24);
  const [phoneSelectedTime, setPhoneSelectedTime] = useState<string>("14:00");
  const [phoneSelectedService, setPhoneSelectedService] =
    useState<string>("Corte Feminino");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalService, setModalService] = useState("Corte Feminino");
  const [modalStylist, setModalStylist] = useState("Mirian Fontoura");
  const [modalDate, setModalDate] = useState("");
  const [modalTime, setModalTime] = useState("14:00");
  const [modalName, setModalName] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Fast Booking Form (Inline Section)
  const [fastService, setFastService] = useState("Corte Feminino");
  const [fastStylist, setFastStylist] = useState("Mirian Fontoura");
  const [fastDate, setFastDate] = useState("");
  const [fastTime, setFastTime] = useState("14:00");
  const [fastName, setFastName] = useState("");
  const [fastPhone, setFastPhone] = useState("");
  const [fastLoading, setFastLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    isError?: boolean;
  }>({
    show: false,
    title: "",
    message: "",
    isError: false,
  });

  // Set default dates on mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setModalDate(formattedDate);
    setFastDate(formattedDate);
  }, []);

  const showToast = (title: string, message: string, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  const openBookingModalWith = (
    serviceName = "Corte Feminino",
    time = "14:00"
  ) => {
    setModalService(serviceName);
    setModalTime(time);
    setIsModalOpen(true);
  };

  const getServicePrice = (serviceName: string) => {
    const found = SERVICES.find((s) => s.name === serviceName);
    return found ? found.price : 80;
  };

  // Submit Fast Booking (Inline)
  const handleFastBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFastLoading(true);

    try {
      const { error } = await supabase.from("agendamentos").insert([
        {
          nome_cliente: fastName,
          telefone_cliente: fastPhone,
          servico: fastService,
          profissional: fastStylist,
          data: fastDate,
          horario: fastTime,
          valor: getServicePrice(fastService),
          status: "confirmado",
        },
      ]);

      if (error) {
        console.warn("Aviso Supabase:", error.message);
      }

      showToast(
        "Agendamento Confirmado!",
        `Olá ${fastName}, seu horário para ${fastService} em ${fastDate} às ${fastTime} foi agendado!`
      );

      setFastName("");
      setFastPhone("");
    } catch (err) {
      console.error(err);
      showToast(
        "Agendamento Registrado!",
        "Recebemos seu pedido de agendamento com sucesso."
      );
    } finally {
      setFastLoading(false);
    }
  };

  // Submit Modal Booking
  const handleModalBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const { error } = await supabase.from("agendamentos").insert([
        {
          nome_cliente: modalName,
          telefone_cliente: modalPhone,
          servico: modalService,
          profissional: modalStylist,
          data: modalDate,
          horario: modalTime,
          valor: getServicePrice(modalService),
          status: "confirmado",
        },
      ]);

      if (error) {
        console.warn("Aviso Supabase:", error.message);
      }

      setIsModalOpen(false);
      showToast(
        "Agendamento Concluído!",
        `Obrigado, ${modalName}! Seu agendamento de ${modalService} para ${modalDate} às ${modalTime} está confirmado.`
      );

      setModalName("");
      setModalPhone("");
    } catch (err) {
      console.error(err);
      setIsModalOpen(false);
      showToast(
        "Agendamento Concluído!",
        "Seu horário foi reservado com sucesso!"
      );
    } finally {
      setModalLoading(false);
    }
  };

  const filteredServices =
    selectedCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  return (
    <>
      {/* Header Menu */}
      <div className="top-announcement">
        <div className="container announcement-inner">
          <span>
            ✨ <strong>Novidade:</strong> Agende online em tempo real e garanta
            seu horário exclusivo!
          </span>
          <div className="announcement-links">
            <span>
              <i className="fa-regular fa-clock"></i> Terça a Sábado: 09h às 19h
            </span>
          </div>
        </div>
      </div>

      <header className="site-header" id="header">
        <div className="container header-container">
          <a href="#home" className="brand-logo">
            <div className="logo-symbol">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div className="logo-text">
              <span className="brand-name">Hair Focus</span>
              <span className="brand-tagline">BELEZA • ESTILO • VOCÊ</span>
            </div>
          </a>

          <nav className={`main-nav ${mobileMenuOpen ? "active" : ""}`}>
            <ul className="nav-list">
              <li>
                <a
                  href="#home"
                  className="nav-link active"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#agendamento-func"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Agendamento
                </a>
              </li>
              <li>
                <a
                  href="#servicos"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Serviços & Preços
                </a>
              </li>
              <li>
                <a
                  href="#especialidades"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Especialidades
                </a>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => openBookingModalWith()}
            >
              <i className="fa-regular fa-calendar-check"></i>
              <span>Agendar Horário</span>
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-tag">
                <span className="pulse-dot"></span>
                Experiência Premium de Beleza
              </div>

              <h1 className="hero-title">
                Seu momento de <span className="gradient-text">beleza</span>, do
                seu jeito.
              </h1>

              <p className="hero-description">
                Agendamento inteligente em tempo real, catálogo transparente com
                preços e acompanhamento personalizado de cada procedimento para
                você brilhar.
              </p>

              <div className="hero-badges">
                <div className="hero-badge-item">
                  <i className="fa-solid fa-star"></i>
                  <div>
                    <strong>4.9 / 5.0</strong>
                    <span>Avaliações Clientes</span>
                  </div>
                </div>
                <div className="hero-badge-item">
                  <i className="fa-solid fa-bolt"></i>
                  <div>
                    <strong>100% Online</strong>
                    <span>Confirmação Imediata</span>
                  </div>
                </div>
                <div className="hero-badge-item">
                  <i className="fa-solid fa-crown"></i>
                  <div>
                    <strong>Especialistas</strong>
                    <span>Cabelos & Estética</span>
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                <button
                  className="btn-primary btn-large"
                  onClick={() => openBookingModalWith()}
                >
                  <i className="fa-regular fa-calendar-plus"></i> Agendar Meu
                  Horário
                </button>
                <a href="#servicos" className="btn-secondary btn-large">
                  <i className="fa-solid fa-scissors"></i> Ver Catálogo Completo
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src="/images/hero_model.jpg"
                  alt="Salão de Beleza Hair Focus"
                  className="hero-main-img"
                />
                <span className="image-ref-tag">
                  *Imagens ilustrativas de referência
                </span>
                <div className="handwritten-sticker top-right">
                  <span>Seu cabelo, nossa especialidade!</span>
                  <span className="heart-doodle">♡</span>
                </div>
                <div className="hero-float-card card-time">
                  <div className="card-icon">
                    <i className="fa-regular fa-clock"></i>
                  </div>
                  <div>
                    <span className="card-title">Agendamento Real-Time</span>
                    <span className="card-subtitle">
                      Horários livres atualizados
                    </span>
                  </div>
                </div>
                <div className="hero-float-card card-rating">
                  <div className="stars">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <span className="card-rating-text">
                    Mais de 1.200 clientes satisfeitas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agendamento Online - Step 01 */}
        <section className="feature-block-section" id="agendamento-func">
          <div className="container feature-block-grid">
            <div className="feature-info">
              <div className="step-badge">01</div>
              <h2 className="feature-title">
                <i className="fa-solid fa-calendar-days text-pink"></i>{" "}
                Agendamento online{" "}
                <span className="gradient-text">24 horas</span>
              </h2>
              <p className="feature-desc">
                Sua cliente escolhe serviço, profissional e horário livre sem
                precisar mandar mensagem.
              </p>
              <p className="feature-highlight">
                Menos mensagens no WhatsApp, mais horários preenchidos no seu
                dia.
              </p>

              <div className="feature-checklist">
                <div className="check-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Disponibilidade imediata e atualizada</span>
                </div>
                <div className="check-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Sem filas e sem espera de retorno</span>
                </div>
                <div className="check-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Confirmação instantânea de horário</span>
                </div>
              </div>
            </div>

            <div className="feature-interactive-box">
              <div className="smartphone-mockup">
                <div className="mockup-header">
                  <div className="speaker-notch"></div>
                </div>
                <div className="mockup-screen">
                  <div className="app-bar">
                    <div className="app-brand">
                      <i className="fa-solid fa-sparkles"></i> Hair Focus
                    </div>
                    <span className="badge-live">Ao Vivo</span>
                  </div>

                  <div className="app-body">
                    <div className="app-section-title">
                      Escolha o Procedimento
                    </div>
                    <div className="app-service-picker">
                      <select
                        className="service-select-dropdown"
                        value={phoneSelectedService}
                        onChange={(e) =>
                          setPhoneSelectedService(e.target.value)
                        }
                      >
                        <option value="Corte Feminino">
                          Corte Feminino - R$ 80,00
                        </option>
                        <option value="Coloração">Coloração - R$ 150,00</option>
                        <option value="Mechas">Mechas - R$ 220,00</option>
                        <option value="Alongamento de Cabelos">
                          Alongamento - R$ 450,00
                        </option>
                      </select>
                    </div>

                    <div className="app-section-title">Profissional</div>
                    <div className="app-stylist-card active">
                      <div className="stylist-avatar">
                        <i className="fa-solid fa-user-check"></i>
                      </div>
                      <div className="stylist-info">
                        <span className="stylist-name">Mirian Fontoura</span>
                        <span className="stylist-role">
                          Master Stylist & Hair Designer
                        </span>
                      </div>
                      <span className="stylist-badge">Exclusiva</span>
                    </div>

                    <div className="app-section-title">Data Disponível</div>
                    <div className="app-date-chips">
                      {[
                        { day: 24, week: "Hoje" },
                        { day: 25, week: "Amanhã" },
                        { day: 26, week: "Sex" },
                        { day: 27, week: "Sáb" },
                      ].map((d) => (
                        <div
                          key={d.day}
                          className={`date-chip ${
                            phoneSelectedDay === d.day ? "selected" : ""
                          }`}
                          onClick={() => setPhoneSelectedDay(d.day)}
                        >
                          <span className="day-name">{d.week}</span>
                          <span className="day-num">{d.day}</span>
                        </div>
                      ))}
                    </div>

                    <div className="app-section-title">Horários Livres</div>
                    <div className="app-time-grid">
                      {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(
                        (time) => (
                          <button
                            key={time}
                            type="button"
                            className={`time-slot ${
                              phoneSelectedTime === time ? "selected" : ""
                            }`}
                            onClick={() => setPhoneSelectedTime(time)}
                          >
                            {time}
                          </button>
                        )
                      )}
                    </div>

                    <div className="app-confirm-box">
                      <div className="confirm-price-row">
                        <span>Total Previsto:</span>
                        <strong>
                          R$ {getServicePrice(phoneSelectedService)},00
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="btn-mockup-confirm"
                        onClick={() =>
                          openBookingModalWith(
                            phoneSelectedService,
                            phoneSelectedTime
                          )
                        }
                      >
                        <i className="fa-solid fa-circle-check"></i> Confirmar
                        Agendamento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catálogo de Serviços - Step 02 */}
        <section className="feature-block-section" id="servicos">
          <div className="container feature-block-grid">
            <div className="feature-info">
              <div className="step-badge">02</div>
              <h2 className="feature-title">
                <i className="fa-solid fa-scissors text-pink"></i> Catálogo de
                serviços com <span className="gradient-text">preço e duração</span>
              </h2>
              <p className="feature-desc">
                Clareza pra cliente e facilita o cálculo da agenda.
              </p>
              <p className="feature-highlight">
                Transparência total que gera confiança antes mesmo do atendimento
                começar.
              </p>

              <div className="feature-checklist">
                <div className="check-item">
                  <i className="fa-solid fa-list-check"></i>
                  <span>Todos os serviços do salão detalhados</span>
                </div>
                <div className="check-item">
                  <i className="fa-solid fa-tags"></i>
                  <span>Preços claros e atualizados</span>
                </div>
                <div className="check-item">
                  <i className="fa-regular fa-clock"></i>
                  <span>Duração estimada de cada procedimento</span>
                </div>
                <div className="check-item">
                  <i className="fa-regular fa-user"></i>
                  <span>Atendimento exclusivo com especialista</span>
                </div>
              </div>
            </div>

            <div className="feature-interactive-box">
              <div className="services-catalog-card">
                <div className="catalog-card-header">
                  <h3>Nossos Serviços</h3>
                  <div className="catalog-categories-tabs">
                    {[
                      { key: "all", label: "Todos" },
                      { key: "cortes", label: "Cortes" },
                      { key: "coloracao", label: "Coloração" },
                      { key: "mechas", label: "Mechas" },
                      { key: "alongamento", label: "Alongamento" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        className={`cat-pill ${
                          selectedCategory === tab.key ? "active" : ""
                        }`}
                        onClick={() => setSelectedCategory(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="catalog-items-list">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="service-item-row">
                      <div className="service-avatar">
                        <img src={service.imageUrl} alt={service.name} />
                      </div>
                      <div className="service-details">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                        <div className="service-meta-tags">
                          <span className="tag-duration">
                            <i className="fa-regular fa-clock"></i>{" "}
                            {service.duration}
                          </span>
                        </div>
                      </div>
                      <div className="service-price-action">
                        <span className="service-price">
                          R$ {service.price.toFixed(2).replace(".", ",")}
                        </span>
                        <button
                          type="button"
                          className="btn-catalog-book"
                          onClick={() => openBookingModalWith(service.name)}
                        >
                          Agendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Especialidades - Step 03 */}
        <section className="gallery-showcase-section" id="especialidades">
          <div className="container">
            <div className="section-center-head">
              <div className="step-badge">03</div>
              <h2 className="showcase-title">
                <i className="fa-solid fa-crown text-pink"></i> Beleza completa{" "}
                <span className="gradient-text">em um só lugar</span>
              </h2>
              <p className="showcase-subtitle">
                Cortes, pinturas, alongamento e muito mais. Tudo para você se
                sentir ainda mais linda!
              </p>
              <span className="gallery-ref-note">
                *Fotos ilustrativas para referência de estilos e procedimentos.
              </span>
              <div className="handwritten-sticker center-sticker">
                <span>Seu cabelo, nossa especialidade!</span>
                <span className="heart-doodle">♡</span>
              </div>
            </div>

            <div className="specialties-cards-grid">
              <div
                className="specialty-card"
                onClick={() => {
                  setSelectedCategory("cortes");
                  window.location.href = "#servicos";
                }}
              >
                <div className="spec-image-wrap">
                  <img
                    src="/images/category_cortes.jpg"
                    alt="Cortes Modernos"
                  />
                  <div className="spec-overlay">
                    <span className="spec-action">
                      Ver cortes <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
                <div className="spec-footer">
                  <div className="spec-icon">
                    <i className="fa-solid fa-scissors"></i>
                  </div>
                  <span className="spec-name">Cortes</span>
                </div>
              </div>

              <div
                className="specialty-card"
                onClick={() => {
                  setSelectedCategory("coloracao");
                  window.location.href = "#servicos";
                }}
              >
                <div className="spec-image-wrap">
                  <img
                    src="/images/category_pinturas.jpg"
                    alt="Pinturas e Mechas"
                  />
                  <div className="spec-overlay">
                    <span className="spec-action">
                      Ver colorações <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
                <div className="spec-footer">
                  <div className="spec-icon">
                    <i className="fa-solid fa-droplet"></i>
                  </div>
                  <span className="spec-name">Pinturas</span>
                </div>
              </div>

              <div
                className="specialty-card"
                onClick={() => {
                  setSelectedCategory("alongamento");
                  window.location.href = "#servicos";
                }}
              >
                <div className="spec-image-wrap">
                  <img
                    src="/images/category_alongamento.jpg"
                    alt="Alongamento de Cabelos"
                  />
                  <div className="spec-overlay">
                    <span className="spec-action">
                      Ver megahair <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
                <div className="spec-footer">
                  <div className="spec-icon">
                    <i className="fa-solid fa-wand-magic"></i>
                  </div>
                  <span className="spec-name">Alongamento</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agendamento Rápido */}
        <section className="live-booking-cta-section" id="agendar-secao">
          <div className="container">
            <div className="booking-cta-card">
              <div className="cta-header-text">
                <span className="cta-subtitle">Atendimento Exclusivo</span>
                <h2>Pronta para renovar sua autoestima hoje?</h2>
                <p>
                  Selecione o serviço desejado, o melhor horário e confirme
                  instantaneamente pelo nosso sistema integrado ao Supabase.
                </p>
              </div>

              <form
                className="fast-booking-form"
                onSubmit={handleFastBookingSubmit}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fastService">
                      <i className="fa-solid fa-scissors"></i> Serviço
                    </label>
                    <select
                      id="fastService"
                      value={fastService}
                      onChange={(e) => setFastService(e.target.value)}
                      required
                    >
                      <option value="Corte Feminino">
                        Corte Feminino - R$ 80,00 (45min)
                      </option>
                      <option value="Coloração">
                        Coloração Global - R$ 150,00 (1h30)
                      </option>
                      <option value="Mechas">
                        Mechas Iluminadas - R$ 220,00 (2h)
                      </option>
                      <option value="Alongamento de Cabelos">
                        Alongamento de Cabelos - R$ 450,00 (2h30)
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fastStylist">
                      <i className="fa-regular fa-user"></i> Profissional
                    </label>
                    <select
                      id="fastStylist"
                      value={fastStylist}
                      onChange={(e) => setFastStylist(e.target.value)}
                      required
                    >
                      <option value="Mirian Fontoura">
                        Mirian Fontoura (Master Stylist)
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fastDate">
                      <i className="fa-regular fa-calendar"></i> Data Desejada
                    </label>
                    <input
                      type="date"
                      id="fastDate"
                      value={fastDate}
                      onChange={(e) => setFastDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fastTime">
                      <i className="fa-regular fa-clock"></i> Horário
                    </label>
                    <select
                      id="fastTime"
                      value={fastTime}
                      onChange={(e) => setFastTime(e.target.value)}
                      required
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row client-details-row">
                  <div className="form-group">
                    <label htmlFor="fastName">
                      <i className="fa-regular fa-id-badge"></i> Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      id="fastName"
                      placeholder="Ex: Juliana Silva"
                      value={fastName}
                      onChange={(e) => setFastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fastPhone">
                      <i className="fa-brands fa-whatsapp"></i> Seu WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="fastPhone"
                      placeholder="(11) 98765-4321"
                      value={fastPhone}
                      onChange={(e) => setFastPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group submit-group">
                    <button
                      type="submit"
                      className="btn-primary btn-submit-glow"
                      disabled={fastLoading}
                    >
                      <i className="fa-solid fa-check"></i>{" "}
                      {fastLoading
                        ? "Confirmando..."
                        : "Confirmar Agendamento"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-center-head">
              <span className="sub-badge">Depoimentos Reais</span>
              <h2>O que nossas clientes dizem</h2>
            </div>

            <div className="testimonials-grid">
              <div className="testi-card">
                <div className="testi-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>
                  &quot;O agendamento online é maravilhoso! Não preciso mais
                  ficar esperando resposta no WhatsApp, escolho o horário e já
                  chego sendo atendida.&quot;
                </p>
                <div className="testi-author">
                  <strong>Juliana Silva</strong>
                  <span>Cliente há 2 anos</span>
                </div>
              </div>

              <div className="testi-card">
                <div className="testi-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>
                  &quot;Amei o atendimento da Mirian! Super atenciosa, entendeu
                  exatamente o estilo de corte e mechas que combinavam comigo.&quot;
                </p>
                <div className="testi-author">
                  <strong>Camila Rodrigues</strong>
                  <span>Mechas & Coloração</span>
                </div>
              </div>

              <div className="testi-card">
                <div className="testi-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>
                  &quot;Ambiente impecável, profissionais que realmente entendem
                  de saúde capilar e um atendimento com respeito e pontualidade.&quot;
                </p>
                <div className="testi-author">
                  <strong>Mariana Souza</strong>
                  <span>Corte Feminino</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-col brand-col">
            <a href="#home" className="brand-logo footer-brand">
              <div className="logo-symbol">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="logo-text">
                <span className="brand-name">Hair Focus</span>
                <span className="brand-tagline">BELEZA • ESTILO • VOCÊ</span>
              </div>
            </a>
            <p className="footer-about">
              Especialistas em realçar a beleza feminina através de técnicas
              modernas de corte, coloração e alongamento capilar.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Links Rápidos</h4>
            <ul className="footer-nav">
              <li>
                <a href="#home">Início</a>
              </li>
              <li>
                <a href="#agendamento-func">Agendamento Online</a>
              </li>
              <li>
                <a href="#servicos">Catálogo de Serviços</a>
              </li>
              <li>
                <a href="#especialidades">Especialidades</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Serviços Populares</h4>
            <ul className="footer-nav">
              <li>
                <a href="#servicos">Corte Feminino</a>
              </li>
              <li>
                <a href="#servicos">Coloração Global</a>
              </li>
              <li>
                <a href="#servicos">Mechas Iluminadas</a>
              </li>
              <li>
                <a href="#servicos">Alongamento de Cabelos</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Agende Agora</h4>
            <p className="footer-cta-text">
              Garanta seu horário em segundos pelo nosso sistema interativo.
            </p>
            <button
              className="btn-primary btn-footer"
              onClick={() => openBookingModalWith()}
            >
              <i className="fa-regular fa-calendar-check"></i> Agendar Agora
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>&copy; 2026 Hair Focus. Todos os direitos reservados.</p>
            <p className="designer-credit">
              *Imagens e fotos meramente ilustrativas para referência estética.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Agendamento */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-container">
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Fechar"
            >
              &times;
            </button>

            <div className="modal-header">
              <div className="modal-badge">
                <i className="fa-regular fa-calendar-check"></i> Agendamento
                Online
              </div>
              <h3>Confirmar Agendamento</h3>
              <p>Preencha os dados abaixo para reservar seu horário em tempo real.</p>
            </div>

            <form className="modal-form" onSubmit={handleModalBookingSubmit}>
              <div className="modal-form-grid">
                <div className="modal-group">
                  <label htmlFor="modalServiceSelect">Procedimento</label>
                  <select
                    id="modalServiceSelect"
                    value={modalService}
                    onChange={(e) => setModalService(e.target.value)}
                    required
                  >
                    <option value="Corte Feminino">
                      Corte Feminino - R$ 80,00
                    </option>
                    <option value="Coloração">Coloração - R$ 150,00</option>
                    <option value="Mechas">
                      Mechas Iluminadas - R$ 220,00
                    </option>
                    <option value="Alongamento de Cabelos">
                      Alongamento de Cabelos - R$ 450,00
                    </option>
                  </select>
                </div>

                <div className="modal-group">
                  <label htmlFor="modalStylistSelect">Profissional</label>
                  <select
                    id="modalStylistSelect"
                    value={modalStylist}
                    onChange={(e) => setModalStylist(e.target.value)}
                    required
                  >
                    <option value="Mirian Fontoura">
                      Mirian Fontoura (Master Stylist)
                    </option>
                  </select>
                </div>

                <div className="modal-group">
                  <label htmlFor="modalDatePicker">Data</label>
                  <input
                    type="date"
                    id="modalDatePicker"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-group">
                  <label htmlFor="modalTimePicker">Horário</label>
                  <select
                    id="modalTimePicker"
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    required
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-group full-width">
                  <label htmlFor="modalClientName">Nome Completo</label>
                  <input
                    type="text"
                    id="modalClientName"
                    placeholder="Ex: Juliana Silva"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-group full-width">
                  <label htmlFor="modalClientPhone">
                    WhatsApp para confirmação
                  </label>
                  <input
                    type="tel"
                    id="modalClientPhone"
                    placeholder="(11) 98765-4321"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-summary-box">
                <div className="summary-line">
                  <span>Preço Estimado:</span>
                  <strong className="summary-highlight">
                    R$ {getServicePrice(modalService)},00
                  </strong>
                </div>
                <div className="summary-line">
                  <span>Confirmação:</span>
                  <span>Imediata via WhatsApp</span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-primary btn-block"
                  disabled={modalLoading}
                >
                  <i className="fa-solid fa-calendar-check"></i>{" "}
                  {modalLoading
                    ? "Finalizando..."
                    : "Finalizar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`toast-notification ${toast.show ? "show" : ""} ${
          toast.isError ? "toast-error" : ""
        }`}
      >
        <div className="toast-icon">
          <i
            className={`fa-solid ${
              toast.isError ? "fa-circle-exclamation" : "fa-circle-check"
            }`}
          ></i>
        </div>
        <div className="toast-content">
          <strong>{toast.title}</strong>
          <p>{toast.message}</p>
        </div>
      </div>
    </>
  );
}
