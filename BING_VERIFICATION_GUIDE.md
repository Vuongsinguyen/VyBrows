# Bing Webmaster Tools Verification Instructions

## Step 1: Get your verification code
1. Go to https://www.bing.com/webmasters
2. Add your site: vybrowsbeauty.com
3. Choose "XML File Verification"
4. Copy the verification code shown

## Step 2: Update BingSiteAuth.xml
Edit `/public/BingSiteAuth.xml` and replace:
```xml
<user>REPLACE_WITH_YOUR_BING_VERIFICATION_CODE</user>
```
With your actual code, for example:
```xml
<user>ABC123DEF456GHI789JKL012MNO345</user>
```

## Step 3: Deploy and Verify
1. Deploy to Netlify
2. Verify the file is accessible at:
   https://vybrowsbeauty.com/BingSiteAuth.xml
3. Return to Bing Webmaster Tools and click "Verify"

## Step 4: Submit Sitemaps
After verification, submit these sitemaps:
- https://vybrowsbeauty.com/sitemap-index.xml
- https://vybrowsbeauty.com/image-sitemap.xml

## Alternative: Meta Tag Verification
If XML file doesn't work, you can use meta tag instead.
Add this to MainLayout.astro <head>:
```html
<meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
```
