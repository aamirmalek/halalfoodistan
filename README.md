# Halal Foodistan Lead Capture Project

This project is a polished lead-capture website for Halal Foodistan. It includes:

- A premium multi-step questionnaire
- Progress saving in the browser
- Lead scoring and package recommendations
- A Google Apps Script backend template for Google Sheets + Gmail

## Run locally

Open the project folder in a browser, or serve it with a simple web server:

```bash
cd /Users/aamirmalek/Library/CloudStorage/GoogleDrive-mr.aamirmalek@gmail.com/My\ Drive/Saved\ from\ Chrome\ \(1\)/halal_foodistan
python3 -m http.server 8000
```

Then open http://localhost:8000.

## GoDaddy deployment

This version is ready for GoDaddy hosting with PHP support.

1. Upload the site files to your GoDaddy public directory.
2. Make sure the server supports PHP.
3. Edit [config.js](config.js) if you want to point the form at a different endpoint.
4. Place [submit.php](submit.php) in the same folder as your published site.

## Notes

The website is ready for GoDaddy hosting as a static site. The PHP endpoint handles the backend submission and sends an email to your sales inbox when a lead is submitted.
