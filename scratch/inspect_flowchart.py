import re

with open('docs/flowchart_revisi_v2.xml', 'r', encoding='utf-8') as f:
    text = f.read()

diagrams = re.findall(r'<diagram[^>]*name="([^"]+)"', text)
print("Diagram tabs in flowchart_revisi_v2.xml:")
for d in diagrams:
    print(f" - {d}")
