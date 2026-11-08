# Humanizer: Full Pattern Reference

Based on Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup). Patterns 1-29 are from the source; patterns 30-34 and the marketing/blog cliché list are later additions.

**Key insight:** LLMs use statistical algorithms to guess what should come next, so output tends toward the most statistically likely completion. That is how these telltale patterns get baked in.

## Voice Calibration (optional)

If the user provides a writing sample, analyze it before rewriting:

1. **Read the sample first.** Note:
   - Sentence length patterns (short and punchy? Long and flowing? Mixed?)
   - Word choice level (casual? academic? between?)
   - How they start paragraphs (jump in? Set context first?)
   - Punctuation habits (dashes? Parenthetical asides? Semicolons?)
   - Recurring phrases or verbal tics
   - How they handle transitions (explicit connectors? Just start the next point?)
2. **Match their voice.** Swap in patterns from the sample. If they write short sentences, do not produce long ones. If they use "stuff" and "things," do not upgrade to "elements" and "components."
3. **No sample provided?** Fall back to the natural, varied, opinionated default below.

### How to provide a sample
- Inline: "Humanize this. Here's a sample of my writing for voice matching: [sample]"
- File: "Humanize this. Use my writing style from [file path] as a reference."

## PERSONALITY AND SOUL

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious as slop.

### Signs of soulless writing (even if technically clean):
- Every sentence the same length and structure
- No opinions, just neutral reporting
- No acknowledgment of uncertainty or mixed feelings
- No first-person perspective when appropriate
- No humor, no edge, no personality
- Reads like a Wikipedia article or press release

### How to add voice:
- **Have opinions.** Report the facts, then react. "I genuinely don't know how to feel about this" beats listing neutral pros and cons.
- **Vary your rhythm.** Short punchy sentences. Then longer ones that take their time. Mix it up.
- **Acknowledge complexity.** "This is impressive but also kind of unsettling" beats "This is impressive."
- **Use "I" when it fits.** First person reads as honest.
- **Let some mess in.** Tangents, asides, and half-formed thoughts are human.
- **Be specific about feelings.** "There's something unsettling about agents churning away at 3am while nobody's watching" beats "this is concerning."

### Before (clean but soulless):
> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

### After (has a pulse):
> I genuinely don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle, but I keep thinking about those agents working through the night.

## CONTENT PATTERNS

### 1. Undue Emphasis on Significance, Legacy, Broader Trends
**Watch:** stands/serves as, is a testament/reminder, vital/pivotal/key role/moment, underscores/highlights its importance, reflects broader, symbolizing its enduring, setting the stage for, marking/shaping, represents a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted
**Before:** The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain. This initiative was part of a broader movement across Spain to decentralize administrative functions.
**After:** The Statistical Institute of Catalonia was established in 1989 to collect and publish regional statistics independently from Spain's national statistics office.

### 2. Undue Emphasis on Notability and Media Coverage
**Watch:** independent coverage, local/regional/national media outlets, written by a leading expert, active social media presence
**Before:** Her views have been cited in The New York Times, BBC, Financial Times, and The Hindu. She maintains an active social media presence with over 500,000 followers.
**After:** In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

### 3. Superficial Analyses with -ing Endings
**Watch:** highlighting/underscoring/emphasizing, ensuring, reflecting/symbolizing, contributing to, cultivating/fostering, encompassing, showcasing
**Before:** The temple's color palette of blue, green, and gold resonates with the region's natural beauty, symbolizing Texas bluebonnets, the Gulf of Mexico, and the diverse Texan landscapes, reflecting the community's deep connection to the land.
**After:** The temple uses blue, green, and gold colors. The architect said these were chosen to reference local bluebonnets and the Gulf coast.

