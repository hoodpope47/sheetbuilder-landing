import os
from pathlib import Path

from PIL import Image


def normalize_logos(
    logos_dir: Path = Path("public/logos"),
    canvas_size: int = 400,
    max_logo_scale: float = 0.95,
) -> None:
    """
    Normalize all PNG logos in public/logos:

    - Canvas: square (canvas_size x canvas_size)
    - Transparent background
    - Logo centered
    - Preserve aspect ratio (no stretching)
    - Scale logo so the largest side is at most max_logo_scale * canvas_size
    """

    logos_dir = logos_dir.resolve()
    if not logos_dir.exists():
        print(f"[normalize_logos] Directory not found: {logos_dir}")
        return

    png_files = sorted(logos_dir.glob("*.png"))
    if not png_files:
        print(f"[normalize_logos] No PNG files found in {logos_dir}")
        return

    print(f"[normalize_logos] Normalizing {len(png_files)} logo(s) in {logos_dir}...")

    for logo_path in png_files:
        try:
            img = Image.open(logo_path).convert("RGBA")
        except Exception as e:
            print(f"  [skip] Could not open {logo_path.name}: {e}")
            continue

        # Autocrop: remove transparent borders
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
        
        orig_w, orig_h = img.size
        if orig_w == 0 or orig_h == 0:
            print(f"  [skip] Invalid image size for {logo_path.name}")
            continue

        # target canvas
        canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

        # compute scale to fit within margin box
        margin_box = int(canvas_size * max_logo_scale)
        scale = min(margin_box / orig_w, margin_box / orig_h)
        new_w = int(orig_w * scale)
        new_h = int(orig_h * scale)

        resized = img.resize((new_w, new_h), Image.LANCZOS)

        # center position
        offset_x = (canvas_size - new_w) // 2
        offset_y = (canvas_size - new_h) // 2
        canvas.paste(resized, (offset_x, offset_y), resized)

        # overwrite original file
        canvas.save(logo_path, format="PNG", optimize=True)
        print(f"  [ok] {logo_path.name} -> {canvas_size}x{canvas_size} centered (autocropped)")

    print("[normalize_logos] Done.")


if __name__ == "__main__":
    try:
        normalize_logos()
    except ImportError as e:
        print("[error] Missing dependency. Install Pillow with:")
        print("  pip install Pillow")
        raise
