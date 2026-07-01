#!/usr/bin/env python3
"""
IMPACT BTP Gabon Plus — Palette Refinement Engine
Keeps all base hues locked. Adjusts saturation & lightness for sophistication.
Generates shade scales (50–900) for each brand color.
Neutralizes grays with parasitic color casts.
"""
import colorsys
import math

def hex_to_rgb(h: str):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r, g, b):
    return f'#{r:02x}{g:02x}{b:02x}'.upper()

def rgb_to_hsl(r, g, b):
    """Returns H(0-360), S(0-100), L(0-100)"""
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    return round(h*360, 1), round(s*100, 1), round(l*100, 1)

def hsl_to_rgb(h, s, l):
    """h:0-360, s:0-100, l:0-100 → (r,g,b) 0-255"""
    r, g, b = colorsys.hls_to_rgb(h/360, l/100, s/100)
    return round(r*255), round(g*255), round(b*255)

def format_hsl(h, s, l):
    return f"HSL({h:.0f}°, {s:.0f}%, {l:.0f}%)"

def contrast_ratio(l1, l2):
    """Relative luminance based WCAG contrast ratio. Simplified with lightness approximation."""
    # Full WCAG relative luminance calculation
    def relative_luminance(r, g, b):
        def linearize(c):
            c = c / 255
            return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)

    # l1, l2 are (r,g,b) tuples
    lum1 = relative_luminance(*l1)
    lum2 = relative_luminance(*l2)
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)

def wcag_grade(ratio):
    if ratio >= 7: return "AAA"
    if ratio >= 4.5: return "AA"
    if ratio >= 3: return "AA (large)"
    return "FAIL"

# ── Current palette ──
current = {
    # Brand
    '--blue':        '#005090',
    '--blue-dark':   '#003F73',
    '--blue-ink':    '#05253F',
    '--blue-soft':   '#DFEEF8',
    '--green':       '#107030',
    '--green-dark':  '#0B5726',
    '--green-soft':  '#DFEEE3',
    '--yellow':      '#F2BD18',
    '--yellow-soft': '#FFF4CB',
    # Typography
    '--ink':         '#102033',
    '--text':        '#38495A',
    '--muted':       '#6A7B88',
    # Grays
    '--line':        '#DDE1E5',
    '--soft':        '#F0F2F4',
    '--surface':     '#FAFBFB',
    '--surface-strong':'#EEF0F2',
    '--bg':          '#F5F6F7',
    '--bg-alt':      '#EDF0F2',
    '--bg-card-hover':'#FAFBFC',
    # Tints
    '--tint-blue':   '#D6E6F4',
    '--tint-green':  '#D4E7D7',
    '--tint-yellow': '#FEF3C7',
    # Dark section text
    '--text-on-dark':'#C8D8E8',
    '--text-muted-on-dark':'#889DB5',
}

# ── Extract base hues ──
base_hues = {}
for name, hex_val in current.items():
    r, g, b = hex_to_rgb(hex_val)
    h, s, l = rgb_to_hsl(r, g, b)
    base_hues[name] = (h, s, l)

print("=" * 100)
print("IMPACT BTP GABON PLUS — PALETTE REFINEMENT REPORT")
print("=" * 100)

# ═══════════════════════════════════════════════════════════════
# 1. BRAND BLUE — H locked at 207°
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("🔵 BRAND BLUE FAMILY — Hue locked at 207°")
print("─" * 100)

BLUE_H = 207

# Current blue: H=206.7°, S=100%, L=28.2%
# Issue: 100% saturation = aggressive/neon feel
# Fix: reduce S to ~82%, nudge L to 34% for a cleaner, more sophisticated royal blue
# This keeps the same character but removes the "digital neon" edge

blue_scale = {
    50:  (BLUE_H, 35, 96),
    100: (BLUE_H, 45, 90),
    200: (BLUE_H, 55, 82),
    300: (BLUE_H, 65, 70),
    400: (BLUE_H, 75, 52),
    500: (BLUE_H, 82, 38),   # Primary — refined from #005090
    600: (BLUE_H, 85, 30),
    700: (BLUE_H, 88, 23),
    800: (BLUE_H, 90, 16),
    900: (BLUE_H, 92, 11),
}

