# 🚫 Disavow Spam Backlinks - Complete Guide

## 📋 Overview
This guide helps you remove toxic backlinks from spam domains that are hurting your SEO.

**Spam Domains Identified:**
- ❌ `rankvanceseo.info` - Suspicious SEO service
- ❌ `algolinkers.agency` - Link manipulation service
- ❌ `lawlist.info` - Irrelevant spam site
- ❌ `data.vtcdns.com` - Suspicious data domain

---

## ⚠️ IMPORTANT WARNING

**Disavow Links is a POWERFUL tool - use with caution!**

❌ **Don't disavow:**
- High-quality backlinks
- Legitimate business directories
- Real customer reviews sites
- Industry-relevant websites
- Your own websites

✅ **Do disavow:**
- Obvious spam domains
- Link farms/PBNs
- Hacked sites with injected links
- Paid link schemes
- Negative SEO attacks

**Misuse can hurt your rankings!** Only disavow if you're certain these are harmful links.

---

## 📝 Step-by-Step Instructions

### Step 1: Verify the Spam Links

Before disavowing, **verify these are actually linking to you**:

1. **Check Google Search Console**
   ```
   https://search.google.com/search-console
   → Links
   → External links
   → More
   → Export external links
   ```

2. **Search for the domains:**
   - Look for `rankvanceseo.info` in your backlink list
   - Look for `algolinkers.agency`
   - Look for `lawlist.info`
   - Look for `data.vtcdns.com`

3. **Verify they link to you:**
   ```
   In Google: site:rankvanceseo.info "vybrowsbeauty.com"
   ```

### Step 2: Try to Remove Links Manually (Optional but Recommended)

**Before disavowing, try to remove the links:**

1. **Find contact information** on the spam site
2. **Send removal request email:**
   ```
   Subject: Link Removal Request - vybrowsbeauty.com

   Hello,

   I noticed your website [domain] links to our website vybrowsbeauty.com.
   We did not authorize this link and would like it removed.

   Link location: [specific URL]
   Our website: https://vybrowsbeauty.com

   Please remove this link within 7 days.

   Thank you,
   VYBROWS ACADEMY Team
   ```

3. **Wait 2-4 weeks** for response
4. **If no response**, proceed with disavow

### Step 3: Prepare Disavow File

✅ **File already prepared:** `/Users/Nguyen.vs/Documents/VyBrows/disavow-links.txt`

**Content:**
```
domain:rankvanceseo.info
domain:algolinkers.agency
domain:lawlist.info
domain:data.vtcdns.com
domain:vybrows.com
```

**File requirements:**
- ✅ Text file (.txt)
- ✅ UTF-8 or 7-bit ASCII encoding
- ✅ Max size: 2MB (100,000 URLs)
- ✅ One URL or domain per line
- ✅ Lines starting with # are comments

### Step 4: Submit to Google Search Console

1. **Go to Disavow Tool**
   ```
   https://search.google.com/search-console/disavow-links
   ```

2. **Select your property**
   - Choose: `vybrowsbeauty.com`

3. **Click "DISAVOW LINKS"**

4. **Upload the file**
   - Click "Choose File"
   - Select: `disavow-links.txt`
   - Click "Submit"

5. **Confirm the action**
   - ⚠️ Read the warning carefully
   - Click "Done" to confirm

### Step 5: Verify Submission

After submission, you should see:
```
✓ Disavow links file submitted successfully
✓ Last uploaded: [date]
✓ Processing may take a few weeks
```

**You can check status:**
```
https://search.google.com/search-console/disavow-links
→ View current list
```

---

## ⏱️ Timeline & Expectations

### Immediate (0-24 hours)
- ✅ File uploaded and accepted
- ✅ Google acknowledges submission

### Short Term (1-4 weeks)
- 🔄 Google starts processing
- 🔄 Crawlers begin ignoring disavowed links
- ⚠️ Rankings may fluctuate slightly

