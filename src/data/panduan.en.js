/**
 * English version of the Remote Working Guide (see panduan.js).
 * Keyed by slug. List fields follow the same order as the Indonesian version.
 * Fields left out here fall back to the Indonesian text.
 */

export const LEVEL_EN = {
  "Ramah pemula": "Beginner-friendly",
  "Butuh latihan": "Needs practice",
  "Butuh keahlian": "Needs expertise",
};

export const PROFESI_EN = {
  "virtual-assistant": {
    judul: "Virtual Assistant",
    ringkas: "Handle admin work for business owners remotely: email, scheduling, data, and small research tasks.",
    modal: "Laptop, stable internet, written English",
    intro:
      "A virtual assistant (VA) takes care of administrative tasks for business owners, coaches, or small teams who don't have time to do everything themselves. Many clients are based in the US, Australia, and Europe, so English and time discipline matter more than a degree.",
    tugas: [
      "Organising inboxes and replying to routine messages",
      "Scheduling meetings in Google Calendar across the client's time zone",
      "Entering and tidying data in Google Sheets or a CRM",
      "Small research tasks: finding prospect contacts, comparing vendor prices",
      "Preparing documents, simple presentations, and weekly reports",
    ],
    skill: ["Written English communication", "Google Workspace (Gmail, Calendar, Sheets, Docs)", "Time management", "Careful and organised", "Asking before making mistakes"],
    tools: ["Google Workspace", "Trello or Asana", "Slack", "Canva", "ChatGPT for email drafts"],
    penghasilan: [
      { label: "Overseas clients, beginners in Asia", nilai: "from around US$5 per hour" },
      { label: "Typical VA rates on Upwork", nilai: "US$10 to 20 per hour" },
    ],
    langkah: [
      { judul: "Pick 2 to 3 core services", isi: "Don't offer everything. Start with what you do best, such as inbox management, data entry, and scheduling." },
      { judul: "Master Google Workspace", isi: "Almost every client uses it. Practise basic Sheets formulas, document sharing, and scheduling across time zones." },
      { judul: "Build sample work", isi: "Create 2 or 3 samples: a weekly report template, a sample customer email reply, or a clean data spreadsheet. Keep them in Google Drive and share the link." },
      { judul: "Set up your profile", isi: "Polish your LinkedIn, then create a profile on one freelance platform. Say clearly what you offer, who it's for, and the hours you can cover in the client's time zone." },
      { judul: "Apply with a personal message", isi: "Read the whole listing, mention the client's need in your first sentence, then explain how you'll handle it. Copy-pasted applications are easy to spot." },
      { judul: "Start with small projects", isi: "Your first projects are for reviews and experience. After 3 to 5 good reviews, raise your rate gradually." },
    ],
    platform: ["LinkedIn", "Upwork", "Fiverr", "Sribulancer", "Glints and Jobstreet (remote filter)"],
    waspada: [
      "Being asked to pay a training fee or 'deposit' before starting",
      "Being asked to receive other people's money through your personal account",
      "A client who wants to move off the platform before a contract and first payment",
    ],
  },
  "customer-support": {
    judul: "Remote Customer Support",
    ringkas: "Answer customer questions and complaints by chat, email, or phone from home.",
    modal: "Laptop, stable internet, headset, quiet room",
    intro:
      "Customer support is the face of a company to its customers. Many start-ups, online shops, and overseas companies hire support agents who work from home, often in shifts. Patience and clear writing count for more than a degree.",
    tugas: [
      "Replying to customer chats and emails within response-time targets",
      "Helping customers track orders, refunds, or account problems",
      "Logging every case in the ticketing system",
      "Escalating technical issues to the right team",
      "Feeding common complaints back to the product team",
    ],
    skill: ["Empathy and calm with angry customers", "Short, clear writing", "Fast and accurate typing", "English for overseas companies", "Learning new products quickly"],
    tools: ["Zendesk, Freshdesk, or Intercom", "WhatsApp Business", "Google Workspace", "Slack"],
    penghasilan: [
      { label: "Customer service, fresh graduate (Indonesia)", nilai: "Rp3 to 4.5 million per month" },
      { label: "Customer service, 1 to 2 years (Indonesia)", nilai: "Rp4 to 6 million per month" },
    ],
    catatanGaji: "These figures are for customer service roles in general, not specifically remote. Overseas companies usually pay in dollars at different rates.",
    langkah: [
      { judul: "Practise writing replies", isi: "Take 10 customer complaints from any app's reviews and write replies that are polite, short, and solve the problem. These can go straight into your portfolio." },
      { judul: "Learn a ticketing system", isi: "Many ticketing tools offer free trials and learning material. Understand terms like ticket, SLA, escalation, and macros." },
      { judul: "Prepare your equipment", isi: "A headset with a clear mic, backup internet (such as mobile data), and a quiet room. Companies often ask about this in interviews." },
      { judul: "Search with the right keywords", isi: "Try customer support, customer service, chat support, or customer success, then filter for remote." },
      { judul: "Be ready for tests", isi: "Support hiring often includes typing tests, written reply tests, or call simulations. Practise answering real cases against the clock." },
    ],
    platform: ["Jobstreet and Glints (remote filter)", "LinkedIn", "Tech company career sites", "Upwork"],
    waspada: [
      "'Online CS' jobs that end up asking you to recruit other people",
      "Being asked to buy equipment or uniforms through the company",
      "Very high pay for a job that needs no experience",
    ],
  },
  "admin-media-sosial": {
    judul: "Social Media Admin",
    ringkas: "Run Instagram, TikTok, and other accounts for businesses: content, posting schedules, and replying to comments.",
    modal: "Phone with a good camera, laptop, Canva, CapCut",
    intro:
      "Almost every business needs an active social media presence, but owners rarely have the time. A social media admin plans content, creates or schedules posts, replies to comments, and reports the results. Many manage several clients at once from home.",
    tugas: [
      "Building a monthly content calendar",
      "Designing feed posts and short videos",
      "Writing captions and choosing hashtags",
      "Replying to comments and direct messages",
      "Reporting reach and engagement each month",
    ],
    skill: ["Writing engaging captions", "Basic design and short video editing", "Understanding each platform's algorithm", "Reading Insights data", "Consistent and on time"],
    tools: ["Canva", "CapCut", "Meta Business Suite", "Google Sheets for content calendars", "ChatGPT for content ideas"],
    penghasilan: [
      { label: "Junior social media specialist (Indonesia)", nilai: "Rp4.5 to 6.5 million per month" },
      { label: "Beginner freelancer, per client", nilai: "around Rp500 thousand to 1.5 million per month" },
    ],
    catatanGaji: "Freelance rates per client depend heavily on how many posts are included each month. State the number of posts clearly in your offer.",
    langkah: [
      { judul: "Run one account as proof", isi: "A family business, a friend's account, or a themed account you create yourself. Run it consistently for 1 to 2 months and track the growth." },
      { judul: "Create service packages", isi: "For example: 12 feed posts and 8 stories a month, including captions and replying to comments during working hours. Clear packages make decisions easier for clients." },
      { judul: "Prepare a visual portfolio", isi: "Collect your best designs, a sample content calendar, and Insights screenshots (before and after) in one PDF or Notion page." },
      { judul: "Pitch local small businesses", isi: "Cafés, clothing shops, clinics, and local services often need help. Send a short message with one suggestion to improve their account." },
      { judul: "Report results every month", isi: "A simple report with reach, engagement, and next month's plan keeps clients around longer." },
    ],
    platform: ["Your own Instagram and LinkedIn", "Glints and Jobstreet (remote filter)", "Fastwork", "Sribulancer"],
    waspada: [
      "'Like and follow tasks' paid per task that later ask for a deposit for 'premium tasks'",
      "Being asked to log in to a client account through a suspicious link",
    ],
  },
  "content-writer": {
    judul: "Content Writer",
    ringkas: "Write articles, product descriptions, and content scripts for websites and social media.",
    modal: "Laptop, clean writing, willingness to learn SEO",
    intro:
      "Content writers produce blog articles, product descriptions, video scripts, and marketing emails. The work suits home-based setups because the output is text. AI speeds up drafting, so what companies look for now are writers who can research, edit, and write with a distinct voice.",
    tugas: [
      "Researching topics and keywords",
      "Writing articles to a brief and deadline",
      "Editing your own drafts and AI drafts",
      "Writing product descriptions and captions",
      "Updating old articles so they stay relevant",
    ],
    skill: ["Clean spelling and grammar", "Research and fact-checking", "Basic SEO (keywords, titles, structure)", "Matching a brand's tone of voice", "Using AI without sounding robotic"],
    tools: ["Google Docs", "Google Search Console or a keyword tool", "WordPress", "Grammarly or an online dictionary", "ChatGPT for outlines"],
    penghasilan: [
      { label: "Content writer, 0 to 2 years (Indonesia)", nilai: "Rp4 to 5.5 million per month" },
      { label: "Beginner freelancer, per 500 to 1,000-word article", nilai: "around Rp50 to 150 thousand" },
      { label: "Typical content writer rates on Upwork", nilai: "US$30 to 59 per hour" },
    ],
    langkah: [
      { judul: "Choose one or two niches", isi: "Such as personal finance, technology, health, or parenting. Writers with a clear niche earn trust faster and can charge more." },
      { judul: "Write 3 strong samples", isi: "Publish them on Medium, a personal blog, or LinkedIn: one long SEO article, one product description, and one casual piece." },
      { judul: "Learn basic SEO", isi: "Understand how to choose keywords, write titles people search for, and structure subheadings. This is what separates ordinary writers from in-demand ones." },
      { judul: "Set a per-word or per-article rate", isi: "Be clear about what's included: research, how many revisions, and whether images are part of it. This prevents misunderstandings." },
      { judul: "Build long-term relationships", isi: "Happy clients usually bring regular work. Deliver on time and suggest topic ideas without being asked." },
    ],
    platform: ["LinkedIn", "Upwork", "Sribulancer", "Projects.co.id", "Glints and Jobstreet (remote filter)"],
    waspada: [
      "Paid 'writing tests' or tests of 5 full articles without pay",
      "Clients who use your writing and disappear. Ask for a deposit on large projects.",
    ],
  },
  "desainer-grafis": {
    judul: "Freelance Graphic Designer",
    ringkas: "Create logos, social media content, packaging, and promotional material for clients anywhere.",
    modal: "A capable laptop, Canva or Adobe, a portfolio",
    intro:
      "Graphic designers create the visual side of a brand: logos, Instagram feeds, posters, packaging, and presentations. Clients almost always judge by portfolio, not degree, so you can start from anywhere as long as the work is good.",
    tugas: [
      "Turning a client brief into a visual concept",
      "Creating logos and brand identities",
      "Designing social media content and promotional material",
      "Preparing print-ready or upload-ready files",
      "Revising based on client feedback",
    ],
    skill: ["Design principles: typography, colour, composition", "Canva, then Adobe Illustrator or Figma", "Understanding briefs and asking the right questions", "Managing revisions", "Organised file handling"],
    tools: ["Canva", "Adobe Illustrator and Photoshop", "Figma", "Behance or Dribbble for your portfolio"],
    penghasilan: [
      { label: "Beginner graphic designer, 0 to 2 years (Indonesia)", nilai: "Rp4 to 6 million per month" },
      { label: "Graphic designer, 1 to 3 years (Indonesia)", nilai: "Rp6 to 8.5 million per month" },
    ],
    catatanGaji: "Freelance projects are usually priced per design or per package. Compare similar projects on freelance platforms before setting your price.",
    langkah: [
      { judul: "Learn design basics first", isi: "Tools are quick to learn, but good-looking design comes from understanding typography, colour, and white space." },
      { judul: "Create realistic mock projects", isi: "Redesign the logo and feed of a local business you know, with the reasoning behind your choices. It's the fastest way to fill a portfolio." },
      { judul: "Showcase on Behance or Dribbble", isi: "Pick your 6 to 8 best pieces. A few strong ones beat many average ones." },
      { judul: "Define packages and revision limits", isi: "For example: a logo with 3 initial concepts and 2 rounds of revision. Revision limits protect your time." },
      { judul: "Ask for a deposit", isi: "For new clients, ask for 30 to 50 percent up front. Send final files after full payment." },
    ],
    platform: ["Fiverr", "Upwork", "Behance", "Dribbble", "Fastwork", "Sribulancer"],
    waspada: [
      "'Design contests' that ask for finished work with no guaranteed pay",
      "Clients asking for source files before paying",
    ],
  },
  "data-entry": {
    judul: "Data Entry",
    ringkas: "Enter, clean, and check data. Easy to start, but also where most scams are.",
    modal: "Laptop, fast typing, Excel or Google Sheets",
    intro:
      "Data entry means entering and tidying data: from documents into spreadsheets, from forms into systems, or checking data for errors. It's often a first step into remote work, but rates tend to be low and many fake listings use the data entry label. Read the warning section carefully.",
    tugas: [
      "Moving data from documents or images into spreadsheets",
      "Removing duplicates and inconsistent formats",
      "Double-checking data for errors",
      "Entering product data in online stores",
      "Making simple summaries from data",
    ],
    skill: ["Fast and accurate typing", "Excel or Google Sheets (filters, VLOOKUP, pivot)", "Careful and consistent", "Keeping data confidential"],
    tools: ["Microsoft Excel", "Google Sheets", "Google Forms", "OCR tools to read text from images"],
    penghasilan: [
      { label: "Example Indonesian-language data annotation job", nilai: "US$2.45 per hour, 30 to 40 hours a week" },
      { label: "Average net income of freelance workers in Indonesia", nilai: "Rp1.68 million per month" },
    ],
    catatanGaji: "Pure data entry usually pays little. To earn more, grow into work that needs more skill, such as data admin, junior data analyst, or virtual assistant.",
    langkah: [
      { judul: "Master spreadsheets", isi: "Learn filter, sort, VLOOKUP or XLOOKUP, removing duplicates, and pivot tables. That's what makes you faster and better paid." },
      { judul: "Measure your typing speed", isi: "Practise on a typing test site until you're steadily above 40 words per minute with high accuracy. Put the number on your CV." },
      { judul: "Create sample work", isi: "Take messy public data, clean it, and keep the before and after versions. Share them as your portfolio." },
      { judul: "Search in trustworthy places", isi: "Prioritise listings from companies with a real name, website, and official email. Check them first in Jobly's Fake Job Checker before sending personal details." },
      { judul: "Level up", isi: "Once you're comfortable, learn basic data analysis or broader admin tasks. Data entry should be a first step, not the end goal." },
    ],
    platform: ["Jobstreet and Glints (remote filter)", "LinkedIn", "Upwork", "Company career sites"],
    waspada: [
      "Being asked to pay registration, training, or 'account activation' fees",
      "'Typing jobs from your phone' with very high daily pay",
      "Being asked for your ID card photo and a selfie before any interview. This data can be used to take out online loans in your name.",
      "Tasks like giving likes, ratings, or watching videos that eventually ask for a deposit",
    ],
  },
  "video-editor": {
    judul: "Short-Form Video Editor",
    ringkas: "Edit short videos for TikTok, Reels, and YouTube Shorts for creators and businesses.",
    modal: "A capable laptop or phone, CapCut or Premiere",
    intro:
      "Short video is the most in-demand format on social media, and many creators and businesses don't have time to edit their own. Short-form editors cut raw footage, add text, music, and effects, and make videos people watch to the end. Demand is high, including from overseas clients.",
    tugas: [
      "Cutting long recordings into several short clips",
      "Adding subtitles, text, music, and transitions",
      "Resizing videos for each platform",
      "Adjusting colour and audio so they're clean",
      "Delivering on the client's posting schedule",
    ],
    skill: ["Editing rhythm that keeps viewers watching", "Readable subtitles and text", "Understanding each platform's trends", "Handling large files neatly"],
    tools: ["CapCut", "Adobe Premiere Pro or DaVinci Resolve", "Google Drive to send files", "Royalty-free music libraries"],
    penghasilan: [{ label: "Typical AI video editor rates on Upwork", nilai: "US$10 to 60 per hour" }],
    catatanGaji: "Locally, rates are usually per video or per monthly package. Compare similar offers on freelance platforms.",
    langkah: [
      { judul: "Start with CapCut", isi: "CapCut is free and enough for most short videos. Once you're fluent, learn Premiere or DaVinci for bigger projects." },
      { judul: "Re-edit existing videos", isi: "Download a podcast or interview that's free to use and cut it into 5 short clips. It shows you can pick the best moments." },
      { judul: "Make a 30-second showreel", isi: "Combine your best cuts into one short video. Clients rarely watch long portfolios." },
      { judul: "Offer one trial video", isi: "For creators you want to work with, offer to edit one video from their footage. If it works, move to a monthly package." },
    ],
    platform: ["Upwork", "Fiverr", "LinkedIn", "Creator communities on Instagram and TikTok"],
    waspada: ["Clients who ask for several free 'test' videos in a row"],
  },
  "anotasi-data-ai": {
    judul: "AI Data Annotator",
    ringkas: "Label text, images, or audio so AI can learn. Indonesian language skills are a selling point.",
    modal: "Laptop, stable internet, attention to detail, good Indonesian",
    intro:
      "AI companies need many people to check and label data: rating chatbot answers, marking objects in images, or summarising articles. Native Indonesian speakers are wanted for Indonesian-language projects. The work is project-based, so hours can go up and down.",
    tugas: [
      "Reading Indonesian content and answering structured questions",
      "Marking parts of images or screenshots as instructed",
      "Rating and correcting AI answers",
      "Writing short summaries",
    ],
    skill: ["Reading long instructions carefully", "Good, correct Indonesian", "Staying consistent over long periods", "English for reading project guidelines"],
    tools: ["The company's annotation platform", "Google Workspace"],
    penghasilan: [{ label: "Example: Indonesian Data Annotator (Careerflow)", nilai: "US$2.45 per hour, 30 to 40 hours a week, no experience needed" }],
    catatanGaji: "Projects that need specialist knowledge (such as law, medicine, or programming) usually pay much more.",
    langkah: [
      { judul: "Search with the right keywords", isi: "Try data annotator, AI trainer, AI rater, or Indonesian language specialist." },
      { judul: "Prepare for tests", isi: "Most selection is a 15 to 60-minute language or accuracy test, without an interview. Stay calm and read the instructions to the end." },
      { judul: "Protect your quality in week one", isi: "Early quality scores usually decide whether you get more tasks. Slow and accurate beats fast and sloppy." },
      { judul: "Use your other expertise", isi: "If you have a background in a specific field, look for AI projects in that field. They pay more." },
    ],
    platform: ["LinkedIn", "AI company and data provider career sites", "Upwork"],
    waspada: [
      "Genuine AI projects never charge a registration fee or sell 'work accounts'",
      "Be wary of Telegram groups selling 'annotator accounts' or 'project slots'",
    ],
  },
  "tutor-online": {
    judul: "Online Tutor",
    ringkas: "Teach over video calls: English, school subjects, or Indonesian for foreigners.",
    modal: "Laptop with a camera, stable internet, quiet room",
    intro:
      "If you know a subject well and enjoy explaining, online teaching can be a flexible remote job. Students can come from Indonesia (school tutoring, exam prep) or abroad, such as foreigners who want to learn Indonesian.",
    tugas: [
      "Preparing material and exercises for each session",
      "Teaching over Zoom or Google Meet",
      "Setting homework and tracking student progress",
      "Coordinating schedules with parents or students",
    ],
    skill: ["Strong command of the subject", "Explaining things simply", "Patience and reading students' needs", "Running an online class"],
    tools: ["Zoom or Google Meet", "Google Slides or Canva", "Google Classroom", "A digital whiteboard"],
    catatanGaji: "Tutor rates vary widely depending on the subject, student level, and platform. Compare with other tutors on your chosen platform before setting a per-session price.",
    langkah: [
      { judul: "Pick a subject and level", isi: "Such as junior high maths, conversational English, IELTS prep, or Indonesian for foreign speakers." },
      { judul: "Record an intro video", isi: "A 1 to 2-minute video about you and how you teach. Many tutoring platforms require one." },
      { judul: "Start with your own network", isi: "Offer trial sessions to people you know, then ask for written testimonials." },
      { judul: "Join a tutoring platform", isi: "Platforms bring you students and take a commission in return. Read the terms before signing up." },
    ],
    platform: ["Online tutoring platforms", "Parent communities on social media", "LinkedIn"],
    waspada: ["Platforms that charge an expensive registration fee before you have any students"],
  },
  "admin-keuangan": {
    judul: "Finance Admin & Bookkeeper",
    ringkas: "Record transactions, reconcile bank statements, and prepare simple financial reports for small businesses.",
    modal: "Laptop, accounting basics, Excel",
    intro:
      "Many small businesses need tidy books but aren't ready for a full-time finance hire. Remote bookkeepers record transactions, match bank statements, and prepare monthly reports. Accounting graduates and former finance admins have a strong head start here.",
    tugas: [
      "Recording income and expenses",
      "Reconciling bank statements with the records",
      "Creating and sending invoices",
      "Preparing simple profit and loss statements and balance sheets",
      "Helping prepare data for tax matters",
    ],
    skill: ["Accounting basics", "Intermediate Excel", "Careful with numbers", "Keeping client data confidential"],
    tools: ["Microsoft Excel or Google Sheets", "Accounting software such as Jurnal, Accurate, or Xero", "Internet banking"],
    penghasilan: [{ label: "Typical accountant rates on Upwork", nilai: "US$12 to 32 per hour" }],
    langkah: [
      { judul: "Strengthen your accounting basics", isi: "Understand journals, ledgers, and basic financial statements. A certificate or short course adds client trust." },
      { judul: "Learn one accounting software", isi: "Local clients often use Indonesian software, while overseas clients tend to use Xero or QuickBooks." },
      { judul: "Create sample reports", isi: "Do one month of books for a fictional business, including a profit and loss statement. That's your portfolio." },
      { judul: "Pitch small businesses", isi: "Many owners know their books are messy. Offer a monthly package with a clear price." },
    ],
    platform: ["LinkedIn", "Upwork", "Jobstreet and Glints (remote filter)", "Small business communities"],
    waspada: ["Being asked to move client money into your personal account or a third party's account"],
  },
};

