const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "content", "hub", "ko");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx"));

const tips = [
  {
    title: "## 💡 에디터의 실전 팁",
    text: "제가 직접 다녀보고 경험해보니, 인터넷에 나오는 뻔한 정보보다는 현장에서 느끼는 체감이 훨씬 중요하더라고요. 제 팁이 여러분의 일정에 조금이나마 도움이 되었으면 좋겠습니다! 특히 방문 시간대나 날씨를 꼭 미리 체크하세요.",
    table: "| 체크리스트 | 중요도 | 에디터 코멘트 |\n|---|---|---|\n| **시간대 확인** | ⭐⭐⭐⭐⭐ | 사람 없는 시간대가 베스트! |\n| **날씨 체크** | ⭐⭐⭐⭐ | 사진 결과물이 완전히 달라져요. |\n| **편한 복장** | ⭐⭐⭐⭐⭐ | 무조건 많이 걷게 됩니다. |"
  },
  {
    title: "## 💡 에디터의 찐 사용 후기",
    text: "제가 직접 제 돈 주고 사서 써본 결과, 굳이 비싼 걸 고집할 필요는 없다는 결론을 내렸습니다. 내 피부와 체형에 맞는 기본템을 찾는 게 가장 우선이에요. 요즘은 세일 기간을 잘 노려서 [올리브영 글로벌](https://global.oliveyoung.com)이나 [무신사](https://global.musinsa.com)에서 득템하는 재미로 지냅니다.",
    table: "| 구매 포인트 | 에디터 추천 | 꿀팁 |\n|---|---|---|\n| **가성비** | 세일 기간 기획 세트 | 무조건 쟁여두는 편입니다. |\n| **실용성** | 매일 손이 가는 데일리템 | 화려한 것보다 기본이 최고! |\n| **트렌드** | 유행 안 타는 깔끔한 디자인 | 오래 쓸 수 있는지 꼭 확인하세요. |"
  },
  {
    title: "## 💡 에디터가 직접 느낀 장단점",
    text: "많은 분들이 추천하는 데는 이유가 있지만, 무작정 따라 하기보다는 나만의 스타일로 소화하는 과정이 필요합니다. 처음엔 저도 많이 실패했지만, 이것저것 시도해보면서 저만의 공식을 찾았어요. 여러분도 작은 것부터 하나씩 바꿔보세요!",
    table: "| 장점 | 단점 | 에디터의 극복 팁 |\n|---|---|---|\n| **접근성** | 쉽게 찾을 수 있음 | 주말엔 사람이 너무 많음 (평일 오전 추천) |\n| **트렌디함** | 사진이 예쁘게 나옴 | 유행이 빨리 변함 (포인트 아이템 하나만!) |\n| **다양성** | 선택지가 넓음 | 결정 장애 옴 (미리 리뷰 보고 갈 것) |"
  }
];

let processed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf-8");
  
  if (content.includes("💡 에디터")) {
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
      const items = [...summaryStr.matchAll(/<p>(.*?)<\/p>/g)].map(m => `- **빠른 요약**: ${m[1]}`);
      const listStr = `### 빠른 요약\n${items.join("\\n")}\n`;
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

  // 4. Bold random text (heuristic: find words inside paragraphs ending in '다.')
  content = content.replace(/([^#\n\*>]) ([가-힣]{2,5}[은는이가을를]) ([가-힣]{3,10}[다])\./g, "$1 **$2 $3**.");

  fs.writeFileSync(filePath, content, "utf-8");
  processed++;
}

console.log(`Successfully processed ${processed} files. Skipped ${skipped} files.`);
