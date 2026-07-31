const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, TableOfContents, PageBreak,
  LevelFormat, convertInchesToTwip, ImageRun
} = require("docx");
const fs = require("fs");

const ACCENT = "8B3A62"; // cake-magic pink/plum accent
const GREY = "555555";

function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } });
}
function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, ...opts })],
  });
}
function bold(text) {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text, bold: true })] });
}
function bullets(items) {
  return items.map(t => new Paragraph({
    text: t,
    bullet: { level: 0 },
    spacing: { after: 40 },
  }));
}
function qa(q, a) {
  return [
    new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [new TextRun({ text: "Q: ", bold: true, color: ACCENT }), new TextRun({ text: q, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: "A: ", bold: true }), new TextRun({ text: a })],
    }),
  ];
}
function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 3000, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: ACCENT } : undefined,
    children: [new Paragraph({
      children: [new TextRun({ text, bold: !!opts.header, color: opts.header ? "FFFFFF" : "000000" })],
    })],
  });
}
function techTable() {
  const rows = [
    ["Layer", "Technology", "Why chosen / role"],
    ["Frontend", "HTML5, CSS3, JavaScript", "Page structure, styling, form validation & simple interactivity"],
    ["Backend", "Python + Bottle framework", "Business logic, routing; Bottle is lightweight, fast to set up for a small app"],
    ["Database", "SQLite3", "Serverless, file-based, zero-config — fine for one shop's data volume"],
    ["Payments", "Razorpay API", "UPI/cards/wallets/net-banking, India-focused, avoids handling PCI-DSS ourselves"],
    ["Notifications", "PyWhatKit (+ PyAutoGUI)", "Automates WhatsApp messages for birthday & order-status reminders"],
    ["Deployment", "Render + GitHub", "Free tier, auto-deploy on push, simple CI-less hosting for Python apps"],
  ];
  const widths = [2200, 2600, 4800];
  return new Table({
    width: { size: 9600, type: WidthType.DXA },
    rows: rows.map((r, i) => new TableRow({
      children: r.map((t, j) => cell(t, { header: i === 0, width: widths[j] })),
    })),
  });
}
function tradeoffTable() {
  const rows = [
    ["Choice", "Gained", "Traded off"],
    ["Bottle over Django/Flask", "Minimal setup, fast to build", "No built-in ORM/admin/auth — had to hand-roll these"],
    ["SQLite over MySQL/Postgres", "Zero-config, single file, easy backup", "Poor concurrency; not viable past a few thousand users"],
    ["Plain HTML/CSS over React", "Simple, fewer moving parts for scope", "No component reuse; harder to scale UI complexity"],
    ["Razorpay over building own gateway", "PCI-DSS compliance handled externally", "Vendor dependency, transaction fees"],
    ["Render over AWS/Azure", "Free tier, GitHub auto-deploy", "Limited resources/scaling ceiling on free tier"],
  ];
  const widths = [3200, 3200, 3200];
  return new Table({
    width: { size: 9600, type: WidthType.DXA },
    rows: rows.map((r, i) => new TableRow({
      children: r.map((t, j) => cell(t, { header: i === 0, width: widths[j] })),
    })),
  });
}
function resumeBulletBlock(bulletText, question, answer, cross) {
  const out = [
    new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [new TextRun({ text: "Resume bullet: ", bold: true, color: ACCENT }), new TextRun({ text: bulletText, italics: true })],
    }),
  ];
  out.push(...qa(question, answer));
  if (cross) out.push(...qa(cross[0], cross[1]));
  return out;
}

const children = [];

