export type ArticleSource = {
  title: {
    ko: string;
    en: string;
  };
  publisher: {
    ko: string;
    en: string;
  };
  url: string;
  use: {
    ko: string;
    en: string;
  };
};

export type ArticleSourceInfo = {
  checkedAt: string;
  note: {
    ko: string;
    en: string;
  };
  sources: ArticleSource[];
};

const CHECKED_AT = "2026-05-31";

const SOURCE_GROUPS = {
  palace: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "경복궁 글은 운영시간, 휴궁일, 입장 조건, 한복 무료입장, 촬영 동선처럼 방문 전 결정에 직접 영향을 주는 항목을 공식 궁능유적본부와 서울 관광 자료 기준으로 다시 확인했습니다.",
      en: "Gyeongbokgung guides are checked against official palace and Seoul tourism references for hours, closed days, admission conditions, hanbok entry, and route decisions that affect a real visit.",
    },
    sources: [
      {
        title: {
          ko: "경복궁 관람 시간 및 요금",
          en: "Gyeongbokgung Hours and Admission",
        },
        publisher: {
          ko: "국가유산청 궁능유적본부",
          en: "Royal Palaces and Tombs Center",
        },
        url: "https://www.royalpalacekr.org/html/eng_gbg/guide/guide01_tab01.html",
        use: {
          ko: "계절별 관람 시간, 입장 마감, 요금, 무료입장 조건을 확인했습니다.",
          en: "Used for seasonal opening hours, final admission, fees, and free-entry conditions.",
        },
      },
      {
        title: {
          ko: "서울 공식 경복궁 방문 가이드",
          en: "Official Seoul Gyeongbokgung Guide",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://visit.seoul.kr/en/articles/gyeongbokgung-palace-guide-2025",
        use: {
          ko: "첫 방문 코스, 궁궐 설명, 방문 흐름을 교차 확인했습니다.",
          en: "Used to cross-check first-visit route framing and visitor context.",
        },
      },
    ],
  },
  hangang: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "한강공원 글은 공원별 위치, 이용 흐름, 계절 행사, 피크닉·야경 동선처럼 현장 조건이 바뀌기 쉬운 항목을 서울시 한강 자료 기준으로 검토했습니다.",
      en: "Han River guides are checked against Seoul city Hangang references for park locations, seasonal events, picnic flow, and night-view route details that can change by season.",
    },
    sources: [
      {
        title: {
          ko: "한강공원 공식 안내",
          en: "Hangang Parks Official Guide",
        },
        publisher: {
          ko: "서울특별시",
          en: "Seoul Metropolitan Government",
        },
        url: "https://english.seoul.go.kr/service/amusement/hangang/hangang-parks/",
        use: {
          ko: "여의도·반포 등 한강공원 구분과 공원별 이용 포인트를 확인했습니다.",
          en: "Used for Hangang park distinctions including Yeouido and Banpo.",
        },
      },
      {
        title: {
          ko: "한강공원 운영 자료",
          en: "Hangang Park Operation References",
        },
        publisher: {
          ko: "서울시 한강사업본부",
          en: "Seoul Hangang Park",
        },
        url: "https://hangang.seoul.go.kr/",
        use: {
          ko: "행사, 시설, 현장 운영 변동 여부를 확인해야 하는 기준으로 사용했습니다.",
          en: "Used as the current-check reference for events, facilities, and site operations.",
        },
      },
    ],
  },
  seongsu: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "성수 글은 고정 명소보다 팝업·브랜드 공간·카페 운영 변동이 큰 지역 특성을 반영해, 서울 공식 지역 자료와 서울시 팝업 사례를 기준으로 방문 전 확인 항목을 분리했습니다.",
      en: "Seongsu guides separate fixed-place advice from pop-up and cafe variables, using Seoul tourism neighborhood references and city pop-up examples as the baseline.",
    },
    sources: [
      {
        title: {
          ko: "성수 지역 공식 안내",
          en: "Official Seongsu Neighborhood Guide",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://visit.seoul.kr/en/neighborhoods/seongsu",
        use: {
          ko: "성수의 산업적 배경, 카페·팝업·서울숲 연결 흐름을 확인했습니다.",
          en: "Used for Seongsu's industrial background, cafe culture, pop-ups, and Seoul Forest connection.",
        },
      },
      {
        title: {
          ko: "성수 팝업 운영 사례",
          en: "Seongsu Pop-up Operation Example",
        },
        publisher: {
          ko: "서울특별시",
          en: "Seoul Metropolitan Government",
        },
        url: "https://english.seoul.go.kr/seoul-launches-exclusive-seoul-goods-pop-up-store-in-fashionable-seongsu-dong-introducing-seoul-ramyeon/",
        use: {
          ko: "성수 팝업은 기간·장소·대기 방식이 바뀐다는 점을 설명하는 근거로 사용했습니다.",
          en: "Used to support the note that Seongsu pop-ups are time-limited and location-specific.",
        },
      },
    ],
  },
  hongdae: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "홍대 글은 홍대거리, 레드로드, 공연·야간 유동처럼 시간대에 따라 경험이 달라지는 요소를 서울 공식 관광 자료와 서울시 보행거리 자료 기준으로 정리했습니다.",
      en: "Hongdae guides are checked against Seoul tourism and city street references for Red Road, walking flow, performances, nightlife, and time-of-day differences.",
    },
    sources: [
      {
        title: {
          ko: "홍대 클럽거리 공식 안내",
          en: "Hongdae Club Street Guide",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://visit.seoul.kr/en/places/hongdae-club-street",
        use: {
          ko: "야간 유동, 음악·공연 지역 성격, 방문 시간대 판단에 사용했습니다.",
          en: "Used for nightlife flow, music district context, and time-of-day planning.",
        },
      },
      {
        title: {
          ko: "홍대 R1 레드컬처마켓",
          en: "Hongdae R1 Red Culture Market",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://english.visitseoul.net/attractions/HONGDAE-R1/ENPidz0r2",
        use: {
          ko: "레드로드와 거리형 관광 구간 설명을 확인했습니다.",
          en: "Used for Red Road and street-tourism context.",
        },
      },
      {
        title: {
          ko: "홍대 걷고싶은거리 개선 자료",
          en: "Hongdae Walking Street Improvement Reference",
        },
        publisher: {
          ko: "서울특별시",
          en: "Seoul Metropolitan Government",
        },
        url: "https://english.seoul.go.kr/plan-improving-environment-expanding-convenience-facilities-hongdae-walking-street/",
        use: {
          ko: "보행 동선, 거리 공연, 플리마켓 성격을 확인했습니다.",
          en: "Used for walking-street layout, street art, and flea-market context.",
        },
      },
    ],
  },
  bukchon: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "북촌 글은 사진 명소보다 주거지 예절과 방문 시간 제한이 더 중요하므로, 공식 관광 안내와 서울한옥포털 자료를 기준으로 소음·동선·방문 시간 기준을 확인했습니다.",
      en: "Bukchon guides prioritize resident etiquette and visiting-hour limits, using official tourism and Seoul Hanok references for noise, route, and timing checks.",
    },
    sources: [
      {
        title: {
          ko: "북촌한옥마을 공식 안내",
          en: "Bukchon Hanok Village Guide",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://visit.seoul.kr/en/places/bukchon-hanok-village",
        use: {
          ko: "주거지 예절, 북촌로 11길 방문 시간 제한, 주요 사진 동선을 확인했습니다.",
          en: "Used for resident etiquette, Bukchon-ro 11-gil visiting-hour limits, and photo-route context.",
        },
      },
      {
        title: {
          ko: "서울 한옥마을 방문 안내",
          en: "Seoul Hanok Village Visitor Tips",
        },
        publisher: {
          ko: "서울한옥포털",
          en: "Seoul Hanok Portal",
        },
        url: "https://hanok.seoul.go.kr/front/eng/exp/expTip.do",
        use: {
          ko: "한옥마을 방문 예절과 생활형 공간이라는 점을 확인했습니다.",
          en: "Used for hanok village etiquette and residential-area context.",
        },
      },
    ],
  },
  seoulParks: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "서울 포토스팟 글은 계절·공원·호수·보행 동선에 따라 현장 조건이 달라지므로, 서울시와 공원 운영 자료를 기준으로 위치, 개방, 혼잡 가능성을 따로 확인했습니다.",
      en: "Seoul photo-spot guides are checked against city and park references because seasonal flowers, parks, lakes, and walking routes can change by date and event.",
    },
    sources: [
      {
        title: {
          ko: "서울숲 공식 운영 안내",
          en: "Seoul Forest Official Guide",
        },
        publisher: {
          ko: "서울숲컨서번시",
          en: "Seoul Forest Park Conservancy",
        },
        url: "https://seoulforest.or.kr/english",
        use: {
          ko: "서울숲의 개방 시간, 구역 구성, 주소, 일부 시설 운영 조건을 확인했습니다.",
          en: "Used for Seoul Forest hours, zones, address, and partial facility conditions.",
        },
      },
      {
        title: {
          ko: "석촌호수 공식 안내",
          en: "Seokchon Lake Official Guide",
        },
        publisher: {
          ko: "서울특별시",
          en: "Seoul Metropolitan Government",
        },
        url: "https://english.seoul.go.kr/seokchon-lake-3/",
        use: {
          ko: "석촌호수 위치, 잠실·석촌역 접근, 벚꽃·호수 산책 맥락을 확인했습니다.",
          en: "Used for Seokchon Lake location, station access, and lake-walk context.",
        },
      },
      {
        title: {
          ko: "서울 벚꽃 장소 공식 가이드",
          en: "Official Seoul Cherry Blossom Guide",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://visit.seoul.kr/en/articles/seoul-hidden-cherry-blossom-spots-2026",
        use: {
          ko: "봄 포토스팟은 개화·혼잡·행사 변수 확인이 필요하다는 기준으로 사용했습니다.",
          en: "Used for seasonal blossom-spot planning and crowd/event variability.",
        },
      },
    ],
  },
  seoulStreets: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "서울 골목형 포토스팟 글은 낮과 밤의 분위기, 보행 동선, 오래된 상권과 새 공간이 겹치는 방식을 서울 공식 관광 자료 기준으로 확인했습니다.",
      en: "Seoul alley photo guides are checked against official Seoul tourism references for day-night mood, walking routes, and how old commercial areas mix with newer spaces.",
    },
    sources: [
      {
        title: {
          ko: "을지로 노가리골목과 힙지로 건축 산책",
          en: "Euljiro Nogari Alley to Hipjiro Architecture Walk",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://english.visitseoul.net/City-Hall-Area/seoul-streetside-architecture-3_/39527",
        use: {
          ko: "을지로 골목, 노가리골목, 오래된 상권과 뉴트로 분위기 설명을 확인했습니다.",
          en: "Used for Euljiro alley, Nogari Alley, old commercial area, and newtro context.",
        },
      },
      {
        title: {
          ko: "서울 힙 골목 공식 가이드",
          en: "10 Seoul Alleyways with a Hip Vibe",
        },
        publisher: {
          ko: "Visit Seoul",
          en: "Visit Seoul",
        },
        url: "https://english.visitseoul.net/walking-tour/10HipAlleyways/ENN036701",
        use: {
          ko: "을지로 셔터 갤러리, 야간 보행 분위기, 골목형 사진 동선을 확인했습니다.",
          en: "Used for Euljiro shutter-gallery context, night walking mood, and alley route framing.",
        },
      },
    ],
  },
  beautyBase: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "베이스 메이크업 글은 특정 제품 추천보다 라벨 읽기, 자외선 차단, 피부 상태별 실패 신호를 우선합니다. 기능성·성분 표현은 화장품 규정과 피부과 공개 가이드 기준으로 과장되지 않게 점검했습니다.",
      en: "Base-makeup guides prioritize label reading, sun protection, and failure signals by skin condition rather than product claims. Ingredient and function wording is checked against cosmetic-label and dermatology references.",
    },
    sources: [
      {
        title: {
          ko: "화장품 규정 자료",
          en: "Cosmetics Regulations",
        },
        publisher: {
          ko: "식품의약품안전처",
          en: "Ministry of Food and Drug Safety",
        },
        url: "https://www.mfds.go.kr/eng/brd/m_28/list.do",
        use: {
          ko: "기능성화장품, 표시·광고, 화장품 규정 표현을 확인하는 기준으로 사용했습니다.",
          en: "Used as the Korean reference for functional cosmetics, labeling, and advertising rules.",
        },
      },
      {
        title: {
          ko: "화장품 라벨링 기준",
          en: "Cosmetics Labeling Requirements",
        },
        publisher: {
          ko: "미국 FDA",
          en: "U.S. FDA",
        },
        url: "https://www.fda.gov/cosmetics/cosmetics-labeling",
        use: {
          ko: "성분표, 표시 문구, 활성 성분과 일반 성분 구분을 설명할 때 참고했습니다.",
          en: "Used for ingredient-list and cosmetic-label interpretation.",
        },
      },
      {
        title: {
          ko: "자외선차단제 선택 기준",
          en: "How to Select a Sunscreen",
        },
        publisher: {
          ko: "미국피부과학회",
          en: "American Academy of Dermatology",
        },
        url: "https://www.aad.org/public/skin-hair-nails/skin-care/sunscreen/choosing-the-right-sunscreen",
        use: {
          ko: "여름 베이스, 지속력, SPF 관련 표현을 보수적으로 점검했습니다.",
          en: "Used to keep SPF and summer-base guidance conservative.",
        },
      },
    ],
  },
  beautySkin: {
    checkedAt: CHECKED_AT,
    note: {
      ko: "스킨케어 글은 유행어보다 세안, 보습, 자극 신호, 성분표 확인을 우선합니다. 토너패드·글래스스킨·시트마스크 표현은 화장품 라벨 기준과 피부과 공개 가이드에 맞춰 점검했습니다.",
      en: "Skincare guides prioritize cleansing, moisturizing, irritation signs, and label reading over trend terms. Toner pad, glass-skin, and sheet-mask wording is checked against cosmetic-label and dermatology references.",
    },
    sources: [
      {
        title: {
          ko: "화장품 규정 자료",
          en: "Cosmetics Regulations",
        },
        publisher: {
          ko: "식품의약품안전처",
          en: "Ministry of Food and Drug Safety",
        },
        url: "https://www.mfds.go.kr/eng/brd/m_28/list.do",
        use: {
          ko: "화장품 기능성·표시·광고 표현을 확인하는 기준으로 사용했습니다.",
          en: "Used as the Korean reference for functional cosmetics, labeling, and advertising wording.",
        },
      },
      {
        title: {
          ko: "화장품 라벨링 기준",
          en: "Cosmetics Labeling Requirements",
        },
        publisher: {
          ko: "미국 FDA",
          en: "U.S. FDA",
        },
        url: "https://www.fda.gov/cosmetics/cosmetics-labeling",
        use: {
          ko: "성분표와 라벨 문구를 과장 없이 설명하는 기준으로 참고했습니다.",
          en: "Used to keep ingredient-list and label explanations grounded.",
        },
      },
      {
        title: {
          ko: "기본 스킨케어 원칙",
          en: "Skin Care on a Budget",
        },
        publisher: {
          ko: "미국피부과학회",
          en: "American Academy of Dermatology",
        },
        url: "https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget",
        use: {
          ko: "순한 세안, 보습, 자외선 차단 중심의 기본 루틴 설명을 확인했습니다.",
          en: "Used for basic routine guidance around gentle cleansing, moisturizing, and sun protection.",
        },
      },
    ],
  },
} satisfies Record<string, ArticleSourceInfo>;