old_h, old_s, old_l = base_hues['--blue']
new_h, new_s, new_l = BLUE_H, 82, 38
old_rgb = hex_to_rgb(current['--blue'])
new_rgb = hsl_to_rgb(BLUE_H, 82, 38)
new_hex = rgb_to_hex(*new_rgb)

print(f"\n  --blue (Primary)")
print(f"    Before: {current['--blue']}  {format_hsl(old_h, old_s, old_l)}")
print(f"    After:  {new_hex}  {format_hsl(BLUE_H, 82, 38)}")
print(f"    Action: Saturation réduite de {old_s:.0f}% → 82% (−{old_s-82:.0f}pts), Luminosité de {old_l:.0f}% → 38% (+{38-old_l:.0f}pts)")
print(f"    Effet:  Supprime l'aspect « néon numérique », donne un bleu roi corporate plus respirant")

# Blue dark
old_h2, old_s2, old_l2 = base_hues['--blue-dark']
new_rgb2 = hsl_to_rgb(BLUE_H, 85, 30)
print(f"\n  --blue-dark")
print(f"    Before: {current['--blue-dark']}  {format_hsl(old_h2, old_s2, old_l2)}")
print(f"    After:  {rgb_to_hex(*new_rgb2)}  {format_hsl(BLUE_H, 85, 30)}")
print(f"    Action: Saturation réduite, teinte réalignée sur {BLUE_H}°")

# Blue ink  
old_h3, old_s3, old_l3 = base_hues['--blue-ink']
new_rgb3 = hsl_to_rgb(BLUE_H, 88, 12)
print(f"\n  --blue-ink")
print(f"    Before: {current['--blue-ink']}  {format_hsl(old_h3, old_s3, old_l3)}")
print(f"    After:  {rgb_to_hex(*new_rgb3)}  {format_hsl(BLUE_H, 88, 12)}")
print(f"    Action: Teinte réalignée de {old_h3:.0f}° → {BLUE_H}°, saturation légèrement augmentée pour plus de profondeur")

# Blue soft
old_h4, old_s4, old_l4 = base_hues['--blue-soft']
new_rgb4 = hsl_to_rgb(BLUE_H, 30, 92)
print(f"\n  --blue-soft")
print(f"    Before: {current['--blue-soft']}  {format_hsl(old_h4, old_s4, old_l4)}")
print(f"    After:  {rgb_to_hex(*new_rgb4)}  {format_hsl(BLUE_H, 30, 92)}")
print(f"    Action: Teinte réalignée de {old_h4:.0f}° → {BLUE_H}°, saturation réduite pour un fond plus neutre et propre")

# Generate shade scale
print(f"\n  📐 Blue Shade Scale (50–900):")
for level in sorted(blue_scale.keys()):
    h, s, l = blue_scale[level]
    rgb_s = hsl_to_rgb(h, s, l)
    hex_s = rgb_to_hex(*rgb_s)
    print(f"    --blue-{level:03d}: {hex_s}  {format_hsl(h, s, l)}")

# ═══════════════════════════════════════════════════════════════
# 2. BRAND GREEN — H locked at 140°
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("🟢 BRAND GREEN FAMILY — Hue locked at 140°")
print("─" * 100)

GREEN_H = 140

green_scale = {
    50:  (GREEN_H, 30, 95),
    100: (GREEN_H, 35, 89),
    200: (GREEN_H, 42, 80),
    300: (GREEN_H, 50, 65),
    400: (GREEN_H, 58, 48),
    500: (GREEN_H, 68, 32),   # Primary — refined from #107030
    600: (GREEN_H, 72, 26),
    700: (GREEN_H, 76, 20),
    800: (GREEN_H, 80, 14),
    900: (GREEN_H, 84, 9),
}

old_h, old_s, old_l = base_hues['--green']
new_rgb_g = hsl_to_rgb(GREEN_H, 68, 32)
new_hex_g = rgb_to_hex(*new_rgb_g)

print(f"\n  --green (Primary)")
print(f"    Before: {current['--green']}  {format_hsl(old_h, old_s, old_l)}")
print(f"    After:  {new_hex_g}  {format_hsl(GREEN_H, 68, 32)}")
print(f"    Action: Saturation réduite de {old_s:.0f}% → 68%, Luminosité de {old_l:.0f}% → 32% (+{32-old_l:.0f}pts)")
print(f"    Effet:  Vert forêt plus lumineux et moins « militaire », meilleure lisibilité sur fond blanc")

