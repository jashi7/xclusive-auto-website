import React, { createContext, useContext, useEffect, useState } from "react";

const STRINGS = {
  en: {
    nav: { home: "Home", inventory: "Inventory", financing: "Financing", contact: "Contact", viewInventory: "View Inventory", tagline: "Se Habla Español" },
    hero: {
      badge: "Buy Here · Pay Here · No Credit Check",
      title1: "Drive The Car", title2: "You Deserve.",
      subtitle: "Hand-picked, certified pre-owned vehicles at honest prices in Hanover, MD. Easy financing for every credit story.",
      browse: "Browse Inventory", getApproved: "Get Pre-Approved",
      happyDrivers: "Happy Drivers", inStock: "Vehicles In Stock", noCheckNeeded: "Credit Check Needed",
    },
    search: {
      title: "Find Your Vehicle", subtitle: "Search our current inventory",
      make: "Make", maxPrice: "Max Price", keyword: "Keyword", keywordPh: "e.g. Tacoma",
      searchBtn: "Search Vehicles", allMakes: "All Makes", allBodies: "All Body Styles", noMax: "No Max Price",
    },
    featured: { eyebrow: "Featured", title: "Fresh Off The Lot", viewAll: "View All Vehicles" },
    whyUs: {
      eyebrow: "Why Xclusive", title1: "A Better Way To", title2: "Buy A Car",
      desc: "We've been serving the Hanover community with reliable, hand-inspected vehicles and honest financing. No pressure. No games. Just great cars.",
      f1t: "Certified Inspected", f1d: "Every vehicle is inspected & repaired by a certified mechanic before sale.",
      f2t: "No Credit Check Financing", f2d: "Verified income & 4 references — that's all it takes. Easy in-house financing.",
      f3t: "Trade-Ins Welcome", f3d: "Get top value for your trade. We'll make it simple and fair.",
      callToday: "Call us today",
    },
    testimonials: { eyebrow: "Reviews", title: "Trusted By Drivers" },
    cta: { title: "Ready to drive off the lot today?", desc: "Come visit our lot in Hanover — or start online in 60 seconds.", apply: "Apply For Financing" },
    location: { eyebrow: "Visit Us", title: "Come Say Hello", directions: "Get Directions" },
    inv: {
      eyebrow: "Inventory", title: "Available Vehicles",
      desc: "Browse our curated selection of hand-inspected cars, trucks & SUVs.",
      searchPh: "Search by year, make or model...", found: "vehicle found", foundPlural: "vehicles found",
      sortPriceAsc: "Price: Low to High", sortPriceDesc: "Price: High to Low", sortYear: "Newest First", sortMiles: "Lowest Miles",
      noMatch: "No vehicles match your filters.", reset: "Reset Filters",
    },
    fin: {
      eyebrow: "Financing", title: "Buy Here · Pay Here",
      desc: "No credit check needed. Verified income and four personal references — you're approved.",
      f1t: "No Credit Check", f1d: "Good, bad, or no credit — everyone is welcome to apply.",
      f2t: "Simple Paperwork", f2d: "Verified income & 4 personal references is all we need.",
      f3t: "Flexible Payments", f3d: "Weekly or bi-weekly plans that fit your budget.",
      preferTitle: "Prefer to talk?", preferDesc: "Give us a call — we'll walk you through the approval process in minutes.",
      callBtn: "Call", quickApp: "Quick Application", takesMin: "Takes less than 2 minutes.",
      firstName: "First Name", lastName: "Last Name", email: "Email", phone: "Phone",
      income: "Monthly Income", employment: "Employment", down: "Down Payment Available", comment: "Comment",
      submit: "Submit Application", disclaimer: "By submitting, you agree to be contacted by Xclusive Auto LLC.",
      receivedTitle: "Application Received!", receivedMsg: "Thanks {name}! Our team will contact you at {phone} shortly.",
      browseInv: "Browse Inventory",
      empFull: "Full-time", empPart: "Part-time", empSelf: "Self-employed", empOther: "Other",
      missingTitle: "Missing info", missingDesc: "Please fill first name, last name & phone.",
      appReceivedToast: "Application received!", appReceivedDesc: "We'll call you shortly. Thanks!",
    },
    contact: {
      eyebrow: "Contact", title: "Get In Touch",
      desc: "Questions about a vehicle, financing, or trade-in? We're here to help.",
      phone: "Phone", email: "Email", address: "Address", hours: "Dealership Hours",
      followUs: "Follow Us", sendMsg: "Send Us A Message", respond: "We usually respond within an hour during business hours.",
      name: "Name", messageL: "Message", sendBtn: "Send Message",
      missingTitle: "Missing info", missingDesc: "Please provide your name and message.",
      sentTitle: "Message sent!", sentDesc: "Thanks for reaching out. We'll be in touch soon.",
    },
    veh: {
      back: "Back to Inventory", orAsk: "or ask about financing",
      mileage: "Mileage", transmission: "Transmission", fuel: "Fuel", color: "Color",
      features: "Features", certified: "Certified Mechanic Inspected",
      apply: "Apply For Financing", callDealer: "Call Dealer",
      notFound: "Vehicle not found", backBtn: "Back to Inventory",
    },
    footer: { explore: "Explore", visit: "Visit Us", hours: "Hours", desc: "Quality used vehicles and no credit check financing in Hanover, MD. Drive off the lot with confidence.", rights: "All rights reserved." },
    card: { view: "View Details" },
    wa: { chat: "Chat with us", label: "Text us on WhatsApp", greeting: "Hi Xclusive Auto! I'm interested in a vehicle." },
    days: { Monday: "Monday", Tuesday: "Tuesday", Wednesday: "Wednesday", Thursday: "Thursday", Friday: "Friday", Saturday: "Saturday", Sunday: "Sunday", Closed: "Closed" },
  },
  es: {
    nav: { home: "Inicio", inventory: "Inventario", financing: "Financiamiento", contact: "Contacto", viewInventory: "Ver Inventario", tagline: "Se Habla Español" },
    hero: {
      badge: "Compra Aquí · Paga Aquí · Sin Chequeo de Crédito",
      title1: "Conduce el Auto", title2: "Que Mereces.",
      subtitle: "Vehículos usados certificados a precios honestos en Hanover, MD. Financiamiento fácil para todos.",
      browse: "Ver Inventario", getApproved: "Pre-Aprobación",
      happyDrivers: "Clientes Felices", inStock: "Vehículos En Stock", noCheckNeeded: "Sin Chequeo de Crédito",
    },
    search: {
      title: "Encuentra Tu Vehículo", subtitle: "Busca en nuestro inventario",
      make: "Marca", maxPrice: "Precio Máx.", keyword: "Palabra Clave", keywordPh: "ej. Tacoma",
      searchBtn: "Buscar Vehículos", allMakes: "Todas las Marcas", allBodies: "Todos los Estilos", noMax: "Sin Precio Máx.",
    },
    featured: { eyebrow: "Destacados", title: "Recién Llegados", viewAll: "Ver Todos los Vehículos" },
    whyUs: {
      eyebrow: "Por Qué Xclusive", title1: "Una Mejor Forma De", title2: "Comprar un Auto",
      desc: "Servimos a la comunidad de Hanover con vehículos confiables, inspeccionados y financiamiento honesto. Sin presión. Sin trucos. Solo grandes autos.",
      f1t: "Inspección Certificada", f1d: "Cada vehículo es inspeccionado y reparado por un mecánico certificado antes de venderse.",
      f2t: "Sin Chequeo de Crédito", f2d: "Ingreso verificado y 4 referencias — eso es todo. Financiamiento fácil en la casa.",
      f3t: "Aceptamos Intercambios", f3d: "Obtén el mejor valor por tu vehículo. Lo hacemos simple y justo.",
      callToday: "Llámanos hoy",
    },
    testimonials: { eyebrow: "Reseñas", title: "Confianza de Nuestros Clientes" },
    cta: { title: "¿Listo para llevarte tu auto hoy?", desc: "Visita nuestro lote en Hanover — o empieza en línea en 60 segundos.", apply: "Solicitar Financiamiento" },
    location: { eyebrow: "Visítanos", title: "Ven a Saludarnos", directions: "Cómo Llegar" },
    inv: {
      eyebrow: "Inventario", title: "Vehículos Disponibles",
      desc: "Explora nuestra selección de autos, camionetas y SUVs inspeccionados.",
      searchPh: "Busca por año, marca o modelo...", found: "vehículo encontrado", foundPlural: "vehículos encontrados",
      sortPriceAsc: "Precio: Menor a Mayor", sortPriceDesc: "Precio: Mayor a Menor", sortYear: "Más Nuevos", sortMiles: "Menor Millaje",
      noMatch: "Ningún vehículo coincide con tus filtros.", reset: "Restablecer Filtros",
    },
    fin: {
      eyebrow: "Financiamiento", title: "Compra Aquí · Paga Aquí",
      desc: "Sin chequeo de crédito. Ingreso verificado y cuatro referencias personales — ¡aprobado!",
      f1t: "Sin Chequeo de Crédito", f1d: "Bueno, malo o sin crédito — todos son bienvenidos a aplicar.",
      f2t: "Papeleo Sencillo", f2d: "Ingreso verificado y 4 referencias personales es todo lo que necesitamos.",
      f3t: "Pagos Flexibles", f3d: "Planes semanales o quincenales que se ajustan a tu presupuesto.",
      preferTitle: "¿Prefieres hablar?", preferDesc: "Llámanos — te guiamos por el proceso de aprobación en minutos.",
      callBtn: "Llamar", quickApp: "Solicitud Rápida", takesMin: "Toma menos de 2 minutos.",
      firstName: "Nombre", lastName: "Apellido", email: "Correo", phone: "Teléfono",
      income: "Ingreso Mensual", employment: "Empleo", down: "Enganche Disponible", comment: "Comentario",
      submit: "Enviar Solicitud", disclaimer: "Al enviar, aceptas ser contactado por Xclusive Auto LLC.",
      receivedTitle: "¡Solicitud Recibida!", receivedMsg: "¡Gracias {name}! Nuestro equipo te contactará al {phone} pronto.",
      browseInv: "Ver Inventario",
      empFull: "Tiempo completo", empPart: "Medio tiempo", empSelf: "Independiente", empOther: "Otro",
      missingTitle: "Falta información", missingDesc: "Por favor completa nombre, apellido y teléfono.",
      appReceivedToast: "¡Solicitud recibida!", appReceivedDesc: "Te llamaremos pronto. ¡Gracias!",
    },
    contact: {
      eyebrow: "Contacto", title: "Ponte en Contacto",
      desc: "¿Preguntas sobre un vehículo, financiamiento o intercambio? Estamos para ayudarte.",
      phone: "Teléfono", email: "Correo", address: "Dirección", hours: "Horario",
      followUs: "Síguenos", sendMsg: "Envíanos un Mensaje", respond: "Respondemos dentro de una hora en horario laboral.",
      name: "Nombre", messageL: "Mensaje", sendBtn: "Enviar Mensaje",
      missingTitle: "Falta información", missingDesc: "Por favor proporciona tu nombre y mensaje.",
      sentTitle: "¡Mensaje enviado!", sentDesc: "Gracias por contactarnos. Te responderemos pronto.",
    },
    veh: {
      back: "Volver al Inventario", orAsk: "o pregunta por financiamiento",
      mileage: "Millaje", transmission: "Transmisión", fuel: "Combustible", color: "Color",
      features: "Características", certified: "Inspeccionado por Mecánico Certificado",
      apply: "Solicitar Financiamiento", callDealer: "Llamar al Concesionario",
      notFound: "Vehículo no encontrado", backBtn: "Volver al Inventario",
    },
    footer: { explore: "Explora", visit: "Visítanos", hours: "Horario", desc: "Vehículos usados de calidad y financiamiento sin chequeo de crédito en Hanover, MD. Llévate tu auto con confianza.", rights: "Todos los derechos reservados." },
    card: { view: "Ver Detalles" },
    wa: { chat: "Chatea con nosotros", label: "Escríbenos por WhatsApp", greeting: "¡Hola Xclusive Auto! Estoy interesado/a en un vehículo." },
    days: { Monday: "Lunes", Tuesday: "Martes", Wednesday: "Miércoles", Thursday: "Jueves", Friday: "Viernes", Saturday: "Sábado", Sunday: "Domingo", Closed: "Cerrado" },
  },
};

const LangContext = createContext({ lang: "en", setLang: () => {}, t: STRINGS.en });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("xa_lang") || "en");
  useEffect(() => { localStorage.setItem("xa_lang", lang); document.documentElement.lang = lang; }, [lang]);
  const value = { lang, setLang, t: STRINGS[lang] };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }
