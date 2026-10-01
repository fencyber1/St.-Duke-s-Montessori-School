/* ==========================================================================
   St. Duke's Montessori School — Site JavaScript
   Vanilla JS · no dependencies
   ========================================================================== */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);

  /* ---------- Announcement / demo notice ---------- */
  if (params.get("submitted") === "1") {
    window.addEventListener("DOMContentLoaded", function () {
      var target = document.querySelector("[data-form-success-anchor]");
      if (target) {
        var el = target.querySelector(".form-success");
        if (el) el.classList.add("show");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initMobileNav();
    initReveal();
    initCounters();
    initSliders();
    initFaq();
    initLightbox();
    initCountdowns();
    initForms();
    initBackToTop();
    initChat();
    markCurrentDay();
  });

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;

    var closeNav = function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setIcon(false);
    };
    var setIcon = function (open) {
      toggle.innerHTML = open
        ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    };

    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      setIcon(open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target === nav || e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var run = function (el) {
      var end = parseFloat(el.getAttribute("data-count"));
      var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      if (reduced) { el.firstChild.textContent = end.toFixed(decimals); return; }
      var dur = 1800;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.firstChild.textContent = (end * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) {
      el.firstChild.textContent = "0";
      io.observe(el);
    });
  }

  /* ---------- Testimonial sliders ---------- */
  function initSliders() {
    document.querySelectorAll("[data-slider]").forEach(function (slider) {
      var slides = slider.querySelectorAll(".testimonial-card");
      var dotsWrap = slider.querySelector(".t-dots");
      var prev = slider.querySelector("[data-prev]");
      var next = slider.querySelector("[data-next]");
      if (!slides.length || !dotsWrap) return;

      var index = 0;
      var timer = null;

      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "t-dot" + (i === 0 ? " active" : "");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", function () { go(i); restart(); });
        dotsWrap.appendChild(dot);
      });
      var dots = dotsWrap.querySelectorAll(".t-dot");

      var go = function (i) {
        slides[index].classList.remove("active");
        dots[index].classList.remove("active");
        index = (i + slides.length) % slides.length;
        slides[index].classList.add("active");
        dots[index].classList.add("active");
      };
      var restart = function () {
        if (timer) clearInterval(timer);
        timer = setInterval(function () { go(index + 1); }, 6500);
      };

      if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
      if (next) next.addEventListener("click", function () { go(index + 1); restart(); });

      slider.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
      slider.addEventListener("mouseleave", restart);
      restart();
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function initLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (!items.length) return;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML =
      '<button class="lightbox-prev" aria-label="Previous photo"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<img src="" alt="">' +
      '<button class="lightbox-next" aria-label="Next photo"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<div class="lightbox-cap"></div>' +
      '<button class="lightbox-close" aria-label="Close photo viewer"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.appendChild(lb);

    var img = lb.querySelector("img");
    var cap = lb.querySelector(".lightbox-cap");
    var current = 0;

    var show = function (i) {
      current = (i + items.length) % items.length;
      var src = items[current].querySelector("img").getAttribute("src");
      img.setAttribute("src", src);
      img.setAttribute("alt", items[current].querySelector("img").getAttribute("alt") || "");
      cap.textContent = items[current].getAttribute("data-caption") || "";
    };
    var open = function (i) {
      show(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lightbox-close").focus();
    };
    var close = function () {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    };

    items.forEach(function (item, i) {
      item.addEventListener("click", function () { open(i); });
    });
    lb.querySelector(".lightbox-close").addEventListener("click", close);
    lb.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
    lb.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Countdown to application deadline ---------- */
  function initCountdowns() {
    var els = document.querySelectorAll("[data-countdown]");
    if (!els.length) return;
    var deadline = new Date("2027-02-15T23:59:59");

    var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
    var tick = function () {
      var diff = deadline - new Date();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor(diff % 86400000 / 3600000);
      var m = Math.floor(diff % 3600000 / 60000);
      var s = Math.floor(diff % 60000 / 1000);
      els.forEach(function (el) {
        var t = {
          days: d, hours: pad(h), minutes: pad(m), seconds: pad(s)
        };
        el.querySelectorAll("[data-unit]").forEach(function (u) {
          u.textContent = t[u.getAttribute("data-unit")];
        });
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Forms (validation + simulated submission) ---------- */
  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;

        form.querySelectorAll("[required]").forEach(function (input) {
          var field = input.closest(".form-field") || input.closest(".consent");
          var ok = true;
          if (input.type === "checkbox") {
            ok = input.checked;
          } else if (input.type === "email") {
            ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
          } else if (input.type === "tel") {
            ok = input.value.replace(/[^\d]/g, "").length >= 7;
          } else {
            ok = input.value.trim().length > 0;
          }
          if (field) field.classList.toggle("invalid", !ok);
          if (!ok) valid = false;
        });

        if (!valid) {
          var firstBad = form.querySelector(".invalid input, .invalid select");
          if (firstBad) firstBad.focus();
          return;
        }

        var btn = form.querySelector("[type=submit]");
        var original = btn ? btn.innerHTML : "";
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = "Sending&hellip;";
        }

        /* Persist the lead locally so follow-up demos can read it back. */
        try {
          var data = {};
          new FormData(form).forEach(function (v, k) { data[k] = v; });
          data.page = document.title;
          data.at = new Date().toISOString();
          var leads = JSON.parse(localStorage.getItem("stdukes_leads") || "[]");
          leads.push(data);
          localStorage.setItem("stdukes_leads", JSON.stringify(leads));
        } catch (err) { /* storage unavailable — continue */ }

        setTimeout(function () {
          form.style.display = "none";
          var success = form.parentElement.querySelector(".form-success");
          if (success) {
            success.classList.add("show");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
        }, 900);
      });

      form.querySelectorAll("[required]").forEach(function (input) {
        input.addEventListener("input", function () {
          var field = input.closest(".form-field") || input.closest(".consent");
          if (field) field.classList.remove("invalid");
        });
      });
    });
  }

  /* ---------- Back to top + call FAB visibility ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    var onScroll = function () {
      btn.classList.toggle("show", window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  /* ---------- Highlight today in opening-hours tables ---------- */
  function markCurrentDay() {
    var today = new Date().getDay(); // 0 = Sunday
    var map = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "sun" };
    var row = document.querySelector('[data-day="' + map[today] + '"]');
    if (row) row.style.fontWeight = "800";
    if (row) row.style.color = "var(--green)";
  }

  /* ---------- Chat assistant ---------- */
  function initChat() {
    var fab = document.querySelector(".chat-fab");
    var panel = document.querySelector(".chat-panel");
    if (!fab || !panel) return;

    var body = panel.querySelector(".chat-body");
    var input = panel.querySelector(".chat-input input");
    var sendBtn = panel.querySelector(".chat-input button");
    var closeBtn = panel.querySelector(".chat-close");
    var quickWrap = panel.querySelector(".chat-quick");

    var scrollDown = function () { body.scrollTop = body.scrollHeight; };

    var addMsg = function (html, who) {
      var div = document.createElement("div");
      div.className = "chat-msg " + who;
      div.innerHTML = html;
      body.appendChild(div);
      scrollDown();
    };

    var botReply = function (html) {
      var typing = document.createElement("div");
      typing.className = "chat-msg bot chat-typing";
      typing.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(typing);
      scrollDown();
      setTimeout(function () {
        typing.remove();
        addMsg(html, "bot");
      }, 700);
    };

    var PHONE_LINK = '<a href="tel:+15552047788">📞 (555) 204-7788</a>';

    var answers = [
      {
        keys: ["fee", "fees", "tuition", "cost", "price", "pay", "expensive", "scholar", "discount"],
        text: "Great question! Tuition ranges from <strong>$2,450–$3,050 per term</strong> depending on the programme, with a <strong>10% sibling discount</strong> and need-based bursaries available. You can see the full fee schedule below.",
        links: [{ href: "admissions.html#fees", label: "View full fee schedule →" }]
      },
      {
        keys: ["age", "ages", "old", "program", "programme", "class", "grade", "toddler", "kindergarten", "elementary", "curriculum"],
        text: "We welcome children from <strong>18 months to 12 years</strong>: Toddler Community (18m–3y), Children's House (3–6y), Lower Elementary (6–9y) and Upper Elementary (9–12y). Each follows the authentic Montessori curriculum.",
        links: [{ href: "programs.html", label: "Explore programmes →" }]
      },
      {
        keys: ["tour", "visit", "see", "open house", "open day", "look around", "campus"],
        text: "We'd love to show you around! Private campus tours run <strong>Tuesdays & Thursdays at 9:30am</strong>, and our next big Open House is <strong>Saturday, November 14, 2026</strong>.",
        links: [{ href: "contact.html#tour", label: "Book a tour →" }]
      },
      {
        keys: ["apply", "application", "enroll", "enrol", "admission", "register", "join", "spot", "place", "space"],
        text: "Wonderful — we'd love to meet your family! Applying takes about <strong>10 minutes</strong>: book a tour, submit the online application ($50), then a relaxed family interview. <strong>Only 18 places remain for 2027/28</strong> and applications close Feb 15, 2027.",
        links: [{ href: "admissions.html#apply", label: "Start your application →" }]
      },
      {
        keys: ["safe", "safety", "secure", "security", "cctv", "pick"],
        text: "Your child's safety is our first promise: a secured single-entry campus, CCTV in all common areas, strict sign-in/out for pick-ups, and every staff member is background-checked and first-aid certified.",
        links: [{ href: "facilities.html", label: "See our campus →" }]
      },
      {
        keys: ["hour", "time", "open", "close", "when", "schedule", "day"],
        text: "School hours are <strong>Mon–Fri, 8:00am–3:30pm</strong>, with early drop-off from 7:30am and after-care until 5:30pm.",
        links: [{ href: "contact.html", label: "Contact & hours →" }]
      },
      {
        keys: ["food", "meal", "lunch", "snack", "menu", "eat"],
        text: "Yes — a hot, freshly prepared lunch plus two healthy snacks are included daily, planned by our school nutritionist. Allergy-aware menus are always available."
      },
      {
        keys: ["teacher", "ratio", "staff", "qualified", "class size"],
        text: "Our classes average a warm <strong>12:1 student-to-teacher ratio</strong>, led by AMI/AMS-certified Montessori guides — many with 10+ years of experience."
      },
      {
        keys: ["contact", "phone", "call", "email", "whatsapp", "human", "person", "talk"],
        text: "You can reach our admissions team right now: " + PHONE_LINK + " · or email <strong>admissions@stdukes.edu</strong>. We reply within one school day.",
        links: [{ href: "https://wa.me/15552047788", label: "Chat on WhatsApp →" }]
      }
    ];

    var fallback = function () {
      botReply("Happy to help! I can answer questions about <strong>fees, programmes & ages, safety, meals, hours, tours and admissions</strong> — or tap " + PHONE_LINK + " to speak with our admissions team right away.");
    };

    var answer = function (raw) {
      var text = raw.toLowerCase();
      for (var i = 0; i < answers.length; i++) {
        for (var j = 0; j < answers[i].keys.length; j++) {
          if (text.indexOf(answers[i].keys[j]) !== -1) {
            var a = answers[i];
            var html = a.text;
            if (a.links) {
              html += '<span class="msg-links">';
              a.links.forEach(function (l) { html += '<a href="' + l.href + '">' + l.label + "</a>"; });
              html += "</span>";
            }
            botReply(html);
            return;
          }
        }
      }
      fallback();
    };

    var openChat = function (first) {
      panel.classList.add("open");
      fab.classList.add("hide");
      fab.setAttribute("aria-expanded", "true");
      if (first) {
        setTimeout(function () {
          addMsg("Hello, and welcome to <strong>St. Duke's Montessori</strong>! I'm Duke, your admissions helper. Ask me anything — or tap a topic below.", "bot");
        }, 350);
      }
      setTimeout(function () { input.focus(); }, 420);
    };
    var closeChat = function () {
      panel.classList.remove("open");
      fab.classList.remove("hide");
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
    };

    fab.addEventListener("click", function () {
      var first = !panel.dataset.greeted;
      if (first) panel.dataset.greeted = "1";
      openChat(first);
    });
    closeBtn.addEventListener("click", closeChat);

    var send = function () {
      var v = input.value.trim();
      if (!v) return;
      addMsg(v.replace(/</g, "&lt;"), "user");
      input.value = "";
      answer(v);
    };
    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); send(); }
    });

    quickWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (!btn) return;
      addMsg(btn.textContent.trim(), "user");
      answer(btn.getAttribute("data-q"));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) closeChat();
    });
  }
})();
