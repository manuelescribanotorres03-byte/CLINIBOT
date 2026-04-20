(function () {
  'use strict';

  var API_KEY = 'AIzaSyBYwBCQbHtDWRN6Y7ZPz7Pm6ObeRnt7hX0';
  var BOT_NAME = 'CliniBOT';
  var COLOR = '#1a73e8';
  var AVATAR = 'https://manuelescribanotorres03-byte.github.io/CLINIBOT/clinibot-avatar.png.jpg';

  var SYSTEM_PROMPT = `
⚠️ REGLA DE IDIOMA — PRIORIDAD MÁXIMA
Detecta el idioma en que escribe el usuario. Responde SIEMPRE en ese mismo idioma, sin excepciones.
Esta regla prevalece sobre cualquier otra instrucción del sistema.

# ROL Y CONTEXTO
Eres el asistente virtual de CliniNut, software de gestión nutricional desarrollado por Grupo Edasnut. Ayudas a nutricionistas, dietistas y clínicas a entender el producto, resolver dudas y encontrar el plan adecuado para ellos.
No eres un bot genérico. Conoces CliniNut en profundidad y puedes razonar sobre qué solución encaja mejor según el perfil del usuario.

# NOMBRES PROPIOS — NO TRADUCIR NI MODIFICAR NUNCA
- ConnectIA (nunca "ConectarIA" ni variantes)
- MenuIA (nunca "MenúIA" ni variantes)
- TherapIA (nunca "TerapiaIA" ni variantes)
- CliniNut (nunca "Clininut" en minúscula)
- InfinitIA (nunca "InfiniteIA" ni variantes)
- Freemium (no traducir)

# NORMAS DE ESCRITURA — OBLIGATORIAS
- Detecta el idioma del usuario y responde siempre en ese mismo idioma.
- Escribe siempre con ortografía correcta. Sin faltas, sin palabras cortadas, sin frases incompletas.
- Nunca dejes una frase sin terminar. Si tienes que acortar, hazlo antes de empezar esa frase, nunca a la mitad.
- Escribe los correos siempre completos: info@edasnut.es
- Escribe los teléfonos siempre completos: 650 566 052
- No uses abreviaturas informales ni jerga.
- Nunca incluyas abreviaturas o códigos de documentos fuente (ej: PAG, T, pág.). Ignóralos.
- La palabra "planes" hace referencia exclusivamente a los planes de precios (Freemium, InfinitIA, Personalizado).
- Escribe siempre las palabras completas.

# NORMA ANTI-INVENCIÓN — OBLIGATORIA
Solo puedes mencionar información que esté explícitamente en este documento.
- No inventes precios, descuentos, funcionalidades ni condiciones que no estén aquí.
- Si no sabes algo con certeza, di: "No tengo esa información, pero el equipo de CliniNut puede ayudarte: info@edasnut.es o 650 566 052."

# CONOCIMIENTO DEL PRODUCTO

## ¿Qué es CliniNut?
Software de gestión nutricional con inteligencia artificial integrada. Permite gestionar pacientes, generar menús personalizados, comunicarse con pacientes y analizar síntomas clínicos, todo desde un mismo lugar.

## Los tres módulos de IA (exclusivos del plan InfinitIA)
- ConnectIA: Chat en tiempo real con pacientes, videollamadas con un clic e histórico completo de conversaciones.
- MenuIA: Generación automática de menús y propuestas nutricionales personalizadas y adaptadas a cada paciente.
- TherapIA: Asistente clínico inteligente. Analiza síntomas y propone protocolos integrativos y suplementación natural.

## Planes

Freemium — 0 €/mes
- Hasta 25 pacientes
- Menús básicos, agenda básica, consultas online, registro de pacientes, soporte por email
- Sin acceso a módulos de IA

Plan InfinitIA — 45 €/mes
- Todo lo del Freemium
- Pacientes ilimitados
- ConnectIA + MenuIA + TherapIA completos
- Soporte prioritario
- Garantía de devolución de 30 días
- Sin contrato de permanencia
- Descuento del 30% para colegiados (precio con descuento: 31,50 €/mes)

Plan Personalizado (multiclínica)
- Para clínicas con varios profesionales o múltiples usuarios
- Precio variable — contactar: info@edasnut.es | 650 566 052

# RECONOCIMIENTO DE INTENCIÓN

Perfil A — Explorador: No conoce CliniNut.
→ Explica qué es, qué lo diferencia, recomienda empezar con el Freemium.

Perfil B — Interesado en precio: Pregunta por costes o planes.
→ Explica ambos planes. Si menciona muchos pacientes o clínica, deriva al plan personalizado. Si es colegiado, informa del descuento del 30%.

Perfil C — Usuario técnico: Pregunta por funcionalidades concretas.
→ Responde con precisión. Si encajan con InfinitIA, menciónalo.

Perfil D — Listo para contratar: Pregunta cómo empezar.
→ Puede empezar gratis desde la web o contactar al equipo.

Perfil E — Con dudas u objeciones: Expresa inseguridad.
→ No presiones. Valida su duda y recuerda la garantía de 30 días.

# ASOCIACIÓN DE TEMAS
- MenuIA → menciona también TherapIA como complemento
- Precio → menciona la garantía de 30 días
- Pacientes ilimitados → Freemium tiene límite de 25, InfinitIA no
- Videollamadas → es ConnectIA, exclusivo del InfinitIA
- Seguridad de datos → RGPD, acceso exclusivo del profesional
- Clínica con varios usuarios → plan personalizado
- Colegiado → descuento 30% en InfinitIA (31,50 €/mes)

# MANEJO DE PREGUNTAS AMBIGUAS
- Pregunta vaga → pregunta qué es lo más importante para ellos.
- No sabes algo → no inventes. Deriva a info@edasnut.es o 650 566 052.
- Competencia → no compares. CliniNut se diferencia por sus tres módulos de IA propios.

# FLUJO DE CONVERSACIÓN
1. Saluda brevemente al inicio.
2. Responde de forma directa y concisa.
3. Anticipa preguntas siguientes y ofrécelas como opciones.
4. Cierra ofreciendo más ayuda.
5. Si el usuario se despide, termina con una frase breve y amable.

# TONO Y ESTILO
- Cercano pero profesional.
- Respuestas cortas por defecto. Si el usuario quiere más detalle, amplía.
- Nunca uses tecnicismos innecesarios.
- Máximo un emoji por mensaje si aporta claridad.

# CONTACTO
- Email: info@edasnut.es
- Teléfono: 650 566 052
- Dirección: C/ Comunidad de Madrid 41, Local 1 — Las Rozas de Madrid
- Formulario: sección "Contacta con nosotros" en la web de CliniNut
`;

  var history = [];
  var isOpen = false;

  var css = `
    #cbot-bubble {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px;
      background: ` + COLOR + `;
      border-radius: 50%; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999; transition: transform 0.2s;
    }
    #cbot-bubble:hover { transform: scale(1.08); }
    #cbot-bubble svg { width: 28px; height: 28px; fill: white; }

    #cbot-window {
      position: fixed; bottom: 90px; right: 24px;
      width: 360px; height: 520px;
      background: white; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      overflow: hidden; z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #cbot-header {
      background: ` + COLOR + `;
      color: white; padding: 12px 16px;
      display: flex; align-items: center; gap: 10px;
    }
    #cbot-header-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      overflow: hidden; background: white; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    #cbot-header-avatar img { width: 100%; height: 100%; object-fit: cover; }
    #cbot-header-info { flex: 1; }
    #cbot-header-title { font-weight: 600; font-size: 15px; }
    #cbot-header-sub { font-size: 12px; opacity: 0.85; margin-top: 1px; }
    #cbot-close {
      background: none; border: none; color: white;
      font-size: 22px; cursor: pointer; line-height: 1; padding: 0;
    }

    #cbot-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      background: #f5f7fa;
    }
    #cbot-messages::-webkit-scrollbar { width: 4px; }
    #cbot-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

    .cbot-row {
      display: flex; align-items: flex-end; gap: 8px;
    }
    .cbot-row-user { justify-content: flex-end; }
    .cbot-row-bot { justify-content: flex-start; }
    .cbot-row-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      overflow: hidden; flex-shrink: 0; background: #e8f5e9;
    }
    .cbot-row-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .cbot-msg {
      max-width: 78%; padding: 10px 14px;
      border-radius: 16px; font-size: 14px; line-height: 1.6;
      word-wrap: break-word;
    }
    .cbot-bot {
      background: white; border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      color: #1a1a1a;
    }
    .cbot-bot strong { font-weight: 600; color: #111; }
    .cbot-bot ul { margin: 6px 0 6px 16px; padding: 0; }
    .cbot-bot ol { margin: 6px 0 6px 16px; padding: 0; }
    .cbot-bot li { margin-bottom: 3px; }
    .cbot-bot p { margin: 4px 0; }
    .cbot-user {
      background: ` + COLOR + `; color: white;
      border-bottom-right-radius: 4px;
    }

    .cbot-typing {
      display: flex; gap: 5px;
      padding: 12px 14px; align-items: center;
    }
    .cbot-typing span {
      width: 7px; height: 7px; background: #bbb;
      border-radius: 50%; animation: cbotBounce 1.2s infinite;
    }
    .cbot-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cbot-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cbotBounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-7px); }
    }

    #cbot-input-area {
      padding: 10px 12px; border-top: 1px solid #eee;
      display: flex; gap: 8px; align-items: center; background: white;
    }
    #cbot-input {
      flex: 1; border: 1px solid #ddd; border-radius: 24px;
      padding: 9px 16px; font-size: 14px; outline: none;
      font-family: inherit;
    }
    #cbot-input:focus { border-color: ` + COLOR + `; }
    #cbot-send {
      width: 38px; height: 38px; min-width: 38px;
      background: ` + COLOR + `; border: none; border-radius: 50%;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    #cbot-send:disabled { opacity: 0.5; cursor: default; }
    #cbot-send svg { width: 17px; height: 17px; fill: white; }

    @media (max-width: 480px) {
      #cbot-window {
        width: calc(100vw - 16px); right: 8px;
        bottom: 80px; height: 72vh;
      }
    }
  `;

  function init() {
    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    var bubble = document.createElement('div');
    bubble.id = 'cbot-bubble';
    bubble.setAttribute('aria-label', 'Abrir chat');
    bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
    document.body.appendChild(bubble);

    var win = document.createElement('div');
    win.id = 'cbot-window';
    win.style.display = 'none';
    win.innerHTML =
      '<div id="cbot-header">' +
        '<div id="cbot-header-avatar"><img src="' + AVATAR + '" alt="CliniBOT"></div>' +
        '<div id="cbot-header-info">' +
          '<div id="cbot-header-title">' + BOT_NAME + '</div>' +
          '<div id="cbot-header-sub">Asistente virtual de CliniNut</div>' +
        '</div>' +
        '<button id="cbot-close" aria-label="Cerrar chat">&#x2715;</button>' +
      '</div>' +
      '<div id="cbot-messages"></div>' +
      '<div id="cbot-input-area">' +
        '<input id="cbot-input" type="text" placeholder="Escribe tu pregunta..." autocomplete="off" />' +
        '<button id="cbot-send" aria-label="Enviar">' +
          '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>';
    document.body.appendChild(win);

    bubble.addEventListener('click', toggleChat);
    document.getElementById('cbot-close').addEventListener('click', toggleChat);
    document.getElementById('cbot-send').addEventListener('click', handleSend);
    document.getElementById('cbot-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    addMessage('bot', '¡Hola! Soy CliniBOT, el asistente virtual de CliniNut. ¿En qué puedo ayudarte?');
  }

  function toggleChat() {
    isOpen = !isOpen;
    document.getElementById('cbot-window').style.display = isOpen ? 'flex' : 'none';
    if (isOpen) document.getElementById('cbot-input').focus();
  }

  function renderMarkdown(text) {
    var lines = text.split('\n');
    var html = '';
    var inUl = false, inOl = false;
    lines.forEach(function(line) {
      var escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (/^[\*\-]\s+/.test(line)) {
        if (!inUl) { if (inOl) { html += '</ol>'; inOl = false; } html += '<ul>'; inUl = true; }
        html += '<li>' + escaped.replace(/^[\*\-]\s+/, '') + '</li>';
      } else if (/^\d+\.\s+/.test(line)) {
        if (!inOl) { if (inUl) { html += '</ul>'; inUl = false; } html += '<ol>'; inOl = true; }
        html += '<li>' + escaped.replace(/^\d+\.\s+/, '') + '</li>';
      } else {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        html += line.trim() ? '<p>' + escaped + '</p>' : '<br>';
      }
    });
    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';
    return html;
  }

  function addMessage(role, text) {
    var msgs = document.getElementById('cbot-messages');
    var row = document.createElement('div');
    row.className = 'cbot-row cbot-row-' + role;
    var bubble = document.createElement('div');
    bubble.className = 'cbot-msg cbot-' + role;
    if (role === 'bot') {
      var avatarDiv = document.createElement('div');
      avatarDiv.className = 'cbot-row-avatar';
      avatarDiv.innerHTML = '<img src="' + AVATAR + '" alt="">';
      row.appendChild(avatarDiv);
      bubble.innerHTML = renderMarkdown(text);
    } else {
      bubble.textContent = text;
    }
    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return row;
  }

  function addTyping() {
    var msgs = document.getElementById('cbot-messages');
    var row = document.createElement('div');
    row.className = 'cbot-row cbot-row-bot';
    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'cbot-row-avatar';
    avatarDiv.innerHTML = '<img src="' + AVATAR + '" alt="">';
    var div = document.createElement('div');
    div.className = 'cbot-msg cbot-bot cbot-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    row.appendChild(avatarDiv);
    row.appendChild(div);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return row;
  }

  function handleSend() {
    var input = document.getElementById('cbot-input');
    var text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.disabled = true;
    document.getElementById('cbot-send').disabled = true;

    addMessage('user', text);
    var typing = addTyping();

    callGemini(text).then(function (reply) {
      typing.remove();
      addMessage('bot', reply);
    }).catch(function () {
      typing.remove();
      addMessage('bot', 'Ha ocurrido un error. Puedes contactarnos en info@edasnut.es o llamar al 650 566 052.');
    }).finally(function () {
      input.disabled = false;
      document.getElementById('cbot-send').disabled = false;
      input.focus();
    });
  }

  function callGemini(userText) {
    history.push({ role: 'user', parts: [{ text: userText }] });

    return fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: history,
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
        })
      }
    ).then(function (res) {
      if (!res.ok) throw new Error('API error ' + res.status);
      return res.json();
    }).then(function (data) {
      var reply = data.candidates[0].content.parts[0].text;
      history.push({ role: 'model', parts: [{ text: reply }] });
      return reply;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
