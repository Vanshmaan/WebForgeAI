import extractJson from "../utility/extractJson.js";
import generateResponse from "../config/openRouter.js"
import Website from "../models/website.model.js";
import User from "../models/user.model.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;


export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.credits < 50) {
      return res.status(400).json({ message: "not enough credits" });
    }

    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);

    let parsed = null;
    let raw = "";

    for (let i = 0; i < 2; i++) {
      raw = await generateResponse(finalPrompt);

      try {
        parsed = await extractJson(raw);
      } catch (e) {
        console.log("JSON PARSE FAILED:", raw);
        parsed = null;
      }

      if (parsed?.code) break;
    }

    if (!parsed || !parsed.code) {
      console.log("RAW AI OUTPUT:", raw);
      return res.status(400).json({
        message: "AI returned invalid JSON",
      });
    }

    const slug =
      prompt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) +
      "-" +
      Date.now();

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 60),
      slug,
      latestCode: parsed.code,
      conversation: [
        {
          role: "ai",
          content: parsed.message,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      websiteId: website._id,
      slug: website.slug,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.log("FULL ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getWebsiteById = async (req,res) => {
    try {
        const website = await Website.findOne({
            _id:req.params.id,
            user:req.user._id
        })
        if(!website){
            return res.status(400).json({message : "Website not found"})
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({message : `get website by id error ${error}`})
    }
}


export const changes = async (req,res) => {
    try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }
     const website = await Website.findOne({
            _id:req.params.id,
            user:req.user._id
        })
        if(!website){
            return res.status(400).json({message : "Website not found"})
        }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.credits < 25) {
      return res.status(400).json({ message: "not enough credits" });
    }

 const updatePrompt = `
You are updating an existing HTML website.

Return ONLY valid JSON in this exact format:

{
  "message": "Short confirmation",
  "code": "<FULL UPDATED HTML>"
}

RULES:
- NO markdown
- NO explanation
- ONLY raw JSON
- HTML must be complete and working

CURRENT CODE:
${website.latestCode}

USER REQUEST:
${prompt}
`;

    let parsed = null;
    let raw = "";

    for (let i = 0; i < 2; i++) {
      raw = await generateResponse(updatePrompt);
      try {
  parsed = await extractJson(raw);
} catch (e) {
  console.log("JSON PARSE FAILED:", raw);
  parsed = null;
}

      if (parsed?.code) break;
    }

    if (!parsed || !parsed.code) {
      console.log("RAW AI OUTPUT:", raw); // 🔥 important debug
      return res.status(400).json({ message: "AI returned invalid JSON" });
    }

    website.conversation.push(
        {
        role:"user",
        content:prompt
    },
        {
        role:"ai",content:parsed.message
    })

    website.latestCode = parsed.code

    await website.save()

     user.credits -= 25;
    await user.save();

    return res.status(200).json({
      message : parsed.message,
      code : parsed.code,
      remainingCredits: user.credits
    });



    } catch (error) {
        return res.status(500).json({message : `update website error ${error}`})
        
    }
}

export const getAll = async (req,res) => {
    try {
        const websites = await Website.find({user:req.user._id})
        return res.status(200).json(websites)
    } catch (error) {
        return res.status(500).json({message : `get all website error ${error}`})
    }
}

export const deploy = async (req,res) => {
    try {
        const website = await Website.findOne({
            _id:req.params.id,
            user:req.user._id
        })
        if(!website){
            return res.status(400).json({message : "Website not found"})
        }

        if(!website.slug){
            website.slug = website.title.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,60) + website._id.toString().slice(-5)
        }

        website.deployed = true
        website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`
        await website.save()

        return res.status(200).json({
            url:website.deployUrl
        })
    } catch (error) {
         return res.status(500).json({message : `deploy website error ${error}`})
    }
}

export const getBySlug = async (req,res) => {
    try {
        const website = await Website.findOne({
            slug:req.params.slug,
            deployed:true
        })
        if(!website){
            return res.status(400).json({message : "Website not found"})
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({message : `get by slug website error ${error}`})
    }
}