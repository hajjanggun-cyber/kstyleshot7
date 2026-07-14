const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "content", "hub", "en");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));

const tips = [
  {
    title: "## 💡 Editor's Real-Life Tip",
    text: "From my own experience exploring Seoul, you don't always need to follow the exact trendy path. Sometimes the best spots are just one alley away from the main streets. Make sure to check the weather and operating hours in advance, as they can change without notice!",
    table: "| Checklist | Importance | Editor's Note |\n|---|---|---|\n| **Timing** | ⭐⭐⭐⭐⭐ | Beat the crowds by going early! |\n| **Weather** | ⭐⭐⭐⭐ | Totally changes the vibe of your photos. |\n| **Comfort** | ⭐⭐⭐⭐⭐ | You will walk A LOT in Seoul. |"
  },
  {
    title: "## 💡 Editor's Honest Review",
    text: "After buying and trying countless products with my own money, I realized you don't need the most expensive items. Finding basic items that fit your skin type or body shape is much more important. I usually stock up during major sales events at [Olive Young Global](https://global.oliveyoung.com) or [Musinsa Global](https://global.musinsa.com).",
    table: "| Buying Point | Editor's Pick | Pro Tip |\n|---|---|---|\n| **Value** | Value Sets during sale | Best time to stock up! |\n| **Practicality** | Daily wear/use items | Basics over trends. |\n| **Trend** | Clean and timeless | Make sure it lasts. |"
  },
  {
    title: "## 💡 Editor's Pros & Cons",
    text: "There is a reason why so many people recommend this, but rather than blindly following trends, you should adapt it to your own style. I made a lot of mistakes at first, but eventually found my own formula through trial and error. Start small and see what works for you!",
    table: "| Pros | Cons | Editor's Solution |\n|---|---|---|\n| **Access** | Easy to find | Crowded on weekends (Go on weekday mornings) |\n| **Trendy** | Looks great in photos | Trends pass quickly (Only buy one point item!) |\n| **Variety** | Many options | Hard to choose (Read reviews first) |"
  }
];

let processed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf-8");
  
  if (content.includes("💡 Editor")) {
    skipped++;
    continue;
  }

  // 1. Move or Modify ha-summary
  const summaryRegex = /<div className="ha-summary">[\s\S]*?<\/div>\n<\/div>/;
  const summaryMatch = content.match(summaryRegex);
  
  if (summaryMatch) {
    const summaryStr = summaryMatch[0];
    content = content.replace(summaryStr, "");
    
    if (Math.random() > 0.5) {
      // Move to top (after frontmatter)
      content = content.replace(/(---[\s\S]*?---)/, `$1\n\n${summaryStr}`);
    } else {
      // Convert to bullet list
      const items = [...summaryStr.matchAll(/<p>(.*?)<\/p>/g)].map(m => `- **Quick Summary**: ${m[1]}`);
      const listStr = `### Quick Summary\n${items.join("\\n")}\n`;
      content = content.replace(/(---[\s\S]*?---)/, `$1\n\n${listStr}`);
    }
  }

  // 2. Remove ha-related-panel (30% chance)
  const relatedRegex = /<div className="ha-related-panel">[\s\S]*?<\/div>\n<\/div>/;
  if (Math.random() > 0.7) {
    content = content.replace(relatedRegex, "");
  }

  // 3. Add Editor Tip near the bottom (before ha-related-panel or end of file)
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const tipContent = `\n${tip.title}\n\n${tip.text}\n\n${tip.table}\n\n`;
  
  if (content.includes('<div className="ha-related-panel">')) {
    content = content.replace('<div className="ha-related-panel">', tipContent + '<div className="ha-related-panel">');
  } else if (content.includes('<div className="ha-bottom-cta-text">')) {
    content = content.replace('<div className="ha-bottom-cta-text">', tipContent + '<div className="ha-bottom-cta-text">');
  } else {
    content += tipContent;
  }

  // 4. Bold random text (heuristic for English: bold random short phrases before periods in paragraphs)
  content = content.replace(/([a-zA-Z]{3,7}) ([a-zA-Z]{3,10})\./g, "**$1 $2**.");

  fs.writeFileSync(filePath, content, "utf-8");
  processed++;
}

console.log(`Successfully processed ${processed} files. Skipped ${skipped} files.`);
