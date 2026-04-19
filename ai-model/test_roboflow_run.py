import os
import sys

os.environ['ROBOFLOW_API_KEY'] = 'C4h4YlS4rjZkveCrezTO'
os.environ['ROBOFLOW_WORKSPACE'] = 'ayush-pandey-tvifz'
os.environ['ROBOFLOW_WORKFLOW_ID'] = 'yolo-world-medium-demo'
os.environ['ROBOFLOW_CLASSES'] = 'plastic,paper,metal,glass,organic,electronic,textile,cardboard'

sys.path.append(os.path.dirname(__file__))
from roboflow_predict import analyze_image_with_roboflow

result = analyze_image_with_roboflow('..\\uploads\\1776531589234.jpg')
print(result)