### 4. Promotional and Advertisement-like Language
**Watch:** boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking, renowned, breathtaking, must-visit, stunning
**Before:** Nestled within the breathtaking region of Gonder in Ethiopia, Alamata Raya Kobo stands as a vibrant town with a rich cultural heritage and stunning natural beauty.
**After:** Alamata Raya Kobo is a town in the Gonder region of Ethiopia, known for its weekly market and 18th-century church.

### 5. Vague Attributions and Weasel Words
**Watch:** Industry reports, Observers have cited, Experts argue, Some critics argue, several sources (when few cited)
**Before:** Due to its unique characteristics, the Haolai River is of interest to researchers and conservationists. Experts believe it plays a crucial role in the regional ecosystem.
**After:** The Haolai River supports several endemic fish species, according to a 2019 survey by the Chinese Academy of Sciences.

### 6. Outline-like "Challenges and Future Prospects" Sections
**Watch:** Despite its... faces several challenges, Despite these challenges, Challenges and Legacy, Future Outlook
**Before:** Despite its industrial prosperity, Korattur faces challenges typical of urban areas, including traffic congestion and water scarcity. Despite these challenges, with its strategic location and ongoing initiatives, Korattur continues to thrive.
**After:** Traffic congestion increased after 2015 when three new IT parks opened. The municipal corporation began a stormwater drainage project in 2022 to address recurring floods.

## LANGUAGE AND GRAMMAR PATTERNS

### 7. Overused "AI Vocabulary" Words
**High-frequency AI words:** actually, additionally, align with, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adj), landscape (abstract), pivotal, showcase, tapestry, testament, underscore, valuable, vibrant
**Marketing/blog clichés :** at the end of the day, when it comes to, in a world where, moving forward, circle back, deep dive, game-changer, double down, take a step back, on the same page, make no mistake, it turns out, let me be clear, navigate (challenges), lean into, unpack, straightforward (for anything)
**Before:** Additionally, a distinctive feature of Somali cuisine is the incorporation of camel meat. An enduring testament to Italian colonial influence is the widespread adoption of pasta in the local culinary landscape, showcasing how these dishes have integrated into the traditional diet.
**After:** Somali cuisine also includes camel meat, considered a delicacy. Pasta dishes, introduced during Italian colonization, remain common, especially in the south.

### 8. Avoidance of "is"/"are" (Copula Avoidance)
**Watch:** serves as/stands as/marks/represents [a], boasts/features/offers [a]
**Before:** Gallery 825 serves as LAAA's exhibition space for contemporary art. The gallery features four separate spaces and boasts over 3,000 square feet.
**After:** Gallery 825 is LAAA's exhibition space for contemporary art. The gallery has four rooms totaling 3,000 square feet.

### 9. Negative Parallelisms and Tailing Negations
"Not only...but...", "It's not just about..., it's...", and clipped tailing-negation fragments ("no guessing") are overused.
**Before:** It's not just about the beat riding under the vocals; it's part of the aggression and atmosphere. It's not merely a song, it's a statement.
**After:** The heavy beat adds to the aggressive tone.
**Before (tailing):** The options come from the selected item, no guessing.
**After:** The options come from the selected item without forcing the user to guess.

### 10. Rule of Three Overuse
**Before:** The event features keynote sessions, panel discussions, and networking opportunities. Attendees can expect innovation, inspiration, and industry insights.
**After:** The event includes talks and panels. There's also time for informal networking between sessions.

### 11. Elegant Variation (Synonym Cycling)
**Before:** The protagonist faces many challenges. The main character must overcome obstacles. The central figure eventually triumphs. The hero returns home.
**After:** The protagonist faces many challenges but eventually triumphs and returns home.

### 12. False Ranges
"From X to Y" where X and Y aren't on a meaningful scale.
**Before:** Our journey through the universe has taken us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars to the enigmatic dance of dark matter.
**After:** The book covers the Big Bang, star formation, and current theories about dark matter.

### 13. Passive Voice and Subjectless Fragments
Hides the actor or drops the subject ("No configuration file needed").
**Before:** No configuration file needed. The results are preserved automatically.
**After:** You do not need a configuration file. The system preserves the results automatically.

