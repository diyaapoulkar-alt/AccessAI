export const presetWebsites = [
  {
    id: "ecommerce",
    name: "ShopEase Online Store",
    url: "https://shopease-demo.store",
    category: "E-Commerce",
    overallScore: 62,
    totalIssues: 14,
    criticalCount: 4,
    highCount: 5,
    mediumCount: 3,
    lowCount: 2,
    previewImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "saas",
    name: "TaskFlow SaaS Dashboard",
    url: "https://taskflow-app.io",
    category: "SaaS Product",
    overallScore: 78,
    totalIssues: 8,
    criticalCount: 1,
    highCount: 3,
    mediumCount: 3,
    lowCount: 1,
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gov",
    name: "City Municipal Services Portal",
    url: "https://cityportal.gov",
    category: "Government",
    overallScore: 54,
    totalIssues: 21,
    criticalCount: 7,
    highCount: 8,
    mediumCount: 4,
    lowCount: 2,
    previewImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
  }
];

export const mockScanIssues = [
  {
    id: "ISSUE-101",
    type: "alt-text",
    title: "Meaningless Alt-Text on Key Product Infographic",
    wcagRule: "WCAG 2.1 - 1.1.1 Non-Text Content (Level A)",
    impact: "Critical",
    scorePenalty: -15,
    element: "<img src='/banners/summer_sale_50.png' alt='image123.jpg'>",
    selector: "div.hero-banner > img",
    description: "Technical rule checkers pass this because `alt` attribute is present. However, AccessAI evaluation reveals 'image123.jpg' provides ZERO meaningful context to visually impaired screen reader users about the 50% discount offer.",
    ruleVsAi: {
      standardCheck: "PASS (alt attribute exists)",
      aiEvaluation: "FAIL (Meaningless filename string used as alt text)",
      whyItMatters: "Screen reader users miss essential promotional details and checkout codes."
    },
    originalCode: `<img src="/banners/summer_sale_50.png" alt="image123.jpg" class="banner-img">`,
    fixedCode: `<img src="/banners/summer_sale_50.png" alt="Summer Flash Sale: 50% off all athletic gear using promo code SUMMER50 until midnight" class="banner-img">`,
    remediationExplanation: "AI synthesized the visual text embedded in the infographic banner to construct a rich, informative alt description."
  },
  {
    id: "ISSUE-102",
    type: "contrast",
    title: "Low Contrast Primary Call to Action Button",
    wcagRule: "WCAG 2.1 - 1.4.3 Contrast (Minimum) (Level AA)",
    impact: "High",
    scorePenalty: -10,
    element: "<button class='btn-checkout'>Complete Purchase ($149)</button>",
    selector: "#checkout-form > button.btn-checkout",
    description: "Light grey text `#9CA3AF` on light blue background `#D1E5F0` yields a contrast ratio of 2.1:1. Minimum required ratio for regular text is 4.5:1.",
    contrastData: {
      currentRatio: "2.1:1",
      requiredRatio: "4.5:1 (AA) / 7.0:1 (AAA)",
      fgColor: "#9CA3AF",
      bgColor: "#D1E5F0",
      suggestedFgColor: "#1E3A8A",
      suggestedBgColor: "#DBEAFE",
      newRatio: "7.8:1"
    },
    originalCode: `<button style="color: #9CA3AF; background-color: #D1E5F0;" class="px-6 py-3 rounded">Complete Purchase</button>`,
    fixedCode: `<button style="color: #1E3A8A; background-color: #DBEAFE;" class="px-6 py-3 font-semibold rounded">Complete Purchase</button>`,
    remediationExplanation: "Adjusted foreground text to deep royal navy (#1E3A8A) boosting contrast ratio to 7.8:1 (WCAG AAA compliant)."
  },
  {
    id: "ISSUE-103",
    type: "heading",
    title: "Skipped Heading Hierarchy (H1 directly to H4)",
    wcagRule: "WCAG 2.1 - 1.3.1 Info and Relationships (Level A)",
    impact: "Medium",
    scorePenalty: -8,
    element: "<h4 class='section-title'>Customer Testimonials</h4>",
    selector: "section.reviews > h4",
    description: "Document skips heading levels from `<h1>` main page title directly to `<h4>`. Screen reader users rely on sequential heading navigation (H1 -> H2 -> H3) to map section depth.",
    originalCode: `<h1>ShopEase Home</h1>\n<section>\n  <h4>Customer Testimonials</h4>\n</section>`,
    fixedCode: `<h1>ShopEase Home</h1>\n<section>\n  <h2>Customer Testimonials</h2>\n</section>`,
    remediationExplanation: "Replaced <h4> with semantically structured <h2> element while maintaining visual CSS presentation via class names."
  },
  {
    id: "ISSUE-104",
    type: "aria-form",
    title: "Unlabeled Search Input & Missing Focus Ring",
    wcagRule: "WCAG 2.1 - 4.1.2 Name, Role, Value (Level A)",
    impact: "Critical",
    scorePenalty: -12,
    element: "<input type='text' placeholder='Search products...'>",
    selector: "header input[type='text']",
    description: "Search input box has no associated `<label>` or `aria-label` attribute. Visually impaired users hearing screen reader output hear 'Edit text blank' with no prompt.",
    originalCode: `<input type="text" placeholder="Search products..." class="search-box">`,
    fixedCode: `<input type="text" id="site-search" name="search" placeholder="Search products..." aria-label="Search catalog for products, brands and categories" class="search-box focus:ring-2 focus:ring-blue-500">`,
    remediationExplanation: "Added explicit `aria-label` descriptor and enhanced visual focus indicator ring for keyboard users."
  },
  {
    id: "ISSUE-105",
    type: "keyboard",
    title: "Custom Dropdown Menu Inaccessible via Keyboard Tab",
    wcagRule: "WCAG 2.1 - 2.1.1 Keyboard (Level A)",
    impact: "High",
    scorePenalty: -10,
    element: "<div onclick='toggleNav()'>Category Menu</div>",
    selector: "nav.custom-menu > div",
    description: "Interactive category filter uses non-semantic `<div>` with `onclick` handler. Element is not focusable via Tab key and lacks ARIA role='button' or aria-expanded state.",
    originalCode: `<div onclick="toggleMenu()" class="menu-btn">Categories ▾</div>`,
    fixedCode: `<button type="button" aria-expanded="false" aria-controls="nav-dropdown" class="menu-btn cursor-pointer">Categories ▾</button>`,
    remediationExplanation: "Converted custom `<div>` to a native `<button>` element with `aria-expanded` toggle states to enable full keyboard accessibility."
  }
];