const ARTICLE_SOURCE_GROUP_BY_SLUG: Record<string, keyof typeof SOURCE_GROUPS> = {
  "gyeongbokgung-hub": "palace",
  "gyeongbokgung-photo-guide": "palace",
  "gyeongbokgung-light-timing-guide": "palace",
  "han-river-park-hub": "hangang",
  "yeouido-han-river-picnic-guide": "hangang",
  "banpo-han-river-night-view-guide": "hangang",
  "seongsu-hub": "seongsu",
  "seongsu-pop-up-store-guide": "seongsu",
  "seongsu-cafe-photo-spots": "seongsu",
  "seongsu-industrial-alley-walk-guide": "seongsu",
  "hongdae-hub": "hongdae",
  "hongdae-street-photo-spots": "hongdae",
  "hongdae-aesthetic-cafes-for-photos": "hongdae",
  "seoul-photo-spot-guide": "seoulParks",
  "euljiro-retro-photo-spot-guide": "seoulStreets",
  "bukchon-hanok-village-hub": "bukchon",
  "bukchon-hanok-photo-spots": "bukchon",
  "bukchon-hanbok-photo-route": "bukchon",
  "seoul-cherry-blossom-photo-spots": "seoulParks",
  "seoul-forest-picnic-photo-guide": "seoulParks",
  "seokchon-lake-photo-spot-guide": "seoulParks",
  "korean-skincare-routine-guide": "beautySkin",
  "k-beauty-base-makeup-tips": "beautyBase",
  "how-to-choose-a-cushion-foundation": "beautyBase",
  "semi-matte-base-makeup-guide": "beautyBase",
  "long-lasting-summer-makeup-guide": "beautyBase",
  "winter-glow-makeup-guide": "beautyBase",
  "toner-pad-usage-guide": "beautySkin",
  "how-to-get-glass-skin": "beautySkin",
  "korean-sheet-mask-guide": "beautySkin",
};

export function getArticleSourceInfo(slug: string): ArticleSourceInfo | null {
  const group = ARTICLE_SOURCE_GROUP_BY_SLUG[slug];
  return group ? SOURCE_GROUPS[group] : null;
}