## STYLE PATTERNS

### 14. Em Dash Overuse
**Before:** The term is primarily promoted by Dutch institutions—not by the people themselves. You don't say "Netherlands, Europe" as an address—yet this mislabeling continues—even in official documents.
**After:** The term is primarily promoted by Dutch institutions, not by the people themselves. You don't say "Netherlands, Europe" as an address, yet this mislabeling continues in official documents.

### 15. Overuse of Boldface
**Before:** It blends **OKRs (Objectives and Key Results)**, **KPIs (Key Performance Indicators)**, and visual tools such as the **Business Model Canvas (BMC)** and **Balanced Scorecard (BSC)**.
**After:** It blends OKRs, KPIs, and visual strategy tools like the Business Model Canvas and Balanced Scorecard.

### 16. Inline-Header Vertical Lists
**Before:**
> - **User Experience:** The user experience has been significantly improved with a new interface.
> - **Performance:** Performance has been enhanced through optimized algorithms.
> - **Security:** Security has been strengthened with end-to-end encryption.
**After:** The update improves the interface, speeds up load times through optimized algorithms, and adds end-to-end encryption.

### 17. Title Case in Headings
**Before:** ## Strategic Negotiations And Global Partnerships
**After:** ## Strategic negotiations and global partnerships

### 18. Emojis
**Before:** 🚀 **Launch Phase:** The product launches in Q3 / 💡 **Key Insight:** Users prefer simplicity / ✅ **Next Steps:** Schedule follow-up
**After:** The product launches in Q3. User research showed a preference for simplicity. Next step: schedule a follow-up meeting.

### 19. Curly Quotation Marks
ChatGPT uses curly quotes instead of straight quotes. Replace with straight quotes.

## COMMUNICATION PATTERNS

### 20. Collaborative Communication Artifacts
**Watch:** I hope this helps, Of course!, Certainly!, You're absolutely right!, Would you like..., let me know, here is a...
**Before:** Here is an overview of the French Revolution. I hope this helps! Let me know if you'd like me to expand on any section.
**After:** The French Revolution began in 1789 when financial crisis and food shortages led to widespread unrest.

### 21. Knowledge-Cutoff Disclaimers
**Watch:** as of [date], Up to my last training update, While specific details are limited/scarce, based on available information
**Before:** While specific details about the company's founding are not extensively documented in readily available sources, it appears to have been established sometime in the 1990s.
**After:** The company was founded in 1994, according to its registration documents.

### 22. Sycophantic/Servile Tone
**Before:** Great question! You're absolutely right that this is a complex topic. That's an excellent point about the economic factors.
**After:** The economic factors you mentioned are relevant here.

## FILLER AND HEDGING

### 23. Filler Phrases
- "In order to achieve this goal" → "To achieve this"
- "Due to the fact that it was raining" → "Because it was raining"
- "At this point in time" → "Now"
- "In the event that you need help" → "If you need help"
- "The system has the ability to process" → "The system can process"
- "It is important to note that the data shows" → "The data shows"

### 24. Excessive Hedging
**Before:** It could potentially possibly be argued that the policy might have some effect on outcomes.
**After:** The policy may affect outcomes.

### 25. Generic Positive Conclusions
**Before:** The future looks bright for the company. Exciting times lie ahead as they continue their journey toward excellence. This represents a major step in the right direction.
**After:** The company plans to open two more locations next year.

### 26. Hyphenated Word Pair Overuse
**Watch:** third-party, cross-functional, client-facing, data-driven, decision-making, well-known, high-quality, real-time, long-term, end-to-end. Humans rarely hyphenate these uniformly. Technical compound modifiers are fine.
**Before:** The cross-functional team delivered a high-quality, data-driven report on our client-facing tools. Their decision-making process was well-known for being thorough and detail-oriented.
**After:** The cross functional team delivered a high quality, data driven report on our client facing tools. Their decision making process was known for being thorough and detail oriented.

