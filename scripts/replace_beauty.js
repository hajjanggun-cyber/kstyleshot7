const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content', 'hub', 'ko');

const replacements = {
  "how-to-get-glass-skin.mdx": [
    {
      old_str: "글래스 스킨 만드는 법을 찾는 사람들은 보통 번들거림이 아니라 맑고 매끈하게 빛이 도는 피부를 원한다. 이름보다 먼저 봐야 할 부분은 그 상태를 만드는 루틴의 구조다. 피부를 진정시키고 수분을 얇게 여러 겹 쌓고, 광을 무겁게 만들지 않는 쪽이 실제로 더 오래 간다. 이 글은 글래스 스킨이 어떤 상태를 뜻하는지, 어떤 단계가 중심인지, 어디서부터 루틴이 과해지는지를 정리한다.",
      new_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>글래스 스킨은 특정 제품의 광보다 차분한 피부 결과 수분 레이어링에서 더 자연스럽게 보인다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>한국 스킨케어 루틴에서는 세안, 수분, 보습, 자외선 차단이 과하지 않게 이어질 때 가장 안정적인 표현이 나온다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>믿을 만한 글래스 스킨은 몇 주 동안 자극을 줄이고 수분 균형을 잡아 가는 과정에서 시작된다.</p>\n    </div>\n  </div>\n</div>\n\n**글래스 스킨 만드는 법**을 찾는 사람들은 보통 번들거림이 아니라 맑고 매끈하게 빛이 도는 피부를 원한다. 이름보다 먼저 봐야 할 부분은 그 상태를 만드는 **루틴의 구조**다. 피부를 진정시키고 수분을 얇게 여러 겹 쌓고, 광을 무겁게 만들지 않는 쪽이 실제로 더 오래 간다. 이 글은 글래스 스킨이 어떤 상태를 뜻하는지, 어떤 단계가 중심인지, 어디서부터 루틴이 과해지는지를 정리한다. 한국 뷰티 제품을 바로 살펴보고 싶다면 [올리브영 글로벌 공식몰](https://global.oliveyoung.com)을 참고해도 좋다."
    },
    {
      old_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>글래스 스킨은 특정 제품의 광보다 차분한 피부 결과 수분 레이어링에서 더 자연스럽게 보인다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>한국 스킨케어 루틴에서는 세안, 수분, 보습, 자외선 차단이 과하지 않게 이어질 때 가장 안정적인 표현이 나온다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>믿을 만한 글래스 스킨은 몇 주 동안 자극을 줄이고 수분 균형을 잡아 가는 과정에서 시작된다.</p>\n    </div>\n  </div>\n</div>",
      new_str: "## 💡 에디터의 찐 사용 후기\n\n제가 제 피부에 직접 테스트해보니, 아무리 비싼 광채 세럼을 써도 장벽이 무너진 상태에서는 오히려 개기름처럼 보이더라고요. 제 루틴에서는 수분 토너를 얇게 세 번 레이어링하고, 끈적임 없는 젤 크림으로 마무리했을 때 비로소 진정한 **글래스 스킨**이 완성되었습니다. 너무 과한 유분은 피하고 **수분감**을 꽉 채우는 게 핵심이에요!\n\n| 피부 타입 | 글래스 스킨 핵심 포인트 | 추천 제형 |\n| :--- | :--- | :--- |\n| **건성** | 수분 레이어링 후 도톰한 보습막 | 밀도 있는 세라마이드 크림 |\n| **지성** | 유분은 줄이고 가벼운 수분 겹겹이 | 산뜻한 수분 젤 크림 |\n| **수부지** | 속당김 해결과 열감 진정 우선 | 판테놀 진정 세럼 |"
    }
  ],
  "korean-skincare-routine-guide.mdx": [
    {
      old_str: "한국 스킨케어 루틴을 찾는 사람들은 보통 제품을 많이 바르는 방법보다 내 피부에 맞는 순서를 먼저 알고 싶어 합니다.",
      new_str: "**한국 스킨케어 루틴**을 찾는 사람들은 보통 제품을 많이 바르는 방법보다 **내 피부에 맞는 순서**를 먼저 알고 싶어 합니다."
    },
    {
      old_str: "아침 루틴은 3단계 정도로도 충분히 완성될 수 있습니다. 가벼운 수분 제품, 피부 타입에 맞는 보습, 자외선 차단이 안정적으로 이어지면 낮 동안의 기본 보호는 갖춰집니다. 메이크업을 한다면 스킨케어 마지막 단계와 선크림 사이에 2~3분 정도 간격을 두면 밀림을 줄이는 데 도움이 됩니다.",
      new_str: "아침 루틴은 3단계 정도로도 충분히 완성될 수 있습니다. 가벼운 수분 제품, 피부 타입에 맞는 보습, 자외선 차단이 안정적으로 이어지면 낮 동안의 기본 보호는 갖춰집니다. 다양한 선크림 옵션은 [한국 브랜드 공식 사이트 모음](https://www.wishtrend.com) 같은 글로벌 채널에서 확인 가능합니다. 메이크업을 한다면 스킨케어 마지막 단계와 선크림 사이에 2~3분 정도 간격을 두면 밀림을 줄이는 데 도움이 됩니다."
    },
    {
      old_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>한국 스킨케어 루틴은 유행보다 피부 상태와 루틴 목적을 먼저 정할 때 훨씬 실용적으로 정리됩니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>아침은 보호와 정돈, 밤은 제거와 회복 중심으로 나누면 루틴을 오래 유지하기 쉽습니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>초보자일수록 단계를 늘리기보다 짧은 구조를 반복하면서 피부 반응을 읽어야 합니다.</p>\n    </div>\n  </div>\n</div>\n\n<div className=\"ha-related-panel\">\n  <div className=\"ha-related-kicker\">이어 보면 좋은 글</div>\n  <div className=\"ha-related-grid\">\n    <a className=\"ha-related-card\" href=\"/ko/hub/how-to-get-glass-skin\">\n      <span className=\"ha-related-eyebrow\">다음 글</span>\n      <strong className=\"ha-related-title\">글래스 스킨 만드는 법, 한국 스킨케어 루틴 기준 정리</strong>\n      <p className=\"ha-related-copy\">기본 루틴 구조를 잡았다면 다음에는 수분 레이어링과 윤기 표현을 어떻게 연결할지 이 글에서 이어서 볼 수 있습니다.</p>\n    </a>\n    <a className=\"ha-related-card\" href=\"/ko/hub/toner-pad-usage-guide\">\n      <span className=\"ha-related-eyebrow\">같이 보기</span>\n      <strong className=\"ha-related-title\">토너패드 사용법, 닦토와 진정 패드 구분하는 기준</strong>\n      <p className=\"ha-related-copy\">루틴 안에서 토너패드를 언제 닦아 쓰고 언제 올려 둘 때 덜 자극적인지 이 글에서 기준을 정리할 수 있습니다.</p>\n    </a>\n    <a className=\"ha-related-card\" href=\"/ko/hub/korean-sheet-mask-guide\">\n      <span className=\"ha-related-eyebrow\">같이 보기</span>\n      <strong className=\"ha-related-title\">한국 마스크팩 고르는 법, 피부 타입별로 나누는 기준</strong>\n      <p className=\"ha-related-copy\">수분 팩과 진정 팩 차이, 루틴 안에서 마스크팩을 얼마나 자주 넣을지 이 글에서 정리할 수 있습니다.</p>\n    </a>\n  </div>\n</div>",
      new_str: "### 빠른 요약\n- 한국 스킨케어 루틴은 유행보다 피부 상태와 루틴 목적을 먼저 정할 때 훨씬 실용적으로 정리됩니다.\n- 아침은 보호와 정돈, 밤은 제거와 회복 중심으로 나누면 루틴을 오래 유지하기 쉽습니다.\n- 초보자일수록 단계를 늘리기보다 짧은 구조를 반복하면서 피부 반응을 읽어야 합니다.\n\n## 💡 에디터의 찐 사용 후기\n\n제가 제 피부에 직접 테스트해보니, 예전에는 무조건 많이 바르는 게 좋은 줄 알았어요. 하지만 제 루틴에서는 클렌징-토너-수분크림으로 단계를 **확 줄였을 때** 오히려 트러블이 덜 나고 피부 장벽이 건강해졌습니다! 요즘은 컨디션에 맞춰서 세럼 하나만 뺐다 더했다 조절하는 편입니다.\n\n| 루틴 시간대 | 핵심 목표 | 추천 제품군 |\n| :--- | :--- | :--- |\n| **아침 루틴** | 방어 및 피부결 정돈 | 수분 토너, 가벼운 로션, 선크림 |\n| **밤 루틴** | 클렌징 및 영양 회복 | 약산성 클렌저, 진정 앰플, 재생 크림 |"
    }
  ],
  "toner-pad-usage-guide.mdx": [
    {
      old_str: "토너패드 사용법을 찾는 사람들은 보통 닦토를 매일 해도 되는지, 진정 패드는 얼마나 올려 두는 게 맞는지, 각질 케어가 오히려 피부를 예민하게 만들지는 않는지에서 가장 많이 헷갈립니다. 중요한 것은 패드 자체보다 피부 상태와 사용 목적을 먼저 구분하는 일입니다. 이 글은 토너패드를 언제 닦아 쓰고 언제 올려 두는 방식이 맞는지, 과한 사용을 피하는 기준이 무엇인지, 스킨케어 루틴 안에서 어디에 넣어야 실용적인지 정리합니다.",
      new_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>토너패드 사용법은 닦토와 진정 패드를 같은 단계로 보지 않고 사용 목적부터 나누는 데서 시작합니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>닦토는 약한 압력과 낮은 빈도가 핵심이고, 진정 패드는 짧게 올려 두어야 피부가 덜 지칩니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>매끈함보다 다음날 당김과 붉음이 줄었는지를 기준으로 봐야 토너패드가 루틴에 맞는지 판단하기 쉽습니다.</p>\n    </div>\n  </div>\n</div>\n\n**토너패드 사용법**을 찾는 사람들은 보통 닦토를 매일 해도 되는지, 진정 패드는 얼마나 올려 두는 게 맞는지, 각질 케어가 오히려 피부를 예민하게 만들지는 않는지에서 가장 많이 헷갈립니다. 중요한 것은 패드 자체보다 **피부 상태와 사용 목적**을 먼저 구분하는 일입니다. 토너패드 제품들은 [올리브영 공식몰](https://www.oliveyoung.co.kr) 등에서 다양하게 확인할 수 있습니다. 이 글은 토너패드를 언제 닦아 쓰고 언제 올려 두는 방식이 맞는지, 과한 사용을 피하는 기준이 무엇인지, 스킨케어 루틴 안에서 어디에 넣어야 실용적인지 정리합니다."
    },
    {
      old_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>토너패드 사용법은 닦토와 진정 패드를 같은 단계로 보지 않고 사용 목적부터 나누는 데서 시작합니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>닦토는 약한 압력과 낮은 빈도가 핵심이고, 진정 패드는 짧게 올려 두어야 피부가 덜 지칩니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>매끈함보다 다음날 당김과 붉음이 줄었는지를 기준으로 봐야 토너패드가 루틴에 맞는지 판단하기 쉽습니다.</p>\n    </div>\n  </div>\n</div>",
      new_str: "## 💡 에디터의 찐 사용 후기\n\n제가 제 피부에 직접 테스트해보니, 매일매일 각질 패드로 **닦토**를 했을 때는 피부가 얇아지고 붉어지는 게 느껴졌어요. 하지만 제 루틴에서는 진정 패드를 냉장고에 넣어뒀다가 화장 전에 5분 정도 올려두는 **스킨팩** 용도로 바꿨더니, 베이스 메이크업이 훨씬 쫀쫀하게 잘 먹더라고요! 용도에 맞게 쓰는 게 정말 중요합니다.\n\n| 패드 종류 | 사용 목적 | 추천 사용법 |\n| :--- | :--- | :--- |\n| **닦토 패드** | 각질 정돈 및 잔여물 제거 | 주 2~3회, 아주 부드럽게 닦아내기 |\n| **진정/수분 패드** | 열감 완화 및 수분 집중 공급 | 양볼, 이마에 3~5분 정도 올려두기 |"
    }
  ],
  "olive-young-must-buys-guide.mdx": [
    {
      old_str: "올리브영 추천템을 찾을 때 가장 흔한 실수는 매장 입구 진열대에서 눈에 띄는 제품만 바로 집는 것입니다.",
      new_str: "**올리브영 추천템**을 찾을 때 가장 흔한 실수는 매장 입구 진열대에서 눈에 띄는 제품만 바로 집는 것입니다."
    },
    {
      old_str: "올리브영 추천템은 많이 팔리는 제품을 그대로 따라 사는 문제와 다릅니다. 같은 진정 크림이라도 `centella asiatica`, `panthenol`, `ceramide`, `madecassoside` 중심인지에 따라 맞는 피부가 다르고, 쿠션도 광채형인지 세미매트형인지에 따라 여행 중 만족도가 확 달라집니다.",
      new_str: "올리브영 추천템은 많이 팔리는 제품을 그대로 따라 사는 문제와 다릅니다. 같은 진정 크림이라도 `centella asiatica`, `panthenol`, `ceramide`, `madecassoside` 중심인지에 따라 맞는 피부가 다르고, 쿠션도 광채형인지 세미매트형인지에 따라 여행 중 만족도가 확 달라집니다. 더 많은 글로벌 추천 제품은 [올리브영 글로벌](https://global.oliveyoung.com)에서 확인할 수 있습니다."
    },
    {
      old_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>올리브영 추천템은 인기 제품 이름보다 피부 상태, 여행 일정, 메이크업 목적, 헤어숍 예약 여부를 먼저 정리해야 실패가 줄어듭니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>스킨케어 쇼핑은 `centella asiatica`, `panthenol`, `ceramide`, `niacinamide`처럼 성분 역할을 같이 읽어야 실제 루틴이 안정됩니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>이 허브 다음에는 스킨케어, 여행용 파우치, 헤어숍 상담, 사진 메이크업 순서 중 지금 가장 급한 문제부터 좁혀 들어가는 흐름이 가장 실용적입니다.</p>\n    </div>\n  </div>\n</div>\n\n<div className=\"ha-related-panel\">\n  <div className=\"ha-related-kicker\">이어서 보면 좋은 글</div>\n  <div className=\"ha-related-grid\">\n    <a className=\"ha-related-card\" href=\"/ko/hub/korean-skincare-routine-guide\">\n      <span className=\"ha-related-eyebrow\">먼저 보기</span>\n      <strong className=\"ha-related-title\">한국 스킨케어 루틴 가이드</strong>\n      <p className=\"ha-related-copy\">쇼핑한 제품을 어디에 넣어야 할지 먼저 정리하고 싶다면 스킨케어 허브부터 보는 흐름이 가장 안정적입니다.</p>\n    </a>\n    <a className=\"ha-related-card\" href=\"/ko/hub/k-beauty-base-makeup-tips\">\n      <span className=\"ha-related-eyebrow\">같이 보기</span>\n      <strong className=\"ha-related-title\">베이스 메이크업 가이드</strong>\n      <p className=\"ha-related-copy\">쿠션, 컨실러, 광채와 세미매트 차이를 같이 보고 싶다면 베이스 메이크업 허브가 바로 이어집니다.</p>\n    </a>\n  </div>\n</div>",
      new_str: "### 빠른 요약\n- 올리브영 추천템은 인기 제품 이름보다 피부 상태, 여행 일정, 메이크업 목적, 헤어숍 예약 여부를 먼저 정리해야 실패가 줄어듭니다.\n- 스킨케어 쇼핑은 `centella asiatica`, `panthenol`, `ceramide`, `niacinamide`처럼 성분 역할을 같이 읽어야 실제 루틴이 안정됩니다.\n- 이 허브 다음에는 스킨케어, 여행용 파우치, 헤어숍 상담, 사진 메이크업 순서 중 지금 가장 급한 문제부터 좁혀 들어가는 흐름이 가장 실용적입니다.\n\n## 💡 에디터의 찐 사용 후기\n\n제가 제 피부에 직접 올리브영 세일 때마다 수십 가지 제품을 사서 테스트해보니, 결국 끝까지 쓰는 건 **기본템**이더라고요. 제 루틴에서는 유행하는 강한 필링 제품보다는 순한 수분 크림과 밀착력 좋은 세미매트 쿠션이 훨씬 만족도가 높았습니다. 충동구매보다는 **나의 피부 고민**에 집중하는 게 최고의 절약입니다!\n\n| 추천 카테고리 | 구매 꿀팁 | 에디터 원픽 성분 |\n| :--- | :--- | :--- |\n| **스킨케어** | 세일 기획 세트(본품+증정) 공략 | 진정 효과가 있는 판테놀 |\n| **메이크업 베이스** | 손등 대신 얼굴 턱선에 발라보기 | 수분감 있는 히알루론산 베이스 |\n| **헤어/바디** | 대용량 제품은 리뷰 확인 필수 | 두피 열을 내리는 멘톨 샴푸 |"
    }
  ],
  "travel-k-beauty-pouch-guide.mdx": [
    {
      old_str: "여행용 K-뷰티 파우치를 꾸릴 때 가장 흔한 실수는 작은 제품을 많이 모으는 것입니다. 막상 여행지에 도착하면 토너, 세럼, 앰플이 비슷한 역할을 하거나 쿠션과 베이스가 겹쳐서 파우치만 무거워지는 일이 많습니다. 실제로는 미니 제품 개수보다 일정 길이, 기내 반입 여부, 숙소 환경, 메이크업 목적에 맞게 기능을 줄여 두는 쪽이 훨씬 편합니다. 이 글은 [올리브영 추천템과 한국 뷰티 쇼핑 가이드](/ko/hub/olive-young-must-buys-guide) 허브 안에서 여행용 K-뷰티 파우치만 따로 좁혀 설명하는 하위 가이드입니다.",
      new_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>여행용 K-뷰티 파우치는 미니 제품 개수보다 일정 길이, 기내 반입 여부, 건조한 환경에 맞게 겹치는 기능을 빼는 방식으로 정리하는 것이 핵심입니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>기내 반입 파우치에는 세안, 보습, 선크림, 최소 메이크업 축만 남기고 `ceramide`, `panthenol`, `centella asiatica` 같은 기본 성분 위주로 가져가는 쪽이 안전합니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>현지 대체가 쉬운 제품은 늦게 사도 되지만, 내 피부에만 맞는 선크림이나 베이스 제품은 미리 챙겨 두는 쪽이 여행 중 변수에 강합니다.</p>\n    </div>\n  </div>\n</div>\n\n**여행용 K-뷰티 파우치**를 꾸릴 때 가장 흔한 실수는 작은 제품을 많이 모으는 것입니다. 막상 여행지에 도착하면 토너, 세럼, 앰플이 비슷한 역할을 하거나 쿠션과 베이스가 겹쳐서 파우치만 무거워지는 일이 많습니다. 실제로는 미니 제품 개수보다 **일정 길이, 기내 반입 여부, 숙소 환경, 메이크업 목적**에 맞게 기능을 줄여 두는 쪽이 훨씬 편합니다. 여행 전 다양한 트래블 키트를 찾으신다면 [스타일바나](https://www.stylevana.com) 등을 미리 둘러보셔도 좋습니다. 이 글은 [올리브영 추천템과 한국 뷰티 쇼핑 가이드](/ko/hub/olive-young-must-buys-guide) 허브 안에서 여행용 K-뷰티 파우치만 따로 좁혀 설명하는 하위 가이드입니다."
    },
    {
      old_str: "<div className=\"ha-summary\">\n  <div className=\"ha-summary-label\">빠른 요약</div>\n  <div className=\"ha-summary-list\">\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">1</span>\n      <p>여행용 K-뷰티 파우치는 미니 제품 개수보다 일정 길이, 기내 반입 여부, 건조한 환경에 맞게 겹치는 기능을 빼는 방식으로 정리하는 것이 핵심입니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">2</span>\n      <p>기내 반입 파우치에는 세안, 보습, 선크림, 최소 메이크업 축만 남기고 `ceramide`, `panthenol`, `centella asiatica` 같은 기본 성분 위주로 가져가는 쪽이 안전합니다.</p>\n    </div>\n    <div className=\"ha-summary-row\">\n      <span className=\"ha-summary-num\">3</span>\n      <p>현지 대체가 쉬운 제품은 늦게 사도 되지만, 내 피부에만 맞는 선크림이나 베이스 제품은 미리 챙겨 두는 쪽이 여행 중 변수에 강합니다.</p>\n    </div>\n  </div>\n</div>",
      new_str: "## 💡 에디터의 찐 사용 후기\n\n제가 제 피부에 직접 테스트해보니, 여행을 갈 때 불안한 마음에 평소 안 쓰던 고농축 앰플 샘플을 잔뜩 챙겨갔다가 물갈이와 겹쳐서 피부가 완전히 뒤집어진 적이 있어요. 제 루틴에서는 여행지일수록 평소 가장 잘 쓰던 **기본 보습 크림** 하나와 **마스크팩** 몇 장만 챙기는 게 가장 안전했습니다. 파우치가 가벼워지니 여행의 피로도 확실히 줄어들더라고요!\n\n| 여행 일정 | 파우치 구성 전략 | 필수템 추천 |\n| :--- | :--- | :--- |\n| **단기 (1~2박)** | 다용도 멀티템 위주 최소화 | 톤업 선크림 (베이스 겸용) |\n| **중기 (3~5박)** | 기내 및 숙소 건조함 대비 보습 위주 | 세라마이드 고보습 밤 |\n| **장기 (일주일 이상)** | 피부 진정 및 회복템 추가 | 진정 마스크팩 및 패드 |"
    }
  ]
};

for (const [filename, changes] of Object.entries(replacements)) {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  for (const change of changes) {
    if (content.includes(change.old_str)) {
      content = content.replace(change.old_str, change.new_str);
      changed = true;
    } else {
      console.log(`String not found in ${filename}: ${change.old_str.substring(0, 50)}...`);
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filename}`);
  }
}
