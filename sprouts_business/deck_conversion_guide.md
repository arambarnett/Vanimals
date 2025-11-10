# How to Convert the Pitch Deck to a Visual Presentation

This guide will help you transform `investor_pitch_deck.md` into a professional, visually stunning presentation.

---

## Option 1: Manual Design (Best Quality)

### Recommended Tools:
- **Figma** (Free, collaborative, professional)
- **Canva** (Easy, templates available, $13/mo for Pro)
- **PowerPoint** (Microsoft 365)
- **Keynote** (Mac, free with macOS)
- **Google Slides** (Free, collaborative)

### Step-by-Step Process:

#### 1. Set Up Your Template

**Slide Dimensions:**
- Standard: 16:9 (1920x1080px)
- Use consistent margins: 80px on all sides

**Brand Colors:**
```
Primary: Mint Green #A8F5D8
Secondary: Blush Pink #FFD1E3
Accent: Lavender #C8B6FF
Text: Charcoal #1A1A1A
Background: White #FFFFFF
```

**Typography:**
- **Titles:** Montserrat Bold, 48-72pt
- **Headings:** Montserrat Bold, 32-40pt
- **Body:** Inter Regular, 18-24pt
- **Captions:** Inter Regular, 14-16pt

**Visual Style:**
- Soft gradients (mint → pink → lavender)
- Rounded corners (16-24px radius)
- Subtle drop shadows
- Glowing particle effects (optional)
- Minimal, clean layouts

---

#### 2. Import Content from Markdown

Open `investor_pitch_deck.md` and copy content slide by slide.

**Slide Structure:**
```
Slide 1: Cover
- Large title: "🌱 Sprouts"
- Subtitle: "Grow Better Habits. Collect the Rewards."
- Tagline: "Gamified goal tracking meets digital companions"
- Background: Gradient (mint → blush)
- Visual: Floating Sprout character (use /sprout-website/public/animals/)

Slide 2: The Problem
- Headline: "Humans struggle to stay consistent"
- 3 data points with large numbers (80%, 92%, etc.)
- Bottom line quote in bold
- Icon: Broken chain or declining graph

Slide 3: The Insight
[Continue for all 18 slides...]
```

---

#### 3. Add Visual Assets

**Character Images:**
Location: `/sprout-website/public/animals/`
- bear.png
- deer.png
- fox.png
- owl.png
- penguin.png
- rabbit.png

**Where to Use Them:**
- Slide 1 (Cover): 1-2 floating characters
- Slide 5 (Product): Grid of 6 characters
- Slide 6 (How It Works): Character evolution stages
- Slide 11 (Competitive Landscape): Character icons
- Slide 18 (Thank You): Single hero character

**App Screenshots:**
Take from your iOS device:
- Onboarding screen
- Collection view (all Sprouts)
- Goal creation screen
- Sprout detail (feeding, stats)
- Strava activity feed
- Egg hatching animation

**How to Take Screenshots:**
1. Open Sprouts app on iPhone
2. Press Volume Up + Side Button simultaneously
3. AirDrop to Mac or email to yourself
4. Crop and add device frames (use MockUPhone.com or Figma plugins)

---

#### 4. Design Each Slide Type

**Title Slides (Slides 1, 7, 12, 14, 15):**
- Full-bleed gradient background
- Centered text
- Large, bold typography
- Minimal elements

**Content Slides (Most slides):**
- White background with subtle gradient overlay
- Left-aligned or centered text
- Icons for bullet points
- Data visualizations for numbers

**Comparison Slides (Slides 11, A2):**
- Table or side-by-side layout
- Checkmarks ✅ and X marks ❌
- Color-coded rows (green for "us", gray for "them")

**Data Slides (Slides 7, 9, 15):**
- Large numbers in brand colors
- Bar charts or pie charts
- Minimal text, focus on visuals

---

#### 5. Add Visual Elements

