/* ==========================================================================
   EvolVIT — apply page
   Front-end only: validation, character counters, a local draft, and a
   success state. Nothing is sent anywhere; see README for wiring it up.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("applyForm");
  if (!form) return;

  var success = document.getElementById("success");
  var recap = document.getElementById("recap");
  var status = document.getElementById("status");
  var clearBtn = document.getElementById("clearBtn");
  var againBtn = document.getElementById("againBtn");
  var DRAFT_KEY = "evolvit.apply.draft";

  /* ---------- helpers ---------- */
  function fieldOf(input) { return input.closest(".field"); }

  function setInvalid(input, invalid) {
    var field = fieldOf(input);
    if (!field) return;
    field.classList.toggle("is-invalid", invalid);
    input.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function validate(input) {
    var value = (input.value || "").trim();
    var ok = true;

    if (input.type === "checkbox") {
      ok = !input.required || input.checked;
    } else if (input.required && !value) {
      ok = false;
    } else if (input.type === "email" && value) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    } else if (input.type === "tel" && value) {
      ok = /^[0-9]{10}$/.test(value.replace(/[\s()+-]/g, ""));
    } else if (input.type === "url" && value) {
      ok = /^https?:\/\/.+\..+/.test(value);
    } else if (input.id === "why" && value) {
      ok = value.length >= 40;
    }

    setInvalid(input, !ok);
    return ok;
  }

  var inputs = Array.prototype.slice.call(
    form.querySelectorAll("input, select, textarea")
  );

  inputs.forEach(function (input) {
    var ev = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "blur";
    input.addEventListener(ev, function () {
      // Only re-validate fields the user has actually engaged with
      if (input.required || (input.value || "").trim()) validate(input);
    });
    input.addEventListener("input", function () {
      if (fieldOf(input) && fieldOf(input).classList.contains("is-invalid")) validate(input);
      saveDraft();
    });
    if (input.type === "checkbox" || input.tagName === "SELECT") {
      input.addEventListener("change", saveDraft);
    }
  });

  /* ---------- character counters ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-count-for]"), function (out) {
    var target = document.getElementById(out.getAttribute("data-count-for"));
    if (!target) return;
    var sync = function () { out.textContent = String(target.value.length); };
    target.addEventListener("input", sync);
    sync();
  });

  /* ---------- local draft (this browser only) ---------- */
  var saveTimer;
  function saveDraft() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        var data = {};
        inputs.forEach(function (input) {
          if (input.type === "checkbox") {
            if (input.name === "skills") {
              data.skills = data.skills || [];
              if (input.checked) data.skills.push(input.value);
            } else {
              data[input.name] = input.checked;
            }
          } else if (input.name) {
            data[input.name] = input.value;
          }
        });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        if (status) { status.classList.remove("is-warn"); status.textContent = "Draft saved in this browser"; }
      } catch (e) { /* private mode or storage blocked — no draft, no problem */ }
    }, 400);
  }

  function loadDraft() {
    var raw;
    try { raw = localStorage.getItem(DRAFT_KEY); } catch (e) { return; }
    if (!raw) return;

    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }

    inputs.forEach(function (input) {
      if (!input.name || !(input.name in data)) return;
      if (input.type === "checkbox") {
        if (input.name === "skills") {
          input.checked = Array.isArray(data.skills) && data.skills.indexOf(input.value) !== -1;
        } else {
          input.checked = Boolean(data[input.name]);
        }
      } else {
        input.value = data[input.name];
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-count-for]"), function (out) {
      var target = document.getElementById(out.getAttribute("data-count-for"));
      if (target) out.textContent = String(target.value.length);
    });

    if (status) status.textContent = "Draft restored from this browser";
  }

  function dropDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* nothing to clear */ }
  }

  loadDraft();

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstBad = null;
    inputs.forEach(function (input) {
      if (input.type === "checkbox" && input.name === "skills") return;
      if (!validate(input) && !firstBad) firstBad = input;
    });

    if (firstBad) {
      status.textContent = "Some fields need a look";
      status.classList.add("is-warn");
      firstBad.focus();
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    status.textContent = "";
    status.classList.remove("is-warn");

    // Build the recap
    var skills = Array.prototype.slice
      .call(form.querySelectorAll("input[name='skills']:checked"))
      .map(function (c) { return c.value; });

    var rows = [
      ["Name", form.name.value.trim()],
      ["Registration", form.reg.value.trim()],
      ["Email", form.email.value.trim()],
      ["Year", form.year.value],
      ["Branch", form.branch.value.trim()],
      ["First team", form.team1.value],
      ["Second team", form.team2.value || "—"],
      ["Skills", skills.length ? skills.join(", ") : "—"],
      ["Weekly time", form.hours.value],
      ["Internship track", form.internship.checked ? "Yes, count me in" : "Not this time"]
    ];

    recap.innerHTML = "";
    rows.forEach(function (row) {
      var div = document.createElement("div");
      div.className = "recap__row";
      var b = document.createElement("b");
      b.textContent = row[0];
      var span = document.createElement("span");
      span.textContent = row[1];
      div.appendChild(b);
      div.appendChild(span);
      recap.appendChild(div);
    });

    form.hidden = true;
    success.classList.add("is-on");
    success.focus();
    success.scrollIntoView({ behavior: "smooth", block: "start" });
    dropDraft();
  });

  /* ---------- clear / restart ---------- */
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      form.reset();
      inputs.forEach(function (input) { setInvalid(input, false); });
      Array.prototype.forEach.call(document.querySelectorAll("[data-count-for]"), function (out) {
        out.textContent = "0";
      });
      dropDraft();
      status.classList.remove("is-warn");
      status.textContent = "Form cleared";
      form.name.focus();
    });
  }

  if (againBtn) {
    againBtn.addEventListener("click", function () {
      success.classList.remove("is-on");
      form.hidden = false;
      form.reset();
      inputs.forEach(function (input) { setInvalid(input, false); });
      Array.prototype.forEach.call(document.querySelectorAll("[data-count-for]"), function (out) {
        out.textContent = "0";
      });
      status.textContent = "";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      form.name.focus();
    });
  }
})();
