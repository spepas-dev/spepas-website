# SpePas Website — String Review

Full audit of user-facing copy with proposed changes for clarity, consistency, and alignment with industry-standard auto parts marketplaces (PartCycle, Car-Part.com, RockAuto, PartsTrader).

**Legend:** P1 = high priority (confusing/broken), P2 = medium (clarity/polish), P3 = low (nice-to-have)

---

## Hero / Homepage

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 1 | `HeroCarousel.tsx:123` | "Welcome to SpePas" | "Find the Right Part, Fast" | Generic welcome doesn't communicate value. Industry standard is a benefit-driven headline. | P1 |
| 2 | `HeroCarousel.tsx:131-132` | "SpePas is the marketplace for unique and reliable auto parts. From trusted workshops to bespoke restorations, we bring transparency, trust, and a human touch to every transaction." | "Search thousands of new and used auto parts from verified sellers across Ghana. Find what you need, request what you can't, and get it delivered." | "Unique" and "bespoke restorations" don't match a general parts marketplace. Copy should state what users can actually do. | P1 |
| 3 | `HeroCarousel.tsx:155` | "Shop Now" | "Browse Parts" | No products are purchasable yet (prices hidden, cart non-functional). "Shop Now" sets wrong expectations. | P1 |
| 4 | `Hero/index.tsx:43` | "Featured Products" | "Featured Parts" | Industry convention — auto parts sites say "parts" not "products". | P2 |
| 5 | `Hero/index.tsx:64` | "offer" | Remove or replace with "Contact for price" | "offer" as a price label is unclear and looks like placeholder text. | P1 |

## New Arrivals

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 6 | `NewArrivals/index.tsx:28` | "This Week's" | "Recently Added" | More accurate — listings aren't curated weekly. Matches RockAuto/PartCycle pattern. | P2 |
| 7 | `NewArrivals/index.tsx:30` | "New Arrivals" | "New Listings" | "Arrivals" implies inventory receipt. "Listings" is the marketplace term. | P2 |

## Services Section

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 8 | `extras/Services.tsx:10` | "OUR SERVICES" | "How SpePas Works" | SpePas isn't a service provider — it's a marketplace. "How it works" is the industry standard section name. | P2 |
| 9 | `extras/Services.tsx:16` | "…connects anyone—car owners, mechanics, or sellers—to the auto parts they need. Our easy-to-use platform makes it simple to find or offer parts under one roof." | "SpePas connects car owners, mechanics, and parts sellers on one platform. Search for the part you need, or list your inventory to reach buyers across Ghana." | More direct. Removes vague "anyone" and "under one roof" cliché. | P2 |
| 10 | `extras/Services.tsx:19` | "By partnering with key industry players, we guarantee a reliable, well–connected network that improves part quality, availability, and access. With a broad selection at your fingertips, SpePas delivers choice, convenience, and confidence every time." | "We work with trusted suppliers and verified riders to ensure quality parts and reliable delivery. Whether you're buying one brake pad or stocking a workshop, SpePas has you covered." | Too corporate/vague. Concrete examples (brake pad, workshop) resonate with the audience. | P2 |

## Testimonials

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 11 | `Home/Testimonials/index.tsx:51` | "User Feedbacks" | "What Our Users Say" | "Feedbacks" is grammatically incorrect (feedback is uncountable). Standard phrasing. | P1 |
| 12 | `extras/Testimonials.tsx:5` | "From Our Clients" | "What Our Users Say" | "Clients" implies a service firm. "Users" is correct for a marketplace. Consistent with #11. | P2 |
| 13 | `extras/Testimonials.tsx:9-20` | "Name" / "Lorem ipsum dolor sit amet…" (×3) | Remove section or replace with real testimonials | Placeholder text on a live site looks unprofessional. Either hide or populate. | P1 |

## Newsletter

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 14 | `Common/Newsletter.tsx:19` | "Don't Miss Out Latest Trends & Offers" | "Stay in the Loop" | Grammatically awkward ("miss out" needs "on"). Shorter heading is punchier. | P2 |
| 15 | `Common/Newsletter.tsx:21` | "Register to receive news about the latest offers & discount codes" | "Get notified about new parts, deals, and platform updates." | "Register" is heavy for a newsletter signup. "Discount codes" doesn't match current functionality. | P2 |

## Contact Page

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 16 | `Contact/index.tsx:65` | "Email: spepas@spepas.com" | "Email: support@spepas.com" | Inconsistent with Privacy Policy and Refund Policy which say support@spepas.com. | P1 |
| 17 | `Contact/index.tsx:87` | "Phone: 1234 567890" | Replace with real number or remove | Obvious placeholder. Undermines trust on a contact page. | P1 |
| 18 | `Contact/index.tsx:106` | "Address: We Are All Over" | Remove or replace with "Accra, Ghana" | Reads as a joke. Not appropriate for a contact page. | P1 |
| 19 | `Contact/index.tsx:125` | placeholder="John" | placeholder="Kwame" | Use a locally relevant example name for a Ghana-focused platform. | P3 |
| 20 | `Contact/index.tsx:138` | placeholder="Deo" | placeholder="Mensah" | Same as above. | P3 |

