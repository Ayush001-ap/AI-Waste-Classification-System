import pathlib
p = pathlib.Path(r'C:\Users\Hp\AppData\Local\Programs\Python\Python312\Lib\site-packages\inference_sdk\http\utils')
for name in ['loaders.py','requests.py']:
    f = p / name
    text = f.read_text().splitlines()
    print('===', name, '===')
    for i, line in enumerate(text):
        if 'def load_nested_batches_of_inference_input' in line or 'def inject_nested_batches_of_images_into_payload' in line or 'def load_inference_input' in line or 'def _load_' in line or 'def _load' in line:
            start = max(0, i-10)
            end = min(len(text), i+80)
            for j in range(start, end):
                print(f'{j+1}: {text[j]}')
            print('---')
