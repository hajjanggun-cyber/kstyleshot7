import os, re

def update_categories(path, mapping):
    updated = 0
    for root, _, filenames in os.walk(path):
        for f in filenames:
            if not f.endswith('.mdx'): continue
            fpath = os.path.join(root, f)
            with open(fpath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            def replacer(match):
                cat = match.group(1)
                new_cat = cat
                for k, v in mapping.items():
                    if cat == k: new_cat = v
                return f'category: "{new_cat}"'
            
            new_content = re.sub(r'category:\s*"(.*?)"', replacer, content, count=1)
            
            if new_content != content:
                with open(fpath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                updated += 1
    return updated

ko_map = {
    '한국 명소 & 포토존': '서울 명소 & 포토존',
    'K-뷰티 & 패션': 'K-스타일 패션',
    'K-Style Fashion': 'K-스타일 패션'
}

en_map = {
    'K-Fashion': 'K-Style Fashion'
}

ko_count = update_categories('content/hub/ko', ko_map)
en_count = update_categories('content/hub/en', en_map)

print(f'Successfully updated categories in {ko_count} Korean files and {en_count} English files.')
