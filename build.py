"""Inline the images and the Arita Buri font into src/dt-expert-talks.js -> dist/dt-expert-talks.js."""
from pathlib import Path

root = Path(__file__).parent
src = (root / "src" / "dt-expert-talks.js").read_text(encoding="utf-8")
inline = {
    "__LOGO__": "logo.b64",
    "__HEADSHOT__": "headshot.b64",
    "__ARITA_MEDIUM__": "arita-buri-medium.b64",
    "__ARITA_SEMIBOLD__": "arita-buri-semibold.b64",
}
out = src
for placeholder, name in inline.items():
    out = out.replace(placeholder, (root / "src" / name).read_text().strip())
(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "dt-expert-talks.js").write_text(out, encoding="utf-8")
print(f"dist/dt-expert-talks.js {len(out.encode()) / 1024:.1f} KB")
