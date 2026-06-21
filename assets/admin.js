(function () {
  const CONFIG = {
    appsScriptUrl: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
    jsonpCallbackPrefix: "devopsLeadsCallback",
  };

  const form = document.querySelector("[data-admin-form]");
  const status = document.querySelector("[data-admin-status]");
  const tableBody = document.querySelector("[data-lead-table]");
  const totalLeads = document.querySelector("[data-total-leads]");
  const latestLead = document.querySelector("[data-latest-lead]");

  if (!form) {
    return;
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.className = isError ? "form-status is-error" : "form-status";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderLeads(leads) {
    if (!Array.isArray(leads) || leads.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7">No leads found.</td></tr>';
      totalLeads.textContent = "0";
      latestLead.textContent = "-";
      return;
    }

    totalLeads.textContent = String(leads.length);
    latestLead.textContent = leads[0].timestamp || "-";

    tableBody.innerHTML = leads
      .map(
        (lead) => `
          <tr>
            <td>${escapeHtml(lead.timestamp)}</td>
            <td>${escapeHtml(lead.name)}</td>
            <td><a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></td>
            <td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td>
            <td>${escapeHtml(lead.experience)}</td>
            <td>${escapeHtml(lead.message)}</td>
            <td>${escapeHtml(lead.source)}</td>
          </tr>
        `
      )
      .join("");
  }

  function fetchLeads(token) {
    return new Promise((resolve, reject) => {
      const callbackName = `${CONFIG.jsonpCallbackPrefix}_${Date.now()}`;
      const script = document.createElement("script");
      const url = new URL(CONFIG.appsScriptUrl);

      url.searchParams.set("action", "list");
      url.searchParams.set("token", token);
      url.searchParams.set("callback", callbackName);

      const cleanup = () => {
        delete window[callbackName];
        script.remove();
      };

      window[callbackName] = (response) => {
        cleanup();
        if (!response || response.ok !== true) {
          reject(new Error(response && response.error ? response.error : "Unable to load leads."));
          return;
        }
        resolve(response.leads || []);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error("Unable to reach the Apps Script lead API."));
      };

      script.src = url.toString();
      document.body.appendChild(script);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.includes("PASTE_")) {
      setStatus("Add your Google Apps Script Web App URL in assets/admin.js before using the dashboard.", true);
      return;
    }

    const token = new FormData(form).get("token");
    const button = form.querySelector("[type='submit']");

    button.disabled = true;
    setStatus("Loading leads...", false);

    try {
      const leads = await fetchLeads(token);
      renderLeads(leads);
      setStatus("Leads loaded successfully.", false);
    } catch (error) {
      renderLeads([]);
      setStatus(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
})();