### Medium Term (1-3 months)
- ✅ Most disavowed links ignored
- ✅ Rankings stabilize
- ✅ Toxic link penalty removed (if any)

### Long Term (3-6 months)
- ✅ Full effect realized
- ✅ Clean backlink profile
- ✅ Improved domain authority

---

## 🔍 Monitoring & Maintenance

### Weekly Check (First Month)
1. **Monitor Rankings**
   ```
   Google Search Console → Performance
   → Compare: Last 28 days vs Previous period
   ```

2. **Check for New Spam Links**
   ```
   Google Search Console → Links → External links
   → Sort by "Latest links"
   ```

### Monthly Check (Ongoing)
1. **Review backlink profile**
2. **Look for new spam domains**
3. **Update disavow file if needed**

### Tools to Use:
- **Google Search Console** (Free) ✅ Primary
- **Ahrefs** (Paid) - Backlink analysis
- **SEMrush** (Paid) - Backlink audit
- **Moz Link Explorer** (Freemium) - Link analysis

---

## 📊 How to Update Disavow File

If you find **more spam domains later**:

### Method 1: Add to Existing File (Recommended)
1. Open `/disavow-links.txt`
2. Add new domains at the bottom:
   ```
   domain:new-spam-site.com
   domain:another-bad-domain.net
   ```
3. Re-submit entire file to Google

### Method 2: Download Current + Merge
1. Download current disavow file from Google
2. Add new domains
3. Re-submit combined file

**Important:** Always re-submit the **complete file**, not just additions!

---

## ❓ Common Questions

### Q: Will disavowing hurt my rankings?
**A:** If done correctly (only spam links), it should **help** your rankings. Google ignores the disavowed links, removing any negative impact.

### Q: How long does it take to see results?
**A:** 1-3 months for full effect. Google needs time to re-crawl and re-evaluate your link profile.

### Q: Can I undo a disavow?
**A:** Yes! Simply remove domains from the file and re-submit. Or submit an empty file to remove all disavows.

### Q: Should I disavow all low-quality links?
**A:** No! Only disavow **obviously harmful** spam links. Low-quality but natural links are usually harmless.

### Q: What if I accidentally disavow a good link?
**A:** Remove it from the file and re-submit immediately. Google will start counting it again within a few weeks.

### Q: Do I need to submit to Bing too?
**A:** Yes! Bing has a similar tool:
```
https://www.bing.com/webmasters/disavow
```

---

## 🎯 Next Steps

### Immediate Actions:
- [x] ✅ Disavow file created
- [ ] 🔄 Verify spam links exist in Google Search Console
- [ ] 🔄 Try manual removal (optional)
- [ ] 🔄 Submit disavow file to Google
- [ ] 🔄 Submit disavow file to Bing (optional)

### Follow-Up (Monthly):
- [ ] 🔄 Monitor rankings
- [ ] 🔄 Check for new spam links
- [ ] 🔄 Update disavow file if needed
- [ ] 🔄 Review backlink profile

---

## 📞 Support & Resources

### Official Google Documentation:
- **Disavow Links Tool**: https://search.google.com/search-console/disavow-links
- **About Disavowing**: https://support.google.com/webmasters/answer/2648487

### Useful Tools:
- **Google Search Console**: https://search.google.com/search-console
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- **Link Explorer (Free)**: https://moz.com/link-explorer

### Need Help?
- Email: vybrowsk@gmail.com
- Website: https://vybrowsbeauty.com
- Phone: (346)-409-8888

---

## 📝 Changelog

**October 17, 2025**
- Initial disavow file created
- Added 4 spam domains:
  - rankvanceseo.info
  - algolinkers.agency
  - lawlist.info
  - data.vtcdns.com
- Old domain (vybrows.com) already included

---

**Last Updated**: October 17, 2025
**Next Review**: November 17, 2025
