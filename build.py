"""Inline the images into src/dt-expert-talks.js -> dist/dt-expert-talks.js."""
from pathlib import Path

root = Path(__file__).parent
src = (root / "src" / "dt-expert-talks.js").read_text(encoding="utf-8")
out = src.replace("__LOGO__", (root / "src" / "logo.b64").read_text().strip()).replace(
    "__HEADSHOT__", (root / "src" / "headshot.b64").read_text().strip()
)
(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "dt-expert-talks.js").write_text(out, encoding="utf-8")
print(f"dist/dt-expert-talks.js {len(out.encode()) / 1024:.1f} KB")
