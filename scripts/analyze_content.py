import os, re, json

def analyze_dir(path, is_ko):
    if not os.path.exists(path): return {}
    files = []
    for root, _, filenames in os.walk(path):
        for f in filenames:
            if f.endswith('.mdx'):
                files.append(os.path.join(root, f))
    
    report = {'total': len(files), 'categories': {}, 'thin_content': [], 'total_length': 0}
    
    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        fm_match = re.search(r'^---\s*(.*?)\s*---', content, re.DOTALL)
        category = 'Unknown'
        if fm_match:
            fm = fm_match.group(1)
            cat_match = re.search(r'category:\s*"(.*?)"', fm)
            if cat_match: category = cat_match.group(1)
            body = content[fm_match.end():].strip()
        else:
            body = content
            
        length = len(re.sub(r'\s+', '', body)) if is_ko else len(body.split())
        report['total_length'] += length
        
        if category not in report['categories']:
            report['categories'][category] = 0
        report['categories'][category] += 1
        
        threshold = 2000 if is_ko else 500 
        if length < threshold:
            report['thin_content'].append({'file': os.path.basename(fpath), 'length': length, 'category': category})
            
    if report['total'] > 0:
        report['avg_length'] = report['total_length'] // report['total']
    else:
        report['avg_length'] = 0
        
    return report

ko_rep = analyze_dir('content/hub/ko', True)
en_rep = analyze_dir('content/hub/en', False)

print('=== KO ANALYSIS ===')
print(f'Total Files: {ko_rep.get("total", 0)}')
print(f'Average Char Count (No spaces): {ko_rep.get("avg_length", 0)}')
print('Categories:', json.dumps(ko_rep.get("categories", {}), ensure_ascii=False))
print(f'Extremely Thin Content Count (<2000 chars): {len(ko_rep.get("thin_content", []))}')

print('\n=== EN ANALYSIS ===')
print(f'Total Files: {en_rep.get("total", 0)}')
print(f'Average Word Count: {en_rep.get("avg_length", 0)}')
print('Categories:', json.dumps(en_rep.get("categories", {}), ensure_ascii=False))
print(f'Extremely Thin Content Count (<500 words): {len(en_rep.get("thin_content", []))}')

# Output a sample of thin files to detect overlaps
print('\n=== SAMPLE OF THIN/OVERLAPPING FILES ===')
for item in ko_rep.get("thin_content", [])[:10]:
    print(item['file'])