**Icons:**
- Download from: Noun Project, Flaticon, or Feather Icons
- Use consistent style (outline or filled, not mixed)
- Brand color: Use mint green or lavender

**Illustrations:**
- Consider commissioning custom illustrations of:
  - User interacting with Sprout on phone
  - Growth stages (Egg → Tree)
  - Flywheel diagram (circular with arrows)
  - Use Fiverr ($50-200 per illustration)

**Charts & Graphs:**
- Keep minimal and clean
- Use brand colors
- Export from Google Sheets or create in Figma
- Example: Market TAM (3 circles overlapping)

---

#### 6. Animation & Transitions (Optional)

**For Digital Presentations:**
- Slide transitions: Fade or push (subtle, not distracting)
- Build animations: Fade in bullet points one by one
- Emphasis: Scale up key numbers or icons
- Duration: Keep under 0.5 seconds

**For PDF Export:**
- Skip animations (PDF doesn't support them)
- Ensure all elements are visible at once

---

#### 7. Export & Share

**Formats:**
- **PDF:** Best for email (File → Export → PDF)
- **PowerPoint (.pptx):** For editable version
- **Link (Figma/Canva):** For live collaboration
- **Video:** Record narrated walkthrough (Loom, QuickTime)

**File Naming:**
```
Sprouts_Pitch_Deck_Jan2025_v1.pdf
Sprouts_Investor_Deck.pptx
Sprouts_Teaser_Deck.pdf (5-7 slides)
```

---

## Option 2: Automated Conversion Tools

### A. Marp (Markdown Presentation Ecosystem)

**Pros:** Fast, keeps Markdown format, developer-friendly
**Cons:** Less visual control, requires CSS knowledge

**Steps:**
1. Install Marp CLI: `npm install -g @marp-team/marp-cli`
2. Create `sprouts-theme.css` with brand colors
3. Add Marp frontmatter to `investor_pitch_deck.md`
4. Run: `marp investor_pitch_deck.md -o sprouts_deck.pdf`

**Theme CSS Example:**
```css
/* sprouts-theme.css */
section {
  background: linear-gradient(135deg, #A8F5D8, #FFD1E3);
  color: #1A1A1A;
  font-family: 'Inter', sans-serif;
}

h1 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: #A8F5D8;
}
```

---

### B. Slidev (Developer-Focused)

**Pros:** Beautiful themes, Vue.js powered, interactive
**Cons:** Requires coding, learning curve

**Steps:**
1. Install: `npm init slidev`
2. Copy content from Markdown
3. Customize theme with brand colors
4. Export: `npm run export`

---

### C. Deckset (Mac Only)

**Pros:** Drag & drop Markdown, beautiful themes
**Cons:** $30 one-time purchase, Mac only

**Steps:**
1. Purchase from Deckset.com
2. Open `investor_pitch_deck.md`
3. Apply "Plain Jane" or custom theme
4. Export to PDF

---

## Option 3: Hire a Designer

**Recommended Platforms:**
- **Fiverr:** $200-500 for full deck
- **Upwork:** $500-1,500 for professional designer
- **99designs:** $1,000-3,000 for pitch deck contest
- **Dribbble:** Hire top designers ($2,000-5,000)

**What to Provide:**
1. `investor_pitch_deck.md` (all content)
2. `pitch_deck_outline.txt` (brand guidelines)
3. Character images from `/public/animals/`
4. App screenshots
5. Logo (if you have one)
6. Reference decks (Duolingo, Airbnb, Uber pitch decks)

**Typical Turnaround:** 5-10 business days

---

## Option 4: AI-Assisted Design

### A. Gamma.app

**Pros:** AI generates slides from text, fast, beautiful
**Cons:** Limited customization, subscription required

**Steps:**
1. Go to Gamma.app
2. Paste sections from `investor_pitch_deck.md`
3. Let AI generate slides
4. Customize with brand colors
5. Export to PDF or PowerPoint

---

### B. Beautiful.ai

**Pros:** Smart templates, auto-formatting
**Cons:** $12/mo subscription

**Steps:**
1. Sign up at Beautiful.ai
2. Choose "Pitch Deck" template
3. Replace content with Sprouts copy
4. Upload character images
5. Export

---

### C. Canva AI (Magic Design)

**Pros:** Easy, many templates, affordable
**Cons:** Less unique (templates are popular)

**Steps:**
1. Canva.com → "Presentations"
2. Search "Pitch Deck" templates
3. Choose pastel/clean template
4. Replace text and images
5. Customize colors to match brand
6. Export as PDF or PowerPoint

---

## Recommended Approach

**For Best Results:**

1. **Use Figma or Canva** (free/cheap, professional quality)
2. **Follow the brand guidelines** (colors, fonts from `pitch_deck_outline.txt`)
3. **Focus on 5-7 key slides first** (teaser deck):
   - Cover
   - Problem
   - Solution
   - Traction
   - Team
   - Ask
   - Contact
4. **Iterate based on feedback**
5. **Then create full 18-slide deck**

**Budget:**
- DIY (Canva): $0-13/mo
- Hire on Fiverr: $200-500
- Professional designer: $1,500-3,000

**Timeline:**
- DIY: 4-8 hours
- Fiverr: 5-7 days
- Professional: 1-2 weeks

---

## Sample Slide Layouts

### Slide 1 (Cover):
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│            🌱 Sprouts                   │
│    Grow Better Habits.                  │
│    Collect the Rewards.                 │
│                                         │
│  [Floating character image]             │
│                                         │
│  Gamified goal tracking meets           │
│  digital companions                     │
│                                         │
└─────────────────────────────────────────┘
```

### Slide 2 (Problem):
```
┌─────────────────────────────────────────┐
│  Humans struggle to stay consistent     │
│                                         │
│  [Icon: Broken chain]                   │
│                                         │
│  • 80% abandon habits in 3 weeks        │
│  • 92% delete productivity apps         │
│  • Brands can't create engagement       │
│                                         │
│  "Motivation is fleeting, incentives    │
│   are boring, engagement feels          │
│   transactional—not emotional."         │
│                                         │
└─────────────────────────────────────────┘
```

### Slide 5 (Product):
```
┌─────────────────────────────────────────┐
│  The Product                            │
│                                         │
│  [Screenshot: App interface]            │
│                                         │
│  🎯 Goal & Habit Tracking               │
│  🌱 Character Growth System             │
│  💎 Limited Drops & Collectibles        │
│  💼 Brand Challenge Integrations        │
│  🔗 Real Integrations (Strava, Plaid)   │
│                                         │
│  Your motivation, made visual.          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Checklist Before Finalizing

- [ ] All 18 main slides designed
- [ ] Brand colors consistent throughout
- [ ] Fonts match guidelines (Montserrat + Inter)
- [ ] Character images included (at least 3-4 slides)
- [ ] App screenshots added (product slides)
- [ ] Charts/graphs for data slides
- [ ] Contact info on final slide
- [ ] Typos/grammar checked
- [ ] PDF exported (for email)
- [ ] PowerPoint version available (for editing)
- [ ] Tested on different screens (laptop, projector, phone)

---

## Final Tips

1. **Less is more:** Each slide should have ONE key message
2. **Use white space:** Don't cram too much text
3. **High contrast:** Ensure text is readable (dark on light)
4. **Consistent alignment:** Center or left-align, not mixed
5. **Visual hierarchy:** Larger = more important
6. **Tell a story:** Flow from problem → solution → opportunity → ask
7. **Practice your pitch:** Deck is just the visual aid

---

**Need help?** Contact me for:
- Design review
- Slide-by-slide guidance
- Figma template creation
- Designer referrals

Good luck with your fundraise! 🌱

---

**Created by:** Claude Code
**For:** Sprouts Pitch Deck Conversion
**Last Updated:** January 2025