### 27. Persuasive Authority Tropes
**Watch:** The real question is, at its core, in reality, what really matters, fundamentally, the deeper issue, the heart of the matter
**Before:** The real question is whether teams can adapt. At its core, what really matters is organizational readiness.
**After:** The question is whether teams can adapt. That mostly depends on whether the organization is ready to change its habits.

### 28. Signposting and Announcements
**Watch:** Let's dive in, let's explore, let's break this down, here's what you need to know, now let's look at, without further ado
**Before:** Let's dive into how caching works in Next.js. Here's what you need to know.
**After:** Next.js caches data at multiple layers, including request memoization, the data cache, and the router cache.

### 29. Fragmented Headers
A heading followed by a one-line paragraph that restates the heading.
**Before:** ## Performance / Speed matters. / When users hit a slow page, they leave.
**After:** ## Performance / When users hit a slow page, they leave.

## STYLE, RHYTHM, AND RHETORIC PATTERNS 

### 30. Forced Metaphors and Figurative Overwriting
Decorative metaphors that add imagery without meaning, often explained right after. If a metaphor doesn't earn its place, cut it.
**Before:** The codebase is a garden we must tend, pruning dead branches and planting seeds of innovation so the whole ecosystem can flourish. In other words, delete unused code and add features.
**After:** Delete unused code and add the features users are asking for.

### 31. Dramatic Fragmentation and Punchy Kickers
Two/three-word subjectless sentences for drama, "X. And Y. And Z." runs, quotable mic-drop lines ending sections, cutesy appositive fragments. Distinct from pattern 13: here the tell is rhythm and showmanship, not a hidden actor.
**Before:** The catalog, honestly priced. Pay for what it does. Not promises. It just works. Every time.
**After:** The catalog is priced by usage, so you pay for the calls you actually make rather than a flat monthly fee.

### 32. Rhetorical Questions Answered Immediately
**Watch:** "What if...?", "The question is...", "Ever wondered...?", a question followed by its own answer, "Think about it."
**Before:** What makes an API good? It comes down to predictability. Think about it: developers want to know exactly what they will get back.
**After:** A good API is predictable, so developers know exactly what they will get back.

### 33. Sentence-Opener Tics
**Watch:** So..., Look,, habitual sentence-initial And/But, "I think"/"I believe" for a fact, adverb openers (Interestingly, Importantly, Notably, Crucially, Essentially, Ultimately)
**Before:** So, the results were mixed. Interestingly, adoption went up. Importantly, churn went up too. I think that means the feature still needs work.
**After:** The results were mixed: adoption rose, but churn rose alongside it, so the feature still needs work.

### 34. Reassurance Kickers
**Watch:** And that's okay., And that's fine., There's nothing wrong with that., no shame in..., you're not alone, it's completely normal
**Before:** You might not have a testing setup yet. And that's okay. Plenty of teams start without one, and there's nothing wrong with that.
**After:** Many teams start without a testing setup and add one once regressions begin costing real time.

## Full Worked Example

