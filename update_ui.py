import re

with open("home.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fonts Link
old_link = '<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">'
new_link = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet">'
content = content.replace(old_link, new_link)

# 2. Font Families
content = content.replace("font-family:'Syne',sans-serif;", "font-family:'Plus Jakarta Sans',sans-serif;")
content = content.replace("font-family:'Space Mono',monospace;", "font-family:'Source Code Pro',monospace;")

# 3. Root Theme (Professional Dark / Light Palette)
old_root = """  :root[data-theme="dark"] {
    --bg: #080c10;
    --bg2: #0d1117;
    --bg3: #161b22;
    --surface: rgba(22,27,34,0.7);
    --surface2: rgba(30,38,50,0.6);
    --border: rgba(48,200,120,0.15);
    --border2: rgba(255,255,255,0.06);
    --text: #e6edf3;
    --text2: #8b949e;
    --text3: #6e7681;
    --accent: #30c878;
    --accent2: #58d68d;
    --accent-glow: rgba(48,200,120,0.18);
    --accent-dim: rgba(48,200,120,0.08);
    --blue: #58a6ff;
    --purple: #bc8cff;
    --orange: #ff9f43;
    --red: #ff6b6b;
    --card-bg: rgba(13,17,23,0.8);
    --nav-bg: rgba(8,12,16,0.92);
    --progress-bg: rgba(48,200,120,0.12);
  }
  :root[data-theme="light"] {
    --bg: #f0f4f8;
    --bg2: #ffffff;
    --bg3: #e8edf3;
    --surface: rgba(255,255,255,0.85);
    --surface2: rgba(240,244,248,0.9);
    --border: rgba(16,124,71,0.2);
    --border2: rgba(0,0,0,0.08);
    --text: #1a2332;
    --text2: #4a5568;
    --text3: #718096;
    --accent: #0d7a3e;
    --accent2: #15a551;
    --accent-glow: rgba(13,122,62,0.15);
    --accent-dim: rgba(13,122,62,0.07);
    --blue: #2563eb;
    --purple: #7c3aed;
    --orange: #ea580c;
    --red: #dc2626;
    --card-bg: rgba(255,255,255,0.92);
    --nav-bg: rgba(240,244,248,0.95);
    --progress-bg: rgba(13,122,62,0.1);
  }"""
new_root = """  :root[data-theme="dark"] {
    --bg: #09090b;
    --bg2: #18181b;
    --bg3: #27272a;
    --surface: rgba(24,24,27,0.7);
    --surface2: rgba(39,39,42,0.6);
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.04);
    --text: #f8fafc;
    --text2: #a1a1aa;
    --text3: #71717a;
    --accent: #3b82f6;
    --accent2: #60a5fa;
    --accent-glow: rgba(59,130,246,0.15);
    --accent-dim: rgba(59,130,246,0.08);
    --blue: #3b82f6;
    --purple: #8b5cf6;
    --orange: #f97316;
    --red: #ef4444;
    --card-bg: rgba(24,24,27,0.8);
    --nav-bg: rgba(9,9,11,0.85);
    --progress-bg: rgba(255,255,255,0.05);
  }
  :root[data-theme="light"] {
    --bg: #f8fafc;
    --bg2: #ffffff;
    --bg3: #f1f5f9;
    --surface: rgba(255,255,255,0.85);
    --surface2: rgba(241,245,249,0.9);
    --border: rgba(15,23,42,0.08);
    --border2: rgba(15,23,42,0.05);
    --text: #0f172a;
    --text2: #475569;
    --text3: #64748b;
    --accent: #2563eb;
    --accent2: #1d4ed8;
    --accent-glow: rgba(37,99,235,0.1);
    --accent-dim: rgba(37,99,235,0.05);
    --blue: #2563eb;
    --purple: #7c3aed;
    --orange: #ea580c;
    --red: #dc2626;
    --card-bg: rgba(255,255,255,0.9);
    --nav-bg: rgba(248,250,252,0.85);
    --progress-bg: rgba(15,23,42,0.05);
  }"""
content = content.replace(old_root, new_root)

# 4. Remove cursor-dot, cursor-outline HTML
content = re.sub(r'<div class="cursor-dot"></div>\n<div class="cursor-outline"></div>\n', '', content)

# 5. Remove cursor CSS
cursor_css = re.compile(r'/\* CUSTOM CURSOR & TYPEWRITER \*/.*?(#typewriter {.*?})\n.*?@keyframes blink', re.DOTALL)
content = cursor_css.sub(r'/* TYPEWRITER */\n  \1\n  @keyframes blink', content)

# Remove the @media(pointer: fine) block
media_cursor = re.compile(r'@media\(pointer: fine\) {.*?}\n', re.DOTALL)
content = media_cursor.sub('', content)

# 6. Remove custom cursor JS logic
cursor_js = re.compile(r'// CUSTOM CURSOR.*?// TYPEWRITER EFFECT', re.DOTALL)
content = cursor_js.sub('// TYPEWRITER EFFECT', content)

# 7. Soften the Hero grid & Box Shadows
content = content.replace("box-shadow: 0 10px 40px var(--accent-glow);", "box-shadow: 0 15px 35px var(--accent-glow);")
# soften neon badge pulse
content = content.replace("animation:pulse 2s infinite;", "animation:pulse 3s infinite;")

with open("home.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied directly to home.html via script.")
