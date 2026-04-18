/* eslint-disable no-console */
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tl235np0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error(
    '\nMissing SANITY_API_TOKEN in .env.local.\n' +
      'Create one with Editor permissions at:\n' +
      `  https://www.sanity.io/manage/project/${projectId}/api\n` +
      '(Settings → API → Tokens → Add API token), then re-run.\n'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

/* ── Portable Text helpers ────────────────────────────────────
   Deterministic keys (document-id scoped + running index) so re-seeding
   doesn't churn Sanity diff history. */

type PortableBlock = {
  _type: 'block'
  _key: string
  style: string
  children: Array<{ _type: 'span'; _key: string; text: string; marks: string[] }>
  markDefs: Array<Record<string, unknown>>
  listItem?: 'bullet'
  level?: number
}

function makeBlockFactory(docId: string) {
  let counter = 0
  const key = () => `${docId}-b${(counter++).toString().padStart(3, '0')}`

  const block = (
    style: string,
    text: string,
    listItem?: 'bullet'
  ): PortableBlock => {
    const blockKey = key()
    return {
      _type: 'block',
      _key: blockKey,
      style,
      children: [
        { _type: 'span', _key: `${blockKey}-s0`, text, marks: [] },
      ],
      markDefs: [],
      ...(listItem ? { listItem, level: 1 } : {}),
    }
  }

  return {
    p: (text: string) => block('normal', text),
    h3: (text: string) => block('h3', text),
    li: (text: string) => block('normal', text, 'bullet'),
  }
}

type WritingSeed = {
  _id: string
  title: string
  description: string
  date: string
  imagePath?: string
  order: number
  text: PortableBlock[]
}

function ieBlacktopsBody(): PortableBlock[] {
  const { p, h3, li } = makeBlockFactory('writing-ie-blacktops-la-terminals')
  return [
    p("Nearly 15 years later, I can finally make sense of my elementary school computer lab addiction. The range of exploration that the late 2000s Hemet Unified District network offered us web-hungry students was limited — to say the least — but there wasn't a student in the valley whose keyboard shortcut game was as polished as 10-year-old Benjamin Uribe's."),
    p("I'm a product of after-school programs and restless web exploring. Sitting here today, 23 years old in a city just far enough from home that some call the City of Angels, I've come to realize that decade-long questions can still be answered — and that purpose has a way of reimagining itself in later forms."),
    p("Why did I have all that time? My parents — Ben and Lashawn Uribe — are teachers, and have been since long before I was in the picture. They are the context for everything I am: the fuel, the confidence, the pride. Growing up, the last bell at the end of each school day was for everyone but me. While other kids headed home, I was still there — designing imaginary soccer jerseys with chalk on the blacktop, or sneaking back into the computer lab to log another hour on Club Penguin. Six years of letting my mind wander turned into something I didn't have a name for yet: a storytelling persona. A voice. A way of communicating a feeling by showing — this is what I see, from me."),
    p("My parents' prioritization of education instilled a discipline and standard of care that carried me through everything that followed. But more than that, watching the profound impact their work had on students — year after year, classroom after classroom — planted something in me early: a belief that knowledge is most meaningful when it's given away. Not a single decision I've made as a designer has been without the intention of returning what I've learned to the underrepresented, underfunded communities I grew up immersed in. That's not a mission statement — it's just home."),
    p("Today, I define myself as a designer and educator, and for the first time, these two roles share the same timeline. At Fuser, where I work on the next generation of collaborative creative workspaces, I design with code and bring our team's shipped features to life through tutorials and walkthroughs published to our social channels (yes, they have an INTJ speaking to a webcam on a weekly basis). Being open with my team about my long-term aspirations in design education created space for my role to grow in that direction — and what once would have felt like the most anxiety-inducing responsibility a person of my personality could take on has become exactly the kind of discomfort I needed. Transformation rarely announces itself; it just shows up dressed like a task you almost said no to."),

    h3('What I\u2019ve Learned About IxD Leadership'),
    p("Courses like Strategies: People, Process, and Leadership were the draws that brought me to ArtCenter as a postgraduate opportunity. I knew technical skills, visual design, and project development would be part of the curriculum at such an established institution, but what I recognized as missing inside myself was something harder to acquire independently: the ability to present not just the work, but the story behind it, with myself as the vessel. This course has been one of the most practically useful things I've encountered in my education, precisely because it sits at the intersection of what I do every day and the leader I'm actively becoming."),
    p("The design leader I chose to study this semester is Ryo Lu, Head of Design at Cursor — and by his own definition, a toolmaker to the highest degree. Following his online presence, I found Ryo deeply relatable for his quiet yet not shy nature, a description that tends to be assigned to me as well."),
    p("Ryo's work history speaks for itself — his resume spans Stripe, Notion, and Asana — but his philosophy was the real draw when I first started coming across his profiles. He has been one of the leading voices arguing that the distance between designer and developer is collapsing, and that a builder's mindset is what fills the gap. Ryo treats code as a material — like clay — something to shape an idea with rather than hand off. In a conversation with Jackson Dahl's Dialectic podcast, Lu put it plainly: \u201CYou learn by making, not planning. For software makers, that's code, at the most basic level\u201D (Lu, 2025). At Cursor, that philosophy is organizational: \u201Croles between designers, PMs, engineers are muddy. We just do what it takes based on each person's unique strengths and use the AI agent to tie everything together\u201D (Lu qtd. in Wong, 2025). It's design-engineers like Ryo who inspired my perspective shift on what tools I'm entitled to know."),
    p("On the organizational side of the assignment, I examined Anthropic, the safety-first AI company that generated no shortage of news coverage during my research. Design at Anthropic, as I learned, isn't primarily visual — despite the rapid shipping tendencies they've practiced this year. Since their founding, Anthropic has prioritized AI and behavioral safety at its core, a detail that struck me in comparison to other major AI players — a badge their founders (former OpenAI members) wear with pride."),
    p("The work of shaping how Claude thinks, responds, and earns trust is design work, and it lives at the core of all their products (Claude, Cowork, Code, etc.). Anthropic operates at the model level rather than primarily the interface level — they made the terminal cool again, and that has to stand for something."),
    p("Bridging my profile of Ryo with the patterns I gathered from Anthropic, I observed that in both cases the most impactful designers right now are the ones fluent in systems — whether that's a codebase, an org structure, or an AI model's values. What challenged my assumptions most was the realization that leadership in IxD isn't about owning a vision alone; it's about building the conditions for others to execute one. Ryo ships. Anthropic publishes its research (and now ships at the speed of light). Both are acts of generosity that also happen to be acts of leadership, even as they represent competing organizations."),

    h3('The Future of Design Leadership'),
    p("It's frightening how much screen time it takes to stay current in a field moving at the speed of prompts — especially while working 9-to-3 and attending school 4-to-7, five days a week. This is the reality; the industry demands it of us. But I feel grounded in the projections I hold for the field."),
    p("Drawing on figures like Ryo Lu, adding perspectives from my backlog of DiveClub episodes and Twitter bookmarks, I see a future of positional merging. It's no longer enough to be a skilled \u201Ctool-person\u201D or \u201Cidea-person\u201D — shipping is the currency, and the parameters of what \u201Cdesign\u201D means are being redefined. Fortunately for those of us at ArtCenter, our cohort's receptiveness to new tools like Cursor, Claude Code, Paper, and Figma Make has allowed us to get our hands dirty with experiments and prototypes before these become career staples. Agents, MCPs, markdown files, skills, rules — the new vocabulary I've had to absorb as a non-traditionally trained designer-developer over the past year has been nothing short of exciting. For designers, the mentality must remain that of a learner first: staying open-minded and regularly adding capabilities that make us valuable in the age of fast shipping."),
    p("Looking at how my own stack has evolved since January 2025, I've gone from being a Figma and Framer novice to nearly setting both aside altogether in favor of Cursor agents, markdown files, and UI skill markdowns. Operating closer to the development layer now, my fluency in React — both writing it and prompting for it — has grown to the point where I routinely teach friends and coworkers best practices and the importance of end-to-end influence. In a recent episode of Lenny's Podcast, Jenny Wen of Anthropic articulates this shift directly: \u201CThe design role is stretching and spanning — we're all becoming more PM-shaped, we're all becoming engineering-shaped. If you already have strong skills in a few different buckets, it's really easy to flex around and expand your role\u201D (Wen, 2025). She goes further in the same episode, issuing a warning as much as a forecast: \u201CThis design process that designers have been taught, we sort of treat it as gospel. That's basically dead\u201D (Wen qtd. in TeamDay.ai, 2026)."),
    p("The pressure is coming from engineering's side too. Figma CEO Dylan Field has argued that AI has inverted the old dynamic between design and product: in the era of AI-assisted building, craft and quality become a startup's primary competitive advantage rather than an afterthought (Field, 2025). That thesis runs parallel to what I've been living at Fuser — where shipping taste-first has been central to how a small team has produced outsized output."),
    p("Going forward, I believe the era of the polished Figma file as the primary deliverable may be closing. The \u201Ctranslator\u201D designer — one who operates on taste and implementation in code — will define this pivotal stage of software development. I'm optimistic that everyone who cares enough about the practice will find their niche. But if I had to name the must-haves for design leaders at this stage, the list would be:"),
    li("Abandon ownership for impact — there's no time for gatekeeping"),
    li('Move from presenter to participant — get into the codebase'),
    li('Tool mastery is a trap — be tool-agile instead'),
    li('System taste rules'),

    h3('Organizational & Operational Implications'),
    p("The way design integrates into a company has always been a proxy for how seriously that company takes the people using what it builds (Airbnb being a well-documented example). In future-forward organizations, that integration is arriving earlier, running deeper, and becoming harder to separate from the work itself — something I've witnessed firsthand as a design intern at one of LA's fastest-moving startups, Fuser."),
    p("At the startup level, we only recently hired our first traditional designer — after shipping an entire product on the backs of craft-first developers. This reflects the multidisciplinary necessity of early-stage budgets, but also a genuine alignment with the product. Our team is small, but we cover many bases, and our first twelve months as a public product have been successful. Decisions carry enormous weight at the startup level, and I believe a significant part of our progress stems from pairing design craft with shipping velocity. At the enterprise level, the challenge appears to be the inverse: how do you reintroduce that sensibility into an organization that has spent years optimizing for process over perception? Increasingly, the answer is that design leaders must operate less like practitioners and more like culture architects."),
    p("Mouthwash Studio co-founder Alex Tan put this balance into words with unusual precision: \u201CIn 2025, we understand that a successful design studio isn't the practice of doing one of those things well, but rather the ability to hold all three things at once\u201D — referring to great work, sustainable business, and a culture where people feel connected (Tan, 2025). That framing resonates whether you're running a 20-person studio or sitting inside a fast-moving startup. The studios and companies I admire most have all figured out how to hold those things simultaneously."),

    h3('The Role of Emerging Technologies + My POV'),
    p("While I can only speak from experience at a sub-20-person startup, I'm bullish on agentic models furthering the importance of systems design — rather than nullifying it in favor of quick shipment. In an interview with Ridd of DiveClub, Ian Sibler describes how agentic prototyping has allowed his design organization to push design systems further by building models in-house (Sibler, 2024). In this view, it's anti-stagnation, building on the principles that made design systems successful in the first place."),
    p("The broader signal across companies moving in this direction is empowerment — whether it's PMs, designers, or engineers, anyone with an idea can now execute it with what feels like an infinite toolset. We, as software designers, are better for it. A deployment link with functional interactions communicates far more than a low-to-mid-fidelity prototype sitting in a Figma canvas. Expectations have shifted toward demonstrable work. Ryo Lu frames this succinctly: \u201CThe communication of a deployment link that has functional items far exceeds any prototype that only dwells in a Figma canvas\u201D (Lu, 2025). At Fuser, the excitement around showing a working prototype in meetings has become a defining part of our team culture."),
    p("Though I may be biased by recent experience, I find it difficult to fully trust software leadership that lacks design education — formal or informal. Not only are these environments healthier from a designer's perspective, but the understanding of what goes into ideation and prototyping is elevated in a way that consistently prioritizes usability and clarity. Equally important in these dynamics is a culture of ownership: giving team members the opportunity to take charge of an idea transforms concepts from playground material into intentional paths for users to encounter."),
    p("Jenny Wen reinforces this from inside Anthropic, noting that the speed at which engineers can now ship — running multiple AI agents simultaneously — has fundamentally restructured how design must operate within product teams: designers can no longer afford to block engineers with lengthy discovery cycles \u201Cwhen code ships in hours\u201D (Wen qtd. in TeamDay.ai, 2026). The implication isn't that design matters less — it's that design judgment has to live earlier, faster, and closer to the build."),

    h3('North Star Vision'),
    p("What am I building toward? A studio practice rooted in my Chicano identity that proves people like me belong at the forefront of technically ambitious, exploratory web products — not as a footnote or token user persona, but front and center. In the long term, I plan to return to my familial roots in education, becoming a professor at one of my alma maters so I can more directly serve the next generation of designers."),
    p("The impact of this trajectory is twofold: raise the floor for what underrepresented communities can expect from tools built for them, and raise the ceiling for what Latino designers are seen as capable of building. I treat the end product as my own — ownership! — but I will go further. I treat the community as my own, because it is."),
  ]
}

const WRITING_SEEDS: WritingSeed[] = [
  {
    _id: 'writing-ie-blacktops-la-terminals',
    title: 'IE Blacktops, LA Terminals',
    description:
      'Craft, code, and community: reimagining interaction design leadership from the Inland Empire to AI agents',
    date: '2026-04-18',
    imagePath: 'public/images/writing/ie-blacktops-la-terminals.png',
    order: 0,
    text: ieBlacktopsBody(),
  },
]

async function uploadImage(absPath: string): Promise<string> {
  const filename = path.basename(absPath)
  const asset = await client.assets.upload('image', createReadStream(absPath), {
    filename,
  })
  return asset._id
}

async function run() {
  console.log(
    `Seeding ${WRITING_SEEDS.length} writing entries into "${dataset}" (project ${projectId})...\n`
  )

  for (const seed of WRITING_SEEDS) {
    let imageRef: string | undefined
    if (seed.imagePath) {
      const abs = path.resolve(process.cwd(), seed.imagePath)
      imageRef = await uploadImage(abs)
      console.log(`  • uploaded image for ${seed._id}: ${imageRef}`)
    }

    const doc = {
      _id: seed._id,
      _type: 'writing',
      title: seed.title,
      description: seed.description,
      date: seed.date,
      order: seed.order,
      text: seed.text,
      ...(imageRef
        ? {
            image: {
              _type: 'image',
              asset: { _type: 'reference', _ref: imageRef },
            },
          }
        : {}),
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ ${seed.title} (${seed.text.length} blocks)`)
  }

  console.log('\nDone. Refresh /writing to see the entry.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