old_h2, old_s2, old_l2 = base_hues['--green-dark']
new_rgb_g2 = hsl_to_rgb(GREEN_H, 72, 26)
print(f"\n  --green-dark")
print(f"    Before: {current['--green-dark']}  {format_hsl(old_h2, old_s2, old_l2)}")
print(f"    After:  {rgb_to_hex(*new_rgb_g2)}  {format_hsl(GREEN_H, 72, 26)}")

old_h3, old_s3, old_l3 = base_hues['--green-soft']
new_rgb_g3 = hsl_to_rgb(GREEN_H, 25, 91)
print(f"\n  --green-soft")
print(f"    Before: {current['--green-soft']}  {format_hsl(old_h3, old_s3, old_l3)}")
print(f"    After:  {rgb_to_hex(*new_rgb_g3)}  {format_hsl(GREEN_H, 25, 91)}")
print(f"    Action: Teinte réalignée de {old_h3:.0f}° → {GREEN_H}°")

print(f"\n  📐 Green Shade Scale (50–900):")
for level in sorted(green_scale.keys()):
    h, s, l = green_scale[level]
    rgb_s = hsl_to_rgb(h, s, l)
    hex_s = rgb_to_hex(*rgb_s)
    print(f"    --green-{level:03d}: {hex_s}  {format_hsl(h, s, l)}")

# ═══════════════════════════════════════════════════════════════
# 3. BRAND YELLOW — H locked at 46°
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("🟡 BRAND YELLOW FAMILY — Hue locked at 46°")
print("─" * 100)

YELLOW_H = 46

yellow_scale = {
    50:  (YELLOW_H, 60, 96),
    100: (YELLOW_H, 70, 91),
    200: (YELLOW_H, 78, 84),
    300: (YELLOW_H, 82, 74),
    400: (YELLOW_H, 84, 62),
    500: (YELLOW_H, 85, 50),   # Primary — refined from #F2BD18
    600: (YELLOW_H, 86, 42),
    700: (YELLOW_H, 88, 34),
    800: (YELLOW_H, 90, 26),
    900: (YELLOW_H, 92, 18),
}

old_h, old_s, old_l = base_hues['--yellow']
new_rgb_y = hsl_to_rgb(YELLOW_H, 85, 50)
new_hex_y = rgb_to_hex(*new_rgb_y)

print(f"\n  --yellow (Primary)")
print(f"    Before: {current['--yellow']}  {format_hsl(old_h, old_s, old_l)}")
print(f"    After:  {new_hex_y}  {format_hsl(YELLOW_H, 85, 50)}")
print(f"    Action: Saturation réduite de {old_s:.0f}% → 85%, teinte recalée de {old_h:.0f}° → {YELLOW_H}°")
print(f"    Effet:  Or plus chaud et moins « sécurité routière », meilleure élégance")

# Yellow soft
old_h2, old_s2, old_l2 = base_hues['--yellow-soft']
new_rgb_y2 = hsl_to_rgb(YELLOW_H, 45, 93)
print(f"\n  --yellow-soft")
print(f"    Before: {current['--yellow-soft']}  {format_hsl(old_h2, old_s2, old_l2)}")
print(f"    After:  {rgb_to_hex(*new_rgb_y2)}  {format_hsl(YELLOW_H, 45, 93)}")
print(f"    Action: Saturation réduite, teinte réalignée")

print(f"\n  📐 Yellow Shade Scale (50–900):")
for level in sorted(yellow_scale.keys()):
    h, s, l = yellow_scale[level]
    rgb_s = hsl_to_rgb(h, s, l)
    hex_s = rgb_to_hex(*rgb_s)
    print(f"    --yellow-{level:03d}: {hex_s}  {format_hsl(h, s, l)}")

# ═══════════════════════════════════════════════════════════════
# 4. NEUTRALIZATION OF GRAYS
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("⚪ GRAY SYSTEM — Full neutralization (parasitic color casts removed)")
print("─" * 100)

gray_map = {
    '--line':          (0, 2, 89),    # Was H≈210° with blue cast → pure gray
    '--soft':          (0, 1, 95),    # Was H≈210° → pure gray
    '--surface':       (0, 0, 98),    # Was H≈180° with cyan cast → pure white-gray
    '--surface-strong':(0, 2, 94),    # Was H≈210° → pure gray
    '--bg':            (0, 1, 96),    # Was H≈210° → pure gray
    '--bg-alt':        (0, 2, 94),    # Was H≈204° → pure gray
    '--bg-card-hover': (0, 1, 98),    # Was H≈210° → pure gray
    '--white':         (0, 0, 100),   # stays #FFFFFF
}

# --surface-strong and --bg-alt would collide at same values, let's differentiate
gray_map['--surface-strong'] = (0, 2, 93)
gray_map['--bg-alt'] = (0, 1, 94)

for name, (h, s, l) in gray_map.items():
    if name == '--white':
        print(f"\n  {name}: #FFFFFF → #FFFFFF (inchangé)")
        continue
    old_h, old_s, old_l = base_hues[name]
    new_rgb_gray = hsl_to_rgb(h, s, l)
    new_hex_gray = rgb_to_hex(*new_rgb_gray)
    print(f"\n  {name}")
    print(f"    Before: {current[name]}  {format_hsl(old_h, old_s, old_l)}  ← teinte parasite {old_h:.0f}°")
    print(f"    After:  {new_hex_gray}  {format_hsl(h, s, l)}  ← gris pur, neutre")
    if old_h > 2:
        print(f"    Action: Suppression de la dominante froide (bleu/cyan ~{old_h:.0f}°) → gris parfaitement neutre")

# ═══════════════════════════════════════════════════════════════
# 5. TYPOGRAPHY REFINEMENT
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("📝 TYPOGRAPHY — Subtle refinement for readability")
print("─" * 100)

# --ink: keep the blue-black character but reduce saturation slightly
old_h_i, old_s_i, old_l_i = base_hues['--ink']
new_rgb_ink = hsl_to_rgb(215, 25, 13)
print(f"\n  --ink")
print(f"    Before: {current['--ink']}  {format_hsl(old_h_i, old_s_i, old_l_i)}")
print(f"    After:  {rgb_to_hex(*new_rgb_ink)}  {format_hsl(215, 25, 13)}")
print(f"    Action: Légère réduction de saturation pour un noir plus naturel")

# --text: make slightly more neutral
old_h_t, old_s_t, old_l_t = base_hues['--text']
new_rgb_text = hsl_to_rgb(212, 14, 30)
print(f"\n  --text")
print(f"    Before: {current['--text']}  {format_hsl(old_h_t, old_s_t, old_l_t)}")
print(f"    After:  {rgb_to_hex(*new_rgb_text)}  {format_hsl(212, 14, 30)}")
print(f"    Action: Saturation réduite, meilleure lisibilité en corps de texte")

# --muted: clean up
old_h_m, old_s_m, old_l_m = base_hues['--muted']
new_rgb_muted = hsl_to_rgb(210, 8, 48)
print(f"\n  --muted")
print(f"    Before: {current['--muted']}  {format_hsl(old_h_m, old_s_m, old_l_m)}")
print(f"    After:  {rgb_to_hex(*new_rgb_muted)}  {format_hsl(210, 8, 48)}")

# ═══════════════════════════════════════════════════════════════
# 6. DARK SECTION TEXT
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("🌙 DARK SECTION TEXT")
print("─" * 100)

old_h_d, old_s_d, old_l_d = base_hues['--text-on-dark']
new_rgb_tod = hsl_to_rgb(207, 18, 86)
print(f"\n  --text-on-dark")
print(f"    Before: {current['--text-on-dark']}  {format_hsl(old_h_d, old_s_d, old_l_d)}")
print(f"    After:  {rgb_to_hex(*new_rgb_tod)}  {format_hsl(207, 18, 86)}")
print(f"    Action: Saturation réduite pour un texte plus doux sur fond sombre")

old_h_md, old_s_md, old_l_md = base_hues['--text-muted-on-dark']
new_rgb_tmod = hsl_to_rgb(210, 12, 62)
print(f"\n  --text-muted-on-dark")
print(f"    Before: {current['--text-muted-on-dark']}  {format_hsl(old_h_md, old_s_md, old_l_md)}")
print(f"    After:  {rgb_to_hex(*new_rgb_tmod)}  {format_hsl(210, 12, 62)}")