// ---------- TITLE PAGE ----------
children.push(
  new Paragraph({ spacing: { before: 2000, after: 100 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Interview Prep Guide", bold: true, size: 56, color: ACCENT })] }),
  new Paragraph({ spacing: { after: 400 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Online Cake Ordering Website — \"Arya Cake Magic\"", size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "Python | Bottle | HTML/CSS/JS | SQLite | Razorpay | PyWhatKit | Render", color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1200 },
    children: [new TextRun({ text: "Condensed from the full project report for quick, confident recall.", italics: true, color: GREY })] }),
  new Paragraph({ children: [new PageBreak()] }),
);

// TOC
children.push(h1("Table of Contents"));
children.push(new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 1. OVERVIEW ----------
children.push(h1("1. Project Overview"));
children.push(bold("30-second elevator pitch"));
children.push(p("Online Cake Ordering Website is a Python-based e-commerce application built for a real local bakery, Arya Cake Magic. Customers browse cakes, customize orders, upload reference images for photo cakes, pay online or via cash-on-delivery, and get WhatsApp birthday reminders. The owner manages every order — accept, reject, mark delivered — from a single admin dashboard."));

children.push(h2("What problem did it solve?"));
children.push(...bullets([
  "Orders only came in by phone/WhatsApp — messages got lost, no order history.",
  "No online presence — the shop depended entirely on local word-of-mouth.",
  "Custom photo/theme cakes needed manual back-and-forth over WhatsApp.",
  "No online payment — owner had no advance confirmation; customers sometimes cancelled after the cake was made.",
  "No customer database — no record of birthdays or order history, so no repeat-customer marketing.",
]));

children.push(h2("Who uses it"));
children.push(bold("Customer:"));
children.push(p("Registers/logs in, browses and searches cakes, uploads a reference image, selects weight, chooses COD or Razorpay, places the order, and gets WhatsApp updates."));
children.push(bold("Shop owner (Admin):"));
children.push(p("Logs into the dashboard, views incoming orders, accepts/rejects them, marks delivery status, views customer & payment details, and triggers WhatsApp reminders."));

children.push(h2("Why this project is a good interview story"));
children.push(p("It's a real client engagement, not a generic CRUD exercise — it touches full-stack development, a third-party payment gateway, a messaging API, authentication, file upload, and cloud deployment, which gives you material for almost any \"tell me about a project\" question."));

// ---------- 2. ARCHITECTURE ----------
children.push(h1("2. System Architecture & Workflow"));
children.push(p("The system is a classic 3-tier web application:"));
children.push(...bullets([
  "Frontend (browser) — HTML/CSS/JS pages: home, login, products, order, payment.",
  "Backend (server) — Python + Bottle handles routing, auth, order logic, Razorpay calls, WhatsApp automation.",
  "Database — SQLite stores customers, orders, accepted-orders and uploaded images.",
]));
// children.push(new Paragraph({
//   alignment: AlignmentType.CENTER,
//   spacing: { before: 100, after: 200 },
//   children: [new ImageRun({
//     type: "png",
//     data: fs.readFileSync("/home/claude/architecture.png"),
//     transformation: { width: 480, height: 360 },
//   })],
// }));

children.push(h2("End-to-end workflow (e.g. ordering a 2 kg photo cake)"));
children.push(...bullets([
  "Customer opens the site → home page loads → browses cakes / uses search.",
  "Clicks Buy Now → selects weight & flavor.",
  "If not logged in → signup/login first.",
  "Enters delivery address, phone number, uploads a reference photo, adds a message.",
  "Chooses Cash-on-Delivery or Razorpay.",
  "If Razorpay: backend calls the Razorpay API → payment window opens → success → confirmation returned.",
  "Backend writes the order into SQLite (customer, order, payment status, image as BLOB).",
  "Owner opens the admin panel, views the order, accepts/rejects it, updates delivery status.",
  "Customer gets a WhatsApp notification at each status change.",
  "Two days before a stored birthday, a script checks the database and sends a reminder automatically.",
]));

children.push(h2("Why 3-tier architecture"));
const advTable = new Table({
  width: { size: 9600, type: WidthType.DXA },
  rows: [
    new TableRow({ children: [cell("Advantages", { header: true, width: 4800 }), cell("Limitations", { header: true, width: 4800 })] }),
    new TableRow({ children: [
      new TableCell({ width: { size: 4800, type: WidthType.DXA }, children: bullets(["Easier maintenance", "Frontend can evolve independently", "Better security — DB only reachable via backend", "Simple to reason about"]) }),
      new TableCell({ width: { size: 4800, type: WidthType.DXA }, children: bullets(["SQLite struggles with concurrent writers", "Bottle has fewer built-ins than Django", "Everything runs on a single server (no horizontal scaling out of the box)"]) }),
    ]}),
  ],
});
children.push(advTable);
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 3. TECH STACK ----------
children.push(h1("3. Technology Stack & Design Decisions"));
children.push(techTable());
children.push(h2("Trade-offs interviewers will probe"));
children.push(tradeoffTable());

children.push(h2("If asked: \"why not X?\""));
children.push(...qa("Why not Django/Flask instead of Bottle?", "The project's scope was small — a handful of routes and forms. Bottle is a single-file, lightweight framework with minimal setup, which meant faster development. Django brings a full ORM, admin panel and auth system, which would have been over-engineering for this scale — I'd reach for it on a bigger app."));
children.push(...qa("Why not MySQL/PostgreSQL?", "SQLite is serverless and ships with Python, so there was zero setup — ideal for one shop's order volume. For a multi-tenant or high-traffic version, I'd migrate to PostgreSQL for better concurrency and ACID guarantees."));
children.push(...qa("Why not React for the frontend?", "The UI was a fairly standard set of pages (browse, form, checkout) without heavy client-side state, so plain HTML/CSS/JS was sufficient. React would help if the UI became more interactive/component-heavy."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 4. FOLDER STRUCTURE ----------
children.push(h1("4. Folder Structure & Responsibilities"));
children.push(p("A clean way to describe the project layout if asked \"how did you organize your code?\":"));
children.push(new Paragraph({
  spacing: { after: 200 },
  children: [new TextRun({
    text:
"Online-Cake-Ordering-Website/\n" +
"├── app.py                # Main Bottle app & routes\n" +
"├── requirements.txt\n" +
"├── database.db            # SQLite database\n" +
"├── templates/             # home, login, signup, products, buy_now,\n" +
"│                          # review_order, admin, payment .html\n" +
"├── static/                # css / js / images / uploads\n" +
"├── routes/                # auth.py, orders.py, payment.py, admin.py\n" +
"├── services/               # whatsapp_service.py, reminder_service.py, payment_service.py\n" +
"└── database/               # customer.sql, orders.sql, accepted_orders.sql",
    font: "Consolas", size: 18,
  })],
}));
children.push(h2("Backend responsibilities"));
children.push(...bullets(["User registration & login", "Form validation", "CRUD on the database", "Order processing", "Razorpay integration", "WhatsApp notification automation", "Birthday reminder scheduling", "Admin order management"]));
children.push(h2("Frontend responsibilities"));
children.push(...bullets(["Home page & product browsing/search", "Login/signup pages", "Cake customization form (weight, image upload)", "Checkout & payment pages", "Admin dashboard UI"]));
children.push(h2("Database design"));
children.push(...bullets(["Customer table — email, password, phone, birthday, age", "Orders table — customer email, cake, weight, price, status, payment mode", "Accepted-orders table — kept separate from pending orders for simpler querying", "Images stored as BLOBs against the order"]));
children.push(p("Why separate tables instead of one big table: less duplication, simpler queries, easier to reason about order lifecycle (pending → accepted → delivered)."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 5. CORE CONCEPTS ----------
children.push(h1("5. Core Technical Concepts (deep-dive)"));

children.push(h2("Client-server architecture"));
children.push(p("The browser is the client, the Bottle app is the server, SQLite is the data store. A request cycle: browser sends an HTTP request → Bottle routes it to a handler → handler runs business logic and talks to SQLite → a response (HTML) is sent back."));

children.push(h2("HTTP GET vs POST"));
children.push(...bullets(["GET — used to retrieve pages: home, product listing, search results.", "POST — used to submit data: login, signup, placing an order, uploading an image, initiating payment."]));

children.push(h2("Routing"));
children.push(p("Bottle maps URL paths to Python functions, e.g. \"/\" → home page handler, \"/login\" → login handler, \"/products\" → product listing handler, \"/order\" and \"/payment\" for checkout. This keeps each page's logic isolated."));

children.push(h2("CRUD operations"));
children.push(...bullets(["Create — signup, new order", "Read — view products/orders, verify login", "Update — accept/reject an order, change status", "Delete — remove a completed/cancelled order"]));

children.push(h2("Authentication"));
children.push(p("Both customers and the admin log in against stored credentials before they can reach protected functionality (checkout, admin dashboard). Note for interviews: the original report stores passwords in plain text — the honest, mature answer is to acknowledge that and say you'd hash with bcrypt/Argon2 in production."));

children.push(h2("Session handling (concept)"));
children.push(p("The base project doesn't implement full server-side sessions. If asked, the correct answer is: \"A production version would keep the user logged in using secure cookies or server-side sessions, rather than asking for credentials on every request.\""));

children.push(h2("File upload (photo cakes)"));
children.push(p("Customers upload a reference image (birthday photo, theme, logo). The backend reads the file and stores it as a BLOB in SQLite alongside the order record."));

children.push(h2("Payment gateway integration"));
children.push(p("On checkout, if the customer picks online payment, the backend calls the Razorpay API, which opens a hosted payment window; on success Razorpay returns a confirmation that the backend uses to update the order's payment status. This means the app never directly handles card/UPI details — offloading PCI-DSS compliance to Razorpay."));

children.push(h2("Automation (WhatsApp + birthdays)"));
children.push(p("PyWhatKit sends WhatsApp messages programmatically. Two triggers: (1) order-status changes — the owner clicking Accept/Reject fires a message; (2) a scheduled check compares today's date against stored birthdays and messages customers a couple of days ahead."));

children.push(h2("Deployment"));
children.push(p("Code lives on GitHub; Render is connected to the repo and auto-builds/deploys on every push — installing dependencies from requirements.txt and running the Bottle app, giving a public URL."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 6. CHALLENGES ----------
children.push(h1("6. Challenges Faced & How They Were Solved"));
const challenges = [
  ["Multiple features to integrate", "Payments, WhatsApp, image upload and DB writes all had to work together in one checkout flow.", "Built and tested each feature in isolation first, then integrated them incrementally."],
  ["Handling online payments safely", "Didn't want to handle raw card/bank details ourselves.", "Delegated to Razorpay, which handles compliance and returns just a success/failure confirmation."],
  ["Automating WhatsApp reliably", "No official free WhatsApp Business API for a small project.", "Used PyWhatKit (and PyAutoGUI for GUI automation) to script message sending."],
  ["Avoiding data duplication", "Customer info was needed across signup, orders and accepted-orders.", "Split into separate normalized tables (customer / orders / accepted orders) to reduce redundancy."],
  ["Deployment", "The app only worked locally at first.", "Connected GitHub to Render for automatic build & deploy, learning dependency/environment management along the way."],
  ["Secure-enough authentication", "Needed to restrict ordering to registered users.", "Built a signup/login flow that verifies credentials before allowing checkout (with hashing flagged as a future improvement)."],
  ["Order management for the owner", "Owner needed an easy way to track many incoming orders.", "Built an admin dashboard with accept/reject/mark-delivered/delete actions."],
  ["Keeping the customer flow simple", "Risk of customers dropping off mid-checkout.", "Minimized steps: browse → buy → login → review → pay → done."],
];
for (const [title, problem, solution] of challenges) {
  children.push(bold(title));
  children.push(p("Problem: " + problem));
  children.push(p("Solution: " + solution));
}
children.push(h2("Biggest overall learning"));
children.push(p("Understanding how frontend, backend, database, a third-party API and deployment all fit together to deliver one working real-world application — not just isolated coding exercises."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 7. FUTURE / SECURITY / SCALE ----------
children.push(h1("7. Future Improvements, Security & Scalability"));
children.push(h2("If given 6 more months"));
children.push(...bullets([
  "Migrate SQLite → PostgreSQL for concurrency and reliability.",
  "Proper password hashing (bcrypt/Argon2) and HTTPS everywhere.",
  "Move uploaded images from DB BLOBs to cloud storage (S3/GCS/Azure Blob), storing only URLs.",
  "Introduce Redis caching for frequently viewed products/homepage.",
  "Convert the backend into REST APIs and move slow tasks (WhatsApp, email) to background workers (Celery/RQ).",
  "Add live order tracking, a coupon/referral system, customer reviews, an analytics dashboard, and eventually a mobile app.",
]));

children.push(h2("Security hardening (if asked directly)"));
children.push(...bullets([
  "Password hashing instead of plain-text storage.",
  "Parameterized SQL queries to prevent SQL injection.",
  "Input validation on email, phone, address and uploaded files (type & size limits).",
  "HTTPS for all traffic; secure session cookies with auto-logout.",
  "Rate limiting on login to blunt brute-force attempts.",
  "Role-based access control separating customer vs admin vs future manager roles.",
]));

children.push(h2("Scaling to ~1 million users"));
children.push(p("Current setup (browser → single Bottle server → SQLite) suits hundreds to a few thousand users. A scaled version would look like: users → load balancer → multiple app server instances → Redis cache → PostgreSQL/MySQL (with replication) → cloud object storage for images. The backend would be exposed as REST APIs so a mobile app or SPA frontend could reuse it, with Nginx/HAProxy or a cloud load balancer distributing traffic."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 8. RESUME BULLETS + Q&A ----------
children.push(h1("8. Resume Bullets, Justification & Cross-Questions"));
children.push(p("Suggested resume header: ", ));
children.push(bold("Online Cake Ordering Website — Python | Bottle | HTML/CSS | SQLite | Razorpay API | Render | GitHub"));

children.push(...resumeBulletBlock(
  "Developed a full-stack online cake ordering website enabling customers to browse products, customize cakes, upload reference images, and place online orders.",
  "Explain this point.",
  "I built an e-commerce site for a local bakery, Arya Cake Magic. Customers browse cake categories, customize by uploading a reference image, choose weight, and place an order. Backend is Python + Bottle; frontend is HTML/CSS; SQLite stores customer and order data."
));
children.push(...resumeBulletBlock(
  "Integrated Razorpay Payment Gateway to support secure online payments alongside Cash on Delivery.",
  "Why Razorpay?",
  "It supports UPI, cards, wallets and net banking, offers secure processing, and integrates easily with Python — so we didn't need to build our own payment infrastructure.",
  ["Why not build your own payment gateway?", "A payment gateway needs PCI-DSS compliance and secure transaction handling. Using Razorpay gave us trusted payment functionality without owning that sensitive infrastructure ourselves."]
));
children.push(...resumeBulletBlock(
  "Implemented WhatsApp automation for birthday reminders and order status notifications.",
  "How does this work?",
  "PyWhatKit sends WhatsApp messages programmatically. Birthday reminders go out a couple of days ahead based on stored birthdates; order accepted/rejected notifications fire when the owner updates order status.",
  ["Why WhatsApp specifically?", "Most customers already use WhatsApp daily, so it's faster and more engaging than email, and it encourages repeat purchases."]
));
children.push(...resumeBulletBlock(
  "Designed an admin dashboard for managing customer orders and delivery status.",
  "What features were available?",
  "View all orders, accept/reject, mark delivered, delete completed orders, view customer details, payment mode, and send WhatsApp notifications.",
  ["Why separate admin and customer views?", "Customers should only reach ordering functionality, while the owner needs management tools — separating the two improves both usability and security."]
));
children.push(...resumeBulletBlock(
  "Deployed the application on Render with GitHub-based version control.",
  "Explain the deployment.",
  "The repo lives on GitHub, connected to Render. Render auto-builds on every push — installing dependencies and running the app — giving a public URL and simplifying future updates."
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 9. BEHAVIORAL ----------
children.push(h1("9. Behavioral & HR Questions"));
children.push(...qa("Tell me about your role in the project.", "This was a team project. I focused on understanding the overall architecture, backend workflow, database design, deployment and the integration pieces — and made sure I could explain the system end-to-end, including parts I didn't personally write."));
children.push(...qa("How did your team divide the work?", "We split roughly by strength — frontend, database, payment integration, testing — but reviewed each other's work regularly so everyone understood the full system and integration stayed smooth."));
children.push(...qa("Biggest challenge?", "Integrating payment, WhatsApp messaging, image upload and database writes into one coherent checkout flow. We built and tested each piece independently, then integrated step by step."));
children.push(...qa("Biggest mistake?", "Early on we focused purely on features and not enough on security/scalability — we later recognized the need for password hashing and a design that could support more users."));
children.push(...qa("What would you improve?", "Migrate to PostgreSQL, add proper password hashing, move images to cloud storage, add caching, and expose REST APIs for a future mobile app."));
children.push(...qa("What did you learn overall?", "How the layers of a web app — frontend, backend, database, third-party APIs, deployment — fit together, and how to turn a real business's requirements into working software."));
children.push(...qa("Why are you proud of this project?", "It was built for a real business, not just as an academic exercise, and it solved genuine problems: online ordering, payments, customer communication and order management."));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 10. QUICK-FIRE CHEAT SHEET ----------
children.push(h1("10. Quick-Fire Cheat Sheet (last-minute recall)"));
children.push(...bullets([
  "One-liner: E-commerce site for a real bakery — browse, customize, pay online/COD, WhatsApp reminders, admin dashboard.",
  "Stack: Python + Bottle · HTML/CSS/JS · SQLite · Razorpay · PyWhatKit · Render/GitHub.",
  "Architecture: 3-tier — frontend / Bottle backend / SQLite, Razorpay & WhatsApp as external integrations.",
  "Two user roles: Customer and Owner (Admin).",
  "Core flow: browse → buy now → login → upload image → choose payment → order saved → owner accepts → WhatsApp update → delivered.",
  "Known weaknesses (own them, don't hide them): plain-text passwords, SQLite concurrency limits, no formal sessions, single-server deployment.",
  "Go-to \"future work\" answer: PostgreSQL + password hashing + HTTPS + cloud image storage + Redis caching + REST APIs + background workers.",
  "If unsure who coded a specific line: be honest — say it was a team effort and describe what you personally understand/own.",
]));

// ---------- Build doc ----------
const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 } } }, // US Letter
    children,
  }],
  styles: {
    default: {
      document: { run: { size: 22, font: "Calibri" } },
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: ACCENT }, paragraph: { spacing: { before: 300, after: 150 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "333333" }, paragraph: { spacing: { before: 200, after: 100 } } },
    ],
  },
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("cake_shop_proejct.docx", buf);
  console.log("written");
});