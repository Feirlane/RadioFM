from random import randint
from string import Template

svg_init = """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!--
Created by Marcos 'Feirlane' López <feirlane@gmail.com>

This work is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License.
To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/4.0/
-->
<svg
xmlns:dc="http://purl.org/dc/elements/1.1/"
xmlns:cc="http://creativecommons.org/ns#"
xmlns:rdf="htntp://www.w3.org/1999/02/22-rdf-syntax-ns#"
xmlns:svg="http://www.w3.org/2000/svg"
xmlns="http://www.w3.org/2000/svg">

\t<g id="bars" fill="#888888">"""

svg_rect = Template("""\t\t<rect x="$x" y="25" width="3px" height="50px">
\t\t\t<animate attributeType="XML" attributeName="y" values="$ys" dur="2.5s" repeatCount="indefinite"/>
\t\t\t<animate attributeType="XML" attributeName="height" values="$hs" dur="2.5s" repeatCount="indefinite"/>
\t\t</rect>""")
svg_end = """\t</g>
</svg>"""

min_height = 10
max_heights = [30, 70, 90, 90, 70, 90, 70, 90, 90, 70, 30]
n_bars = len(max_heights)
bar_spacing = 7
n_frames = 20

first_bar_x = 75 - 1 - ((n_bars/2) * bar_spacing)

print(svg_init)
for i in range(0, n_bars):
    print()
    print()
    ys = []
    hs = []
    for j in range(0, n_frames):
        height = randint(min_height/2, max_heights[i]/2)
        ys.append(str(75 - height))
        hs.append(str(height*2))
    ys.append(ys[0])
    hs.append(hs[0])
    print(svg_rect.substitute(x=str(first_bar_x + i * bar_spacing), ys=';'.join(ys), hs=';'.join(hs)))

print(svg_end)