# ═══════════════════════════════════════════════════════════════
# 7. TINTS (keep aligned with brand hues)
# ═══════════════════════════════════════════════════════════════
print("\n" + "─" * 100)
print("🎨 TINTS — Realigned to exact brand hues")
print("─" * 100)

old_h_tb, old_s_tb, old_l_tb = base_hues['--tint-blue']
new_rgb_tb = hsl_to_rgb(BLUE_H, 22, 91)
print(f"\n  --tint-blue")
print(f"    Before: {current['--tint-blue']}  {format_hsl(old_h_tb, old_s_tb, old_l_tb)}")
print(f"    After:  {rgb_to_hex(*new_rgb_tb)}  {format_hsl(BLUE_H, 22, 91)}")
print(f"    Action: Teinte réalignée de {old_h_tb:.0f}° → {BLUE_H}°")

old_h_tg, old_s_tg, old_l_tg = base_hues['--tint-green']
new_rgb_tg = hsl_to_rgb(GREEN_H, 20, 91)
print(f"\n  --tint-green")
print(f"    Before: {current['--tint-green']}  {format_hsl(old_h_tg, old_s_tg, old_l_tg)}")
print(f"    After:  {rgb_to_hex(*new_rgb_tg)}  {format_hsl(GREEN_H, 20, 91)}")
print(f"    Action: Teinte réalignée de {old_h_tg:.0f}° → {GREEN_H}°")

old_h_ty, old_s_ty, old_l_ty = base_hues['--tint-yellow']
new_rgb_ty = hsl_to_rgb(YELLOW_H, 35, 92)
print(f"\n  --tint-yellow")
print(f"    Before: {current['--tint-yellow']}  {format_hsl(old_h_ty, old_s_ty, old_l_ty)}")
print(f"    After:  {rgb_to_hex(*new_rgb_ty)}  {format_hsl(YELLOW_H, 35, 92)}")
print(f"    Action: Teinte réalignée de {old_h_ty:.0f}° → {YELLOW_H}°")

# ═══════════════════════════════════════════════════════════════
# 8. WCAG CONTRAST AUDIT
# ═══════════════════════════════════════════════════════════════
print("\n" + "=" * 100)
print("🔍 WCAG 2.1 CONTRAST AUDIT (Key text/background pairs)")
print("=" * 100)

white_rgb = (255, 255, 255)
ink_rgb_new = hsl_to_rgb(215, 25, 13)
text_rgb_new = hsl_to_rgb(212, 14, 30)
blue_rgb_new = hsl_to_rgb(BLUE_H, 82, 38)
green_rgb_new = hsl_to_rgb(GREEN_H, 68, 32)
yellow_rgb_new = hsl_to_rgb(YELLOW_H, 85, 50)
blue_ink_rgb = hsl_to_rgb(BLUE_H, 88, 12)
bg_new = hsl_to_rgb(0, 1, 96)

contrasts = [
    ("Texte principal (--text) sur fond blanc", text_rgb_new, white_rgb),
    ("Texte principal (--text) sur --bg", text_rgb_new, bg_new),
    ("Titres (--ink) sur fond blanc", ink_rgb_new, white_rgb),
    ("Texte blanc sur --blue (boutons CTA)", white_rgb, blue_rgb_new),
    ("Texte blanc sur --green", white_rgb, green_rgb_new),
    ("Texte sombre (--ink) sur --yellow", ink_rgb_new, yellow_rgb_new),
    ("Texte sur fond sombre (footer)", hsl_to_rgb(207, 18, 86), blue_ink_rgb),
    ("--muted sur fond blanc", hsl_to_rgb(210, 8, 48), white_rgb),
]

for label, fg, bg in contrasts:
    ratio = contrast_ratio(fg, bg)
    grade = wcag_grade(ratio)
    fg_hex = rgb_to_hex(*fg)
    bg_hex = rgb_to_hex(*bg)
    icon = "✅" if ratio >= 4.5 else "⚠️" if ratio >= 3 else "❌"
    print(f"  {icon} {label}")
    print(f"     {fg_hex} sur {bg_hex} → ratio {ratio:.1f}:1 [{grade}]")

print("\n" + "=" * 100)
print("✅ Palette refinement complete. All brand hues preserved.")
print("=" * 100)
