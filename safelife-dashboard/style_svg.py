import os

file_path = 'images/india.svg'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The SVG from svg-maps usually starts with <svg ...
    # We can inject a style block into the SVG to style the paths
    style_block = "<style> path { fill: rgba(255,255,255,0.85); stroke: #8d99ae; stroke-width: 0.5px; } </style>"
    
    # Just insert it right after the opening <svg ...> tag
    # Find the first > after <svg
    svg_tag_end = content.find('>', content.find('<svg'))
    if svg_tag_end != -1:
        new_content = content[:svg_tag_end+1] + style_block + content[svg_tag_end+1:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("SVG styled successfully")
    else:
        print("Could not find <svg tag")
else:
    print("SVG not found")
