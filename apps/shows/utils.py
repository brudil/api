def hex_to_rgb(h):
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def dark_tone_from_accent(accent_hex):
    if accent_hex.startswith('#'):
        accent_hex = accent_hex[1:]

    r, g, b = hex_to_rgb(accent_hex)

    a = 1 - (0.299 * r + 0.587 * g + 0.114 * b)/255
    return a < 0.5