## Shop / Products

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 21 | `ShopWithSidebar/index.tsx:48` | "Explore All Products" | "Explore All Parts" | Consistent "parts" terminology. | P2 |
| 22 | `ShopWithSidebar/index.tsx:98` | "Clean All" | "Clear All" | "Clean All" is not standard. Every e-commerce filter UI says "Clear All". | P1 |
| 23 | `ShopWithSidebar/index.tsx:16` | "Latest Products" | "Recently Listed" | Marketplace terminology. | P2 |
| 24 | `ShopWithSidebar/index.tsx:17` | "Best Selling" | "Most Requested" | No sales data yet. "Most Requested" fits the request-based model. | P2 |
| 25 | `ShopWithSidebar/index.tsx:18` | "Old Products" | "Oldest Listings" | "Old Products" sounds negative — implies the parts are worn. | P1 |
| 26 | `Common/ProductItem.tsx:81` | "Add to cart" | "Request Part" or "Enquire" | Cart/checkout isn't functional. Button should reflect actual action. | P1 |
| 27 | `ShopDetails/index.tsx:115` | "Price on request" | "Contact Seller for Price" | More specific — tells the user what to do. Matches PartsTrader pattern. | P2 |
| 28 | `ShopDetails/index.tsx:144` | "Add to Cart" | "Request This Part" | Same reasoning as #26. | P1 |

## About Us

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 29 | `AboutUs/index.tsx:11` | "Join the SpePas Revolution" | "About SpePas" | "Revolution" is hyperbolic for an about page. Users expect a straightforward title. | P2 |
| 30 | `AboutUs/index.tsx:14-15` | "…powered by people, not robots. From trusted workshops to bespoke restorations, we bring transparency, trust, and a human touch to every transaction." | "SpePas is Ghana's online marketplace for new and used auto parts. We connect buyers, sellers, and mechanics — making it easy to find the right part and get it delivered." | "Powered by people, not robots" and "bespoke restorations" don't match the actual product. Reuse the clear splash page copy. | P1 |
| 31 | `AboutUs/index.tsx:18-19` | "In an age of automation, our mission is to connect passionate drivers and expert suppliers…building a community where innovation thrives and craftsmanship shines." | "Our mission is to make finding and selling auto parts simple, trusted, and accessible — starting in Ghana, expanding across West Africa." | The "age of automation" / "craftsmanship shines" language is disconnected from a parts marketplace. | P2 |
| 32 | `AboutUs/index.tsx:25-34` | "10K+" / "500+" / "20K+" stats | Remove or label as "Target" / "Goal" | These are aspirational numbers on a pre-launch site. Showing them as fact is misleading. | P1 |
| 33 | `AboutUs/index.tsx:77` | "…driven by craftsmanship, community, and a bit of fun." | "Our team is passionate about making auto parts accessible across Ghana." | "Craftsmanship" doesn't apply to a tech marketplace. | P2 |
| 34 | `AboutUs/index.tsx:64` | "Investor Opportunities" | Remove from public site | Investor solicitation on a consumer-facing about page is unusual and distracting. Move to a separate /investors route or remove. | P2 |

## Footer

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 35 | `Footer.tsx:22` | "Address" | Replace with actual address or remove | Just the word "Address" with no address. | P1 |
| 36 | `Footer.tsx:45` | "#####" | Replace with real phone or remove | Obvious placeholder hash marks visible to users. | P1 |
| 37 | `Footer.tsx:59` | "mail" | Replace with "support@spepas.com" | Just the word "mail" — not a real email. | P1 |
| 38 | `Footer.tsx:131` | "Quick Link" | "Quick Links" | Should be plural. | P1 |
| 39 | `Footer.tsx:151` | "FAQ's" | "FAQs" | Apostrophe is incorrect — it's a plural, not possessive. | P2 |
| 40 | `Footer.tsx:163` | "Download App" | "Get the App" or hide section | "Get the App" is industry standard (Uber, Jumia). If no app exists yet, hide this section. | P2 |
| 41 | `Footer.tsx:198` | "Get in On" | "Get it on" | Typo — should be "Get it on Google Play" (official Google badge text). | P1 |

## Error / 404 Page

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 42 | `Error/index.tsx:8` | Breadcrumb: "Error" | "Page Not Found" | "Error" is generic and alarming. "Page Not Found" is standard. | P2 |
| 43 | `Error/index.tsx:15` | "Sorry, the page can't be found" | "Page not found" | Simpler, standard 404 language. | P3 |

## Legal Pages (Privacy, Refund, Terms)

| # | File | Current | Proposed | Why | Pri |
|---|------|---------|----------|-----|-----|
| 44 | `RefundPolicy/index.tsx:90,96` | Breadcrumb: "Return Policy" / Title: "SpePas Return Policy" | "Return & Exchange Policy" | Title should match content, which covers both returns and exchanges. | P2 |
| 45 | `PrivacyPolicy/index.tsx:97-99` | "Email support@spepas.com" | Ensure this matches Contact page (#16) | Currently the Privacy page says support@ but Contact page says spepas@. Pick one. | P1 |

---

## Summary by Priority

| Priority | Count | Action |
|----------|-------|--------|
| **P1 — Fix now** | 18 | Broken, placeholder, misleading, or grammatically wrong. Visible to users today. |
| **P2 — Polish** | 20 | Clarity, consistency, and industry alignment improvements. |
| **P3 — Nice-to-have** | 3 | Minor tweaks for local relevance. |

## Top 5 Most Impactful Changes

1. **Replace all placeholder contact info** (#17, #18, #35, #36, #37) — hash marks, "We Are All Over", and "mail" on live pages destroy credibility.
2. **Fix "Add to Cart" → "Request Part"** (#26, #28) — cart doesn't work. Button must match reality.
3. **Remove or flag fake stats on About page** (#32) — "10K+ parts" / "20K+ buyers" on a pre-launch site is misleading.
4. **Remove lorem ipsum testimonials** (#13) — placeholder text on a live page.
5. **Fix hero copy** (#1, #2) — first thing users see; should clearly state what SpePas does.
