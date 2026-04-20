/* =========================================================
   CliniBOT — Chatbot embebible para CliniNut / Grupo Edasnut
   Uso: <script src="clinibot.js"></script>
   ========================================================= */
(function () {
  'use strict';

  /* ── CONFIGURACIÓN ──────────────────────────────────────── */
  var API_KEY = 'AIzaSyBYwBCQbHtDWRN6Y7ZPz7Pm6ObeRnt7hX0';
  /* Modelos a intentar en orden (fallback automático) */
  var MODELS = [
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
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
    '  box-shadow:0 8px 32px rgba(0,0,0,.18);',
    '  display:flex;flex-direction:column;z-index:2147483647;',
    '  overflow:hidden;',
    "  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;",
    '  transition:opacity .2s,transform .2s;',
    '}',
    '#clinibot-window.cb-hidden{opacity:0;pointer-events:none;transform:translateY(14px);}',
    '',
    '#clinibot-header{',
    '  background:linear-gradient(135deg,#00b386 0%,#008f6e 100%);',
    '  padding:14px 16px;display:flex;align-items:center;gap:10px;color:#fff;',
    '}',
    '#clinibot-header img{',
    '  width:36px;height:36px;border-radius:50%;object-fit:cover;',
    '  border:2px solid rgba(255,255,255,.4);flex-shrink:0;',
    '}',
    '#clinibot-header-text h3{margin:0;font-size:15px;font-weight:600;}',
    '#clinibot-header-text p{margin:2px 0 0;font-size:11px;opacity:.85;}',
    '#clinibot-close{',
    '  margin-left:auto;background:none;border:none;color:#fff;',
    '  font-size:20px;cursor:pointer;line-height:1;padding:4px;opacity:.8;',
    '}',
    '#clinibot-close:hover{opacity:1;}',
    '',
    '#clinibot-messages{',
    '  flex:1;overflow-y:auto;padding:16px;',
    '  display:flex;flex-direction:column;gap:12px;background:#f7f9fb;',
    '}',
    '.cb-msg{',
    '  max-width:84%;padding:10px 14px;border-radius:14px;',
    '  font-size:14px;line-height:1.55;word-break:break-word;',
    '}',
    '.cb-msg.cb-bot{',
    '  background:#fff;color:#1a1a2e;',
    '  border:1px solid #e4eaef;border-bottom-left-radius:4px;align-self:flex-start;',
    '}',
    '.cb-msg.cb-user{',
    '  background:#00b386;color:#fff;',
    '  border-bottom-right-radius:4px;align-self:flex-end;',
    '}',
    '.cb-msg.cb-error{background:#fff3f3;color:#c0392b;border:1px solid #f5c6c6;}',
    '.cb-msg b,.cb-msg strong{font-weight:700;}',
    '.cb-msg em{font-style:italic;}',
    '.cb-msg ul,.cb-msg ol{margin:6px 0;padding-left:20px;}',
    '.cb-msg li{margin:3px 0;}',
    '.cb-msg p{margin:0 0 6px;}',
    '.cb-msg p:last-child{margin-bottom:0;}',
    '',
    '.cb-typing{display:flex;gap:5px;align-items:center;padding:10px 14px;}',
    '.cb-typing span{',
    '  width:7px;height:7px;background:#00b386;border-radius:50%;',
    '  animation:cbBounce 1.2s infinite;',
    '}',
    '.cb-typing span:nth-child(2){animation-delay:.2s;}',
    '.cb-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes cbBounce{',
    '  0%,80%,100%{transform:translateY(0);opacity:.5;}',
    '  40%{transform:translateY(-6px);opacity:1;}',
    '}',
    '',
    '#clinibot-input-area{',
    '  display:flex;gap:8px;padding:12px 14px;',
    '  border-top:1px solid #e4eaef;background:#fff;',
    '}',
    '#clinibot-input{',
    '  flex:1;border:1px solid #cdd5dc;border-radius:20px;',
    '  padding:9px 14px;font-size:14px;outline:none;',
    '  resize:none;font-family:inherit;max-height:80px;',
    '  overflow-y:auto;transition:border-color .15s;line-height:1.4;',
    '}',
    '#clinibot-input:focus{border-color:#00b386;}',
    '#clinibot-send{',
    '  width:38px;height:38px;min-width:38px;background:#00b386;border:none;',
    '  border-radius:50%;cursor:pointer;display:flex;',
    '  align-items:center;justify-content:center;',
    '  transition:background .15s;align-self:flex-end;',
    '}',
    '#clinibot-send:hover{background:#009970;}',
    '#clinibot-send:disabled{background:#a8d8cc;cursor:not-allowed;}',
    '#clinibot-send svg{width:18px;height:18px;fill:#fff;}',
    '#clinibot-footer{',
    '  text-align:center;font-size:10px;color:#b0bac3;',
    '  padding:4px 0 8px;background:#fff;',
    '}',
    '@media(max-width:420px){',
    '  #clinibot-window{width:calc(100vw - 32px);right:16px;bottom:88px;}',
    '  #clinibot-launcher{right:16px;bottom:16px;}',
    '}',
  ].join('\n');

  /* ── RENDERIZADOR DE MARKDOWN (ligero, sin dependencias) ── */
  function renderMarkdown(raw) {
    /* 1. Escapar HTML */
    var s = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    /* 2. Negrita e itálica */
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
    s = s.replace(/_([^_\n]+?)_/g, '<em>$1</em>');

    /* 3. Listas (guión o asterisco al inicio de línea) */
    var lines = s.split('\n');
    var out = [];
    var inList = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var lm = line.match(/^[ \t]*[-*]\s+(.+)/);
      if (lm) {
        if (!inList) { out.push('<ul>'); inList = true; }
        out.push('<li>' + lm[1] + '</li>');
      } else {
        if (inList) { out.push('</ul>'); inList = false; }
        if (line.trim() === '') {
          out.push('');
        } else {
          out.push('<p>' + line + '</p>');
        }
      }
    }
    if (inList) out.push('</ul>');

    return out.join('').replace(/<p><\/p>/g, '');
  }

  /* ── HISTORIAL DE CONVERSACIÓN ──────────────────────────── */
  var history = [];

  /* ── LLAMADA A LA API DE GEMINI ─────────────────────────── */
  async function askGemini(userText) {
    history.push({ role: 'user', parts: [{ text: userText }] });

    var payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: history,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    var lastErr = null;

    for (var i = 0; i < MODELS.length; i++) {
      var url =
        'https://generativelanguage.googleapis.com/v1beta/models/' +
        MODELS[i] +
        ':generateContent?key=' +
        API_KEY;

      try {
        var resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (resp.status === 403) {
          /* 403 no mejora con otro modelo — salir del bucle */
          var errJson = await resp.json().catch(function () { return {}; });
          lastErr = { status: 403, detail: errJson };
          break;
        }

        if (!resp.ok) {
          lastErr = { status: resp.status };
          continue; /* probar siguiente modelo */
        }

        var data = await resp.json();
        var text =
          (data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text) ||
          '(Respuesta vacía)';

        history.push({ role: 'model', parts: [{ text: text }] });
        return { ok: true, text: text };
      } catch (fetchErr) {
        lastErr = { status: 0, detail: fetchErr };
      }
    }

    /* Gestión de errores */
    if (lastErr && lastErr.status === 403) {
      return {
        ok: false,
        text: [
          '**Error 403 — Acceso denegado a la IA**',
          '',
          'El chatbot no puede conectar con Google Gemini. Causas habituales:',
          '- La API key tiene restricciones de *referrer* en Google Cloud Console que bloquean este dominio.',
          '- La API **"Generative Language API"** no está habilitada en el proyecto de Google Cloud.',
          '- El proyecto no tiene facturación configurada (necesaria aunque el tier gratuito exista).',
          '',
          'Solución: accede a **console.cloud.google.com**, revisa la API key y habilita la Generative Language API.',
        ].join('\n'),
      };
    }

    return {
      ok: false,
      text: '**Error de conexión**\n\nNo se pudo contactar con el asistente. Comprueba tu conexión e inténtalo de nuevo.',
    };
  }

  /* ── CONSTRUCCIÓN DE LA INTERFAZ ────────────────────────── */
  function buildUI() {
    /* Inyectar estilos */
    var styleEl = document.createElement('style');
    styleEl.id = 'clinibot-styles';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    /* Botón lanzador */
    var launcher = document.createElement('button');
    launcher.id = 'clinibot-launcher';
    launcher.setAttribute('aria-label', 'Abrir CliniBOT');
    launcher.title = 'CliniBOT — Asistente de CliniNut';

    var launcherImg = document.createElement('img');
    launcherImg.src = AVATAR_URL;
    launcherImg.alt = 'CliniBOT';
    launcherImg.onerror = function () {
      this.remove();
      launcher.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13H11v-4h2v4zm0-6H11V7h2v2z"/></svg>';
    };
    launcher.appendChild(launcherImg);

    /* Ventana del chat */
    var chatWin = document.createElement('div');
    chatWin.id = 'clinibot-window';
    chatWin.className = 'cb-hidden';
    chatWin.setAttribute('role', 'dialog');
    chatWin.setAttribute('aria-label', 'Chat CliniBOT');

    chatWin.innerHTML =
      '<div id="clinibot-header">' +
        '<img src="' + AVATAR_URL + '" alt="CliniBOT" onerror="this.style.display=\'none\'">' +
        '<div id="clinibot-header-text">' +
          '<h3>CliniBOT</h3>' +
          '<p>Asistente de CliniNut &middot; Grupo Edasnut</p>' +
        '</div>' +
        '<button id="clinibot-close" title="Cerrar" aria-label="Cerrar chat">&#x2715;</button>' +
      '</div>' +
      '<div id="clinibot-messages" role="log" aria-live="polite"></div>' +
      '<div id="clinibot-input-area">' +
        '<textarea id="clinibot-input" placeholder="Escribe tu pregunta..." rows="1" aria-label="Mensaje"></textarea>' +
        '<button id="clinibot-send" title="Enviar" aria-label="Enviar mensaje">' +
          '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>' +
      '<div id="clinibot-footer">CliniBOT &mdash; Grupo Edasnut</div>';

    document.body.appendChild(launcher);
    document.body.appendChild(chatWin);

    var msgsEl  = document.getElementById('clinibot-messages');
    var inputEl = document.getElementById('clinibot-input');
    var sendBtn = document.getElementById('clinibot-send');

    /* Mensaje de bienvenida */
    addBotMessage(
      '¡Hola! 👋 Soy **CliniBOT**, el asistente de **CliniNut**.\n\n' +
      '¿En qué puedo ayudarte? Puedo explicarte nuestros planes, funcionalidades o módulos de IA.'
    );

    /* ── Helpers de UI ─── */
    function scrollBottom() {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function addBotMessage(text, isError) {
      var div = document.createElement('div');
      div.className = 'cb-msg cb-bot' + (isError ? ' cb-error' : '');
      div.innerHTML = renderMarkdown(text);
      msgsEl.appendChild(div);
      scrollBottom();
      return div;
    }

    function addUserMessage(text) {
      var div = document.createElement('div');
      div.className = 'cb-msg cb-user';
      div.textContent = text;
      msgsEl.appendChild(div);
      scrollBottom();
    }

    function showTyping() {
      var div = document.createElement('div');
      div.className = 'cb-msg cb-bot cb-typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      msgsEl.appendChild(div);
      scrollBottom();
      return div;
    }

    /* ── Envío de mensaje ─── */
    async function sendMessage() {
      var text = inputEl.value.trim();
      if (!text || sendBtn.disabled) return;

      inputEl.value = '';
      inputEl.style.height = 'auto';
      sendBtn.disabled = true;

      addUserMessage(text);
      var typingEl = showTyping();

      var result = await askGemini(text);

      typingEl.remove();
      addBotMessage(result.text, !result.ok);
      sendBtn.disabled = false;
      inputEl.focus();
    }

    /* ── Eventos ─── */
    launcher.addEventListener('click', function () {
      var hidden = chatWin.classList.contains('cb-hidden');
      chatWin.classList.toggle('cb-hidden');
      if (hidden) inputEl.focus();
    });

    document.getElementById('clinibot-close').addEventListener('click', function () {
      chatWin.classList.add('cb-hidden');
      launcher.focus();
    });

    sendBtn.addEventListener('click', sendMessage);

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    /* Auto-resize del textarea */
    inputEl.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });
  }

  /* ── INICIALIZACIÓN ─────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