**Before (AI-sounding):**
> Great question! Here is an essay on this topic. I hope this helps!
>
> AI-assisted coding serves as an enduring testament to the transformative potential of large language models, marking a pivotal moment in the evolution of software development. In today's rapidly evolving technological landscape, these groundbreaking tools—nestled at the intersection of research and practice—are reshaping how engineers ideate, iterate, and deliver, underscoring their vital role in modern workflows.
>
> At its core, the value proposition is clear: streamlining processes, enhancing collaboration, and fostering alignment. It's not just about autocomplete; it's about unlocking creativity at scale, ensuring that organizations can remain agile while delivering seamless, intuitive, and powerful experiences to users. The tool serves as a catalyst. The assistant functions as a partner. The system stands as a foundation for innovation.
>
> Industry observers have noted that adoption has accelerated from hobbyist experiments to enterprise-wide rollouts, from solo developers to cross-functional teams. The technology has been featured in The New York Times, Wired, and The Verge. Additionally, the ability to generate documentation, tests, and refactors showcases how AI can contribute to better outcomes, highlighting the intricate interplay between automation and human judgment.
>
> - 💡 **Speed:** Code generation is significantly faster, reducing friction and empowering developers.
> - 🚀 **Quality:** Output quality has been enhanced through improved training, contributing to higher standards.
> - ✅ **Adoption:** Usage continues to grow, reflecting broader industry trends.
>
> While specific details are limited based on available information, it could potentially be argued that these tools might have some positive effect. Despite challenges typical of emerging technologies—including hallucinations, bias, and accountability—the ecosystem continues to thrive. In order to fully realize this potential, teams must align with best practices.
>
> In conclusion, the future looks bright. Exciting times lie ahead as we continue this journey toward excellence. Let me know if you'd like me to expand on any section!

**Draft rewrite:**
> AI coding assistants speed up some tasks. In a 2024 study by Google, developers using Codex completed simple functions 55% faster than a control group, but showed no improvement on debugging or architectural decisions.
>
> The tools are good at boilerplate: config files, test scaffolding, repetitive refactors. They are bad at knowing when they are wrong. I have mass-accepted suggestions that compiled, passed lint, and still did the wrong thing because I stopped paying attention.
>
> Mira, an engineer at a fintech startup I interviewed, said she uses Copilot "like autocomplete for boring code" but reviews every line before committing. Jake, a senior dev at a larger company, disabled it after it kept suggesting patterns from a deprecated internal library.
>
> The productivity claims are hard to verify. GitHub says Copilot users "accept 30% of suggestions," but acceptance is not correctness, and correctness is not value. The 2024 Uplevel study found no statistically significant difference in pull-request throughput between teams with and without AI assistants.
>
> None of this means the tools are useless. It means they are tools. They do not replace judgment, and they do not eliminate the need for tests. If you do not have tests, you cannot tell whether the suggestion is right.

**What makes the below so obviously AI generated?**
- The rhythm is still a bit too tidy (clean contrasts, evenly paced paragraphs).
- The named people and study citations can read like plausible-but-made-up placeholders unless they're real and sourced.
- The closer leans a touch slogan-y ("If you do not have tests...") rather than sounding like a person talking.

**Now make it not obviously AI generated.**
> AI coding assistants can make you faster at the boring parts. Not everything. Definitely not architecture.
>
> They're great at boilerplate: config files, test scaffolding, repetitive refactors. They're also great at sounding right while being wrong. I've accepted suggestions that compiled, passed lint, and still missed the point because I stopped paying attention.
>
> People I talk to tend to land in two camps. Some use it like autocomplete for chores and review every line. Others disable it after it keeps suggesting patterns they don't want. Both feel reasonable.
>
> The productivity metrics are slippery. GitHub can say Copilot users "accept 30% of suggestions," but acceptance isn't correctness, and correctness isn't value. If you don't have tests, you're basically guessing.

**Changes made:** removed chatbot artifacts, significance inflation, promotional language, vague attributions, superficial -ing phrases, negative parallelism, rule-of-three and synonym cycling, false ranges, em dashes, emojis, boldface headers, curly quotes, copula avoidance, formulaic challenges section, knowledge-cutoff hedging, excessive hedging, filler and persuasive framing, generic positive conclusions; made the voice more personal with varied rhythm.

## Attribution

Ported from [blader/humanizer](https://github.com/blader/humanizer) (MIT), based on [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup). Original author: Siqi Chen ([@blader](https://github.com/blader)), version 2.5.1. Patterns 1-29 and examples are from the source. Patterns 30-34 and the marketing/blog cliché list are later additions. MIT license preserved in the `LICENSE` file.
