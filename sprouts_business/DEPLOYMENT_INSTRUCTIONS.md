# Sprouts Deck Deployment Instructions

## ✅ What I Created

1. **Teaser Deck (7 slides)** - `/sprouts_business/sprouts_teaser_deck.html`
   - Cover
   - Problem
   - Solution
   - Traction
   - Market & Business Model
   - The Ask
   - Contact

2. **Password-Protected Page** - `/sprout-website/app/deck/page.tsx`
   - Password: `123456`
   - View deck in browser
   - Download button
   - Request full deck button

3. **Teaser Deck in Website** - `/sprout-website/public/sprouts_teaser_deck.html`
   - Served from the website
   - Available for download

---

## 🚀 How to Deploy

### Step 1: Test Locally

```bash
cd sprout-website
npm install  # if needed
npm run dev
```

Then visit: **http://localhost:3000/deck**

- Enter password: `123456`
- You should see the teaser deck
- Test the download button

### Step 2: Deploy to Vercel

```bash
cd sprout-website
git add .
git commit -m "Add password-protected investor deck page"
git push origin main
```

Vercel will auto-deploy (since it's already connected).

### Step 3: Access Your Live Deck

Once deployed, your deck will be at:
**https://your-vercel-url.vercel.app/deck**

---

## 📧 How to Share with Investors

### Option 1: Direct Link (Recommended)
Send investors:
```
🌱 Sprouts Investor Deck

View our teaser deck here:
https://your-vercel-url.vercel.app/deck

Password: 123456

Questions? Contact team@getsprouts.io
```

### Option 2: Email the HTML File
Attach `sprouts_teaser_deck.html` to emails
- Investors can open it in their browser
- No internet required

### Option 3: PDF Version
1. Open `sprouts_teaser_deck.html` in Chrome
2. Press Cmd+P
3. Save as PDF
4. Email the PDF

---

## 🔒 Security Notes

**Current Setup:**
- Password: `123456` (hardcoded in the component)
- Client-side authentication (not server-side)
- Anyone with password can access

**To Make More Secure (Optional):**

1. **Change Password:**
   Edit `/sprout-website/app/deck/page.tsx` line 15:
   ```typescript
   if (password === "123456") {  // Change "123456" to your password
   ```

2. **Add Server-Side Auth (Advanced):**
   - Use Next.js API routes
   - Add database of authorized emails
   - Send unique links per investor

3. **Add Analytics:**
   - Track who views the deck
   - Use Vercel Analytics or Google Analytics
   - See which slides get the most time

---

## 📝 Customization Guide

### Update Contact Info

**In Teaser Deck:**
Edit `/sprout-website/public/sprouts_teaser_deck.html`
Search for `[insert email]` and replace with your actual email

**In Password Page:**
Edit `/sprout-website/app/deck/page.tsx`
Search for `[insert email]` and replace

### Update Password

Edit `/sprout-website/app/deck/page.tsx` line 15:
```typescript
if (password === "YOUR_NEW_PASSWORD") {
```

### Change Deck Design

Edit the HTML files:
- `/sprouts_business/sprouts_teaser_deck.html` (source)
- `/sprout-website/public/sprouts_teaser_deck.html` (deployed version)

Remember to copy changes to both files!

---

## 🎨 Adding Images to Deck

The teaser deck currently has placeholder paths for character images.

**To fix image paths:**

1. Copy character images to `/sprout-website/public/animals/` (already done)

2. Update image src in teaser deck:
   ```html
   <!-- Change from: -->
   <img src="../sprout-website/public/animals/bear.png">

   <!-- To: -->
   <img src="/animals/bear.png">
   ```

3. Re-deploy

---

## 📱 Mobile Responsiveness

**Current:**
- Deck is optimized for desktop (1920x1080)
- Mobile users can scroll through slides
- Download works on all devices

**To improve mobile:**
Add responsive CSS to the HTML files (optional)

---

## 🔗 Additional Pages You Can Create

### `/deck/full` - Full Deck (18 slides)
1. Copy `sprouts_pitch_deck.html` to `/sprout-website/public/`
2. Create `/sprout-website/app/deck/full/page.tsx`
3. Use different password (e.g., "investor2025")

### `/deck/download` - Direct Download
Create a page that auto-downloads the PDF without password

### `/deck/analytics` - Track Views
Add analytics to see who views which slides

---

## 🐛 Troubleshooting

### "Page not found"
- Make sure you deployed the changes
- Check that `/sprout-website/app/deck/page.tsx` exists
- Restart dev server

### "Deck doesn't display"
- Check that `/sprout-website/public/sprouts_teaser_deck.html` exists
- Open browser console for errors
- Verify iframe src path is correct

### "Download doesn't work"
- Make sure file is in `/public/` folder
- Check browser's download settings
- Try right-click → Save As

### Images don't show
- Update image paths to `/animals/filename.png`
- Ensure images are in `/sprout-website/public/animals/`

---

## ✅ Checklist Before Sending to Investors

- [ ] Test the password (123456)
- [ ] Verify deck displays correctly
- [ ] Test download button
- [ ] Replace `[insert email]` with your actual email
- [ ] Check all slides render properly
- [ ] Test on mobile device
- [ ] Deploy to Vercel
- [ ] Test live URL
- [ ] Create PDF backup version
- [ ] Prepare full deck (if requested)

---

## 📊 Next Steps

1. **Deploy to Vercel** (git push)
2. **Get live URL** (e.g., sprouts.vercel.app/deck)
3. **Test end-to-end** (password → view → download)
4. **Share with first investor** (test with trusted contact)
5. **Iterate based on feedback**

---

## 🎯 Pro Tips

1. **Track Engagement:**
   - Add Google Analytics to see deck views
   - Use Vercel Analytics (built-in)
   - Ask investors for feedback on slide length

2. **A/B Test:**
   - Create `/deck/v2` with alternate copy
   - See which converts better

3. **Follow Up:**
   - After investor views deck, email within 24 hours
   - Ask specific questions: "What resonated most?"
   - Offer to walk through the full deck on a call

4. **Create Urgency:**
   - Add "Accepting investments until [date]"
   - Show committed investors (if any)
   - Limited spots available

---

**Created by:** Claude Code
**For:** Sprouts Fundraising
**Date:** January 2025

Good luck with your fundraise! 🌱

**Questions?** Review this doc or ask me for help.