export const INSIGHT_EN = {
  "mulai-kerja-remote": {
    judul: "Starting Remote Work from Zero",
    ringkas: "Choose a field, set up your equipment, and plan your first 30 days.",
    bagian: [
      {
        judul: "Understand the reality first",
        isi: "Remote work gives you freedom of time and place, but competition is wider because you're up against applicants from everywhere. Income is often unstable at first. For reference, the average net income of freelance workers in Indonesia in February 2026 was around Rp1.68 million per month according to BPS. Those earning well above that usually have clear expertise and regular clients.",
      },
      {
        judul: "Pick one field first",
        isi: "Start with the skill closest to your experience. Admin graduates can start as virtual assistants, people who like writing can become content writers, and people who edit videos often can become video editors. Focus on one field for the first 3 months.",
      },
      {
        judul: "Minimum equipment",
        poin: ["A laptop that runs your work smoothly", "Main and backup internet (mobile data)", "A headset with a clear mic", "A quiet place to work", "A professional email with your real name"],
      },
      {
        judul: "Your first 30 days",
        poin: [
          "Week 1: learn the basics of your chosen field",
          "Week 2: create 2 to 3 portfolio samples",
          "Week 3: polish your CV, LinkedIn, and one freelance platform profile",
          "Week 4: send at least 15 personal applications and track the results",
        ],
      },
      {
        judul: "Get used to working across time zones",
        isi: "Overseas clients can be 5 to 12 hours behind Jakarta. State your working hours in the client's time zone, and use a calendar that shows two time zones at once.",
      },
    ],
  },
  "portofolio-tanpa-pengalaman": {
    judul: "Building a Portfolio Without Experience",
    ringkas: "No clients yet? Here's how to show your skills with self-made projects.",
    bagian: [
      {
        judul: "A portfolio matters more than a CV",
        isi: "For remote work, clients want to see results, not just a list of experience. Three relevant samples are often more convincing than a two-page CV.",
      },
      {
        judul: "Create projects that resemble real work",
        poin: [
          "Virtual assistant: a weekly report template, a sample email reply, a tidy spreadsheet",
          "Social media admin: a one-month content calendar and 9 feed designs for a local business",
          "Content writer: one SEO article, one product description, one video script",
          "Designer: a redesigned logo for a local business with the reasoning behind it",
          "Video editor: 5 short clips from one long video",
        ],
      },
      {
        judul: "Explain the context",
        isi: "For each piece, briefly describe the problem, what you did, and the result. Being honest that it's a practice project doesn't reduce its value.",
      },
      {
        judul: "Where to keep your portfolio",
        poin: ["Google Drive with a link anyone can open", "Notion for a simple portfolio page", "Behance or Dribbble for designers", "Medium or LinkedIn for writers"],
      },
      {
        judul: "Keep it updated",
        isi: "Each time you finish a real project, replace practice work with real work (with the client's permission).",
      },
    ],
  },
  "dapat-klien-pertama": {
    judul: "Landing Your First Client or Remote Job",
    ringkas: "Write applications and proposals that get read, not skipped.",
    bagian: [
      {
        judul: "Search in several places at once",
        poin: [
          "Remote jobs on Jobly, Jobstreet, Glints, and LinkedIn",
          "Freelance platforms such as Upwork, Fiverr, Sribulancer, and Projects.co.id",
          "Your own network: friends, former colleagues, communities",
          "Businesses around you that clearly need help",
        ],
      },
      {
        judul: "An effective proposal structure",
        poin: [
          "First sentence: restate the client's need in your own words",
          "Second sentence: explain how you'll solve it",
          "Attach one most relevant sample, not everything",
          "Close with one question about the project",
          "Keep it to 5 to 8 sentences",
        ],
      },
      {
        judul: "Sample opening",
        isi: "\"Hi, I see you need help cleaning 2,000 customer records in Google Sheets and removing duplicates. I regularly use filters and formulas to clean data, as in the example at this link. Is the data in one file, or spread across several?\"",
      },
      {
        judul: "Don't stop at one application",
        isi: "It's normal for only 1 or 2 out of 20 applications to get a reply at first. Track your applications, see which ones get answers, and improve your approach. Jobly's My Applications and Application Plan features can help you keep track.",
      },
      {
        judul: "After your first client",
        isi: "Deliver neater work than expected, share progress without being asked, then request a review or testimonial. A happy first client often brings the next one.",
      },
    ],
  },
  "dibayar-klien-luar-negeri": {
    judul: "Getting Paid by Overseas Clients",
    ringkas: "PayPal, Payoneer, Wise, or through a platform: know your options before sending an invoice.",
    bagian: [
      {
        judul: "Through freelance platforms",
        isi: "If you work through Upwork or Fiverr, the platform handles payment. You receive a balance after commission, then withdraw it to an available bank account or e-wallet. Check the latest commission and withdrawal options on the platform's help pages, as terms can change.",
      },
      {
        judul: "Options for direct clients",
        poin: [
          "PayPal: widely known among overseas clients. Watch the receiving fees and exchange rate when withdrawing to rupiah.",
          "Payoneer: offers receiving accounts in foreign currencies and is widely used by freelancers.",
          "Wise: conversion fees are usually transparent. Check which currencies can be received on an account registered in Indonesia.",
          "International bank transfer (SWIFT): can go straight to an Indonesian bank account, but intermediary banks usually take a cut.",
        ],
      },
      {
        judul: "Calculate what you actually receive",
        isi: "Exchange rates and fees can eat several percent of your pay. Before agreeing to a rate, work out the net amount in rupiah with Jobly's Salary Calculator.",
        tautanLabel: "Open the Salary Calculator",
      },
      {
        judul: "Send a tidy invoice",
        poin: ["Your name and contact, the client's name", "Invoice number and date", "Itemised work and amounts", "Currency and payment method", "Payment due date"],
      },
      {
        judul: "Protect yourself",
        isi: "With new clients, ask for a deposit or staged payments. Never accept an 'overpayment' and then refund the difference. It's a common scam.",
      },
    ],
  },
  "pajak-freelancer": {
    judul: "Tax for Freelancers and Remote Workers",
    ringkas: "Income from overseas clients still has to be reported. The basics you need to know in 2026.",
    bagian: [
      {
        judul: "Overseas income is still taxable",
        isi: "As a resident of Indonesia, your income is taxed in Indonesia, whether it comes from local or overseas clients. It is reported in your annual tax return (SPT Tahunan).",
      },
      {
        judul: "Freelancing counts as independent work",
        isi: "On the tax return form, freelancers choose Independent Work (Pekerjaan Bebas) as their income source. If your annual turnover is no more than Rp4.8 billion, you can use the Deemed Profit Norm (NPPN), so you only need simple records instead of full bookkeeping.",
      },
      {
        judul: "Notify your use of NPPN on time",
        isi: "Use of NPPN must be notified through DJP's Coretax no later than the first three months of the tax year. For tax year 2026 the deadline was 31 March 2026. If you don't notify, you're treated as having chosen full bookkeeping.",
      },
      {
        judul: "2026 change: the 0.5 percent final tax isn't for everyone",
        isi: "Since 22 April 2026, under PP 20/2026, a number of independent professions can no longer use the 0.5 percent final income tax rate. The list includes experts such as consultants, teachers and trainers, authors and translators, and online content creators. Professions on that list use the regular progressive rates, and may use NPPN if turnover is below Rp4.8 billion.",
      },
      {
        judul: "Helpful habits",
        poin: [
          "Record every incoming payment: date, client, amount, and currency",
          "Keep invoices and transfer receipts",
          "Use a separate account for work income",
          "If in doubt, ask the tax office or a tax consultant",
        ],
      },
    ],
    catatan: "This summary is an introduction, not tax advice. Rules can change, so check the latest at pajak.go.id or ask a tax consultant.",
  },
  "kenali-penipuan-kerja-online": {
    judul: "Spotting Online Job Scams",
    ringkas: "Warning signs of fake listings that most often trap beginner job seekers.",
    bagian: [
      {
        judul: "Why this matters",
        isi: "Job scams are growing, from schemes that ask for money to ones that lure victims abroad. More than 3,200 Indonesians have been recorded in online scam cases in Southeast Asia, and more than 1,100 of them were identified as victims of human trafficking.",
      },
      {
        judul: "The most common red flags",
        poin: [
          "Being asked to pay anything: registration, training, uniforms, tickets, or deposits",
          "Very high pay for easy work that needs no experience",
          "Recruitment only through WhatsApp or Telegram, with no official website or email",
          "Being asked for your ID card, family card, or a selfie before any interview",
          "Like, rating, or video-watching tasks that eventually ask for a deposit",
          "Overseas job offers on a tourist visa or without a clear contract",
        ],
      },
      {
        judul: "How to check a listing",
        poin: [
          "Search the company name and recruiter's number online",
          "Match the listing with the company's official career site",
          "Make sure the recruiter's email uses the company domain, not Gmail",
          "Paste the listing into Jobly's Fake Job Checker to see its red flags",
        ],
        tautanLabel: "Open the Fake Job Checker",
      },
      {
        judul: "If it has already happened",
        isi: "Keep all chat and transfer evidence, contact your bank to hold the transaction, and report it to the police. If you've already sent personal data, watch out for online loan applications in your name.",
      },
    ],
  },
};
