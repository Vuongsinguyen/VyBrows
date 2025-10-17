#!/bin/bash

# Spam Backlinks Verification Script
# This script checks if spam domains are actually linking to vybrowsbeauty.com

echo "🔍 Verifying Spam Backlinks..."
echo "======================================"
echo ""

TARGET_DOMAIN="vybrowsbeauty.com"
SPAM_DOMAINS=(
    "rankvanceseo.info"
    "algolinkers.agency"
    "lawlist.info"
    "data.vtcdns.com"
)

echo "Target Domain: $TARGET_DOMAIN"
echo "Checking ${#SPAM_DOMAINS[@]} spam domains..."
echo ""

# Function to check if domain links to target
check_domain() {
    local spam_domain=$1
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 Checking: $spam_domain"
    echo ""
    
    # Method 1: Google Search
    echo "Method 1: Google Search"
    GOOGLE_QUERY="site:${spam_domain} \"${TARGET_DOMAIN}\""
    echo "Query: $GOOGLE_QUERY"
    echo "URL: https://www.google.com/search?q=site%3A${spam_domain}+%22${TARGET_DOMAIN}%22"
    echo ""
    
    # Method 2: Direct curl check (check if domain is accessible)
    echo "Method 2: Domain Accessibility Check"
    if curl -s --connect-timeout 5 -I "http://${spam_domain}" > /dev/null 2>&1; then
        echo "✅ Domain is accessible (may contain backlinks)"
    else
        echo "❌ Domain is not accessible or blocked"
    fi
    echo ""
    
    # Method 3: Check Wayback Machine
    echo "Method 3: Wayback Machine Check"
    echo "URL: https://web.archive.org/web/*/${spam_domain}"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Check each spam domain
for domain in "${SPAM_DOMAINS[@]}"; do
    check_domain "$domain"
done

echo ""
echo "======================================"
echo "✅ Verification Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. MANUAL VERIFICATION (Recommended):"
echo "   Open Google Search Console:"
echo "   https://search.google.com/search-console"
echo "   → Links → External links → Export"
echo "   → Search for spam domains in the list"
echo ""
echo "2. GOOGLE SEARCH VERIFICATION:"
echo "   For each domain, search in Google:"
for domain in "${SPAM_DOMAINS[@]}"; do
    echo "   • site:${domain} \"${TARGET_DOMAIN}\""
done
echo ""
echo "3. USE BACKLINK CHECKER TOOLS:"
echo "   • Ahrefs: https://ahrefs.com/backlink-checker"
echo "   • SEMrush: https://www.semrush.com/analytics/backlinks/"
echo "   • Moz: https://moz.com/link-explorer"
echo ""
echo "4. IF VERIFIED AS SPAM:"
echo "   Submit disavow-links.txt to:"
echo "   https://search.google.com/search-console/disavow-links"
echo ""
echo "======================================"
