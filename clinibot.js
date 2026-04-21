/* =========================================================
   CliniBOT — Chatbot embebible para CliniNut / Grupo Edasnut
   Uso: <script src="clinibot.js"></script>
   ========================================================= */
(function () {
  'use strict';


  /* ── CONFIGURACIÓN ──────────────────────────────────────── */
  var API_KEY = 'AIzaSyCWPOq4yM_IRmvSHMYymZUEGI8-o8qMCPQ';
  /* Modelos a intentar en orden (fallback automático) */
  var MODELS = [
    'gemini-2.0-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
  ];
  var AVATAR_URL =
    'https://manuelescribanotorres03-byte.github.io/CLINIBOT/clinibot-avatar.png.jpg';


  /* ── SYSTEM PROMPT ──────────────────────────────────────── */
  var SYSTEM_PROMPT = [
    'Eres CliniBOT, el asistente virtual oficial de CliniNut, el software SaaS de gestión nutricional con IA desarrollado por Grupo Edasnut.',
    '',
    '## Qué es CliniNut',
    'CliniNut es una plataforma integral para nutricionistas y clínicas de nutrición que combina:',
    '- Gestión completa de pacientes y expedientes clínicos',
    '- Planificación de menús y dietas personalizadas',
    '- Módulos de Inteligencia Artificial para optimizar la consulta nutricional',
    '- Agenda, seguimiento y comunicación con pacientes',
    '',
    '## Planes disponibles',
    '**Plan Freemium — 0 €/mes**',
    '- Hasta 25 pacientes activos',
    '- Gestión básica de pacientes y expedientes',
    '- Funcionalidades base de CliniNut',
    '- Ideal para nutricionistas que empiezan o tienen consulta pequeña',
    '',
    '**Plan InfinitIA — 45 €/mes**',
    '- Pacientes ilimitados',
    '- Todo lo del plan Freemium',
    '- Módulos de IA incluidos:',
    '  - ConnectIA: automatización inteligente de comunicaciones con pacientes',
    '  - MenuIA: generación automática de menús y dietas personalizadas con IA',
    '  - TherapIA: seguimiento terapéutico y nutricional avanzado con IA',
    '',
    '## Empresa',
    'CliniNut es desarrollado y mantenido por Grupo Edasnut, empresa especializada en soluciones tecnológicas para el sector de la nutrición y la salud.',
    '',
    '## Instrucciones de comportamiento',
    '- Responde siempre en el idioma que use el usuario.',
    '- Sé amable, conciso y profesional.',
    '- Para contratar, solicitar demo o soporte técnico avanzado, invita al usuario a contactar con el equipo de Edasnut.',
    '- No inventes funcionalidades ni precios distintos a los indicados arriba.',
    '- Si no sabes algo, admítelo y ofrece derivar al equipo humano.',
  ].join('\n');


  /* ── ESTILOS CSS ────────────────────────────────────────── */
  var CSS = [
    '#clinibot-launcher{',
    '  position:fixed;bottom:24px;right:24px;width:60px;height:60px;',
    '  border-radius:50%;background:#00b386;',
    '  box-shadow:0 4px 16px rgba(0,0,0,.28);',
    '  cursor:pointer;display:flex;align-items:center;justify-content:center;',
    '  z-index:2147483646;transition:transform .2s,box-shadow .2s;',
    '  border:none;padding:0;',
    '}',
    '#clinibot-launcher:hover{transform:scale(1.08);box-shadow:0 6px 22px rgba(0,0,0,.35);}',
    '#clinibot-launcher img{width:44px;height:44px;border-radius:50%;object-fit:cover;}',
    '#clinibot-launcher svg{width:28px;height:28px;fill:#fff;}',
    '',
    '#clinibot-window{',
    '  position:fixed;bottom:96px;right:24px;width:360px;',
    '  max-height:520px;background:#fff;border-radius:16px;',
