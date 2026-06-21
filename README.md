# DevOps Mastery Training Website

Static lead generation website for a DevOps training course covering Linux, Git, Jenkins, Docker, Kubernetes, Helm, ArgoCD, Terraform, AWS, EKS, monitoring, troubleshooting, and interview preparation.

## Pages

- `index.html`: course landing page and student inquiry form
- `thank-you.html`: post-submit confirmation page
- `admin.html`: lightweight lead dashboard
- `google-apps-script/Code.gs`: Google Sheets backend for lead storage

## Configure The Website

Update these placeholders before publishing:

1. In `assets/app.js`
   - `whatsappNumber`: replace `919999999999` with your WhatsApp number in international format without `+`.
   - `appsScriptUrl`: paste your deployed Google Apps Script Web App URL.
2. In `assets/admin.js`
   - `appsScriptUrl`: paste the same Google Apps Script Web App URL.

Example WhatsApp number format:

```js
whatsappNumber: "919876543210"
```

## Set Up Google Sheets Lead Storage

1. Create a new Google Sheet named `DevOps Course Leads`.
2. Go to `Extensions > Apps Script`.
3. Delete the starter code and paste the contents of `google-apps-script/Code.gs`.
4. In Apps Script, open `Project Settings`.
5. Add a Script Property:
   - Property: `ADMIN_TOKEN`
   - Value: create a strong private token, for example `change-this-to-a-private-token`
6. Click `Deploy > New deployment`.
7. Select type `Web app`.
8. Set:
   - Execute as: `Me`
   - Who has access: `Anyone`
9. Deploy and copy the Web App URL.
10. Paste the Web App URL into both `assets/app.js` and `assets/admin.js`.

The first lead submission creates a `Leads` tab automatically with the correct headers.

## Test Locally

Open the site directly:

```bash
open index.html
```

Or serve it with a local static server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Test checklist:

- Landing page loads on desktop and mobile.
- WhatsApp buttons open the correct message.
- Lead form warns if Apps Script URL is missing.
- After Apps Script setup, form redirects to `thank-you.html`.
- New leads appear in Google Sheets.
- `admin.html` loads leads when the correct admin token is entered.

## Deploy With GitHub Pages

1. Create a GitHub repository, for example `devops-training-website`.
2. From this folder, initialize and push if not already pushed:

```bash
git init
git add index.html thank-you.html admin.html assets google-apps-script README.md
git commit -m "Create DevOps course lead generation website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/devops-training-website.git
git push -u origin main
```

3. In GitHub, open the repository settings.
4. Go to `Pages`.
5. Set:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save.

Your site will be available at:

```text
https://YOUR_GITHUB_USERNAME.github.io/devops-training-website/
```

## Optional Improvements

- Add your custom domain in GitHub Pages settings.
- Add Google Analytics or Meta Pixel.
- Replace the placeholder brand name with your training brand.
- Add course fee, batch timing, trainer profile, testimonials, and demo video.
- Add a downloadable PDF syllabus.
