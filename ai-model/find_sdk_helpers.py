import pathlib, sys
p = pathlib.Path(r'C:\Users\Hp\AppData\Local\Programs\Python\Python312\Lib\site-packages\inference_sdk\http\utils')
for f in p.glob('*.py'):
    text = f.read_text()
    matches = [line for line in text.splitlines() if 'load_nested_batches_of_inference_input' in line or 'inject_nested_batches_of_images_into_payload' in line or 'load_inference_input' in line]
    if matches:
        print(f.name)
        for line in matches:
            print(line)
        print('---')
