import pathlib
p = pathlib.Path(r'C:\Users\Hp\AppData\Local\Programs\Python\Python312\Lib\site-packages\inference_sdk\http\utils\image_reader.py')
text = p.read_text()
lines = text.splitlines()
for i, line in enumerate(lines):
    if 'def load_nested_batches_of_inference_input' in line or 'def inject_nested_batches_of_images_into_payload' in line or 'def load_inference_input' in line:
        start = max(0, i-5)
        end = min(len(lines), i+80)
        print('\n'.join(f'{j+1}: {lines[j]}' for j in range(start, end)))
        print('---')
