import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import sys
import json
import numpy as np
from PIL import Image

try:
    import tensorflow as tf
    from tensorflow.keras import models
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
    from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
    tf.get_logger().setLevel('ERROR')
except ImportError:
    tf = None
    models = None
    MobileNetV2 = None
    preprocess_input = None
    GlobalAveragePooling2D = None
    Dense = None
    Dropout = None

CLASS_NAMES = [
    'Glass',
    'Metal',
    'Paper',
    'Plastic'
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.h5')
DEFAULT_IMAGE_SIZE = (224, 224)


def get_model_path():
    if not os.path.exists(MODEL_PATH) or os.path.getsize(MODEL_PATH) == 0:
        raise FileNotFoundError(f'Local model not found or invalid at {MODEL_PATH}')
    return MODEL_PATH


def build_mobilenet_model(num_classes, input_shape=DEFAULT_IMAGE_SIZE):
    if MobileNetV2 is None:
        raise ImportError('TensorFlow and Keras are required to build the model. Install them with "pip install tensorflow"')

    base_model = MobileNetV2(
        include_top=False,
        weights='imagenet',
        input_shape=(input_shape[0], input_shape[1], 3)
    )
    base_model.trainable = False

    model = models.Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dense(256, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])

    return model


def load_model():
    if tf is None or models is None:
        raise ImportError('TensorFlow is not installed. Install it with "pip install tensorflow"')

    model_path = get_model_path()

    try:
        return tf.keras.models.load_model(model_path, compile=False)
    except Exception as e:
        # Fallback for weights-only H5 files
        fallback_model = build_mobilenet_model(num_classes=len(CLASS_NAMES), input_shape=DEFAULT_IMAGE_SIZE)
        fallback_model.load_weights(model_path)
        return fallback_model


def resolve_resample():
    if hasattr(Image, 'Resampling'):
        return Image.Resampling.LANCZOS
    return Image.ANTIALIAS


def preprocess_image(image_path, target_size):
    image = Image.open(image_path).convert('RGB')
    image = image.resize(target_size, resolve_resample())
    array = np.asarray(image).astype('float32')
    if preprocess_input is None:
        array = array / 255.0
    else:
        array = preprocess_input(array)
    if array.ndim == 3:
        array = np.expand_dims(array, 0)
    return array


def predict_image(image_path):
    model = load_model()
    target_size = DEFAULT_IMAGE_SIZE
    image_data = preprocess_image(image_path, target_size)
    predictions = model.predict(image_data, verbose=0)

    if predictions.ndim == 2 and predictions.shape[1] > 1:
        scores = predictions[0]
        index = int(np.argmax(scores))
        confidence = float(np.max(scores))
    elif predictions.ndim == 2 and predictions.shape[1] == 1:
        score = float(predictions[0][0])
        index = 1 if score >= 0.5 else 0
        confidence = score
    elif predictions.ndim == 1:
        if predictions.shape[0] == 1:
            score = float(predictions[0])
            index = 1 if score >= 0.5 else 0
            confidence = score
        else:
            scores = predictions
            index = int(np.argmax(scores))
            confidence = float(np.max(scores))
    else:
        raise ValueError(f'Unexpected prediction shape: {predictions.shape}')

    label = CLASS_NAMES[index] if index < len(CLASS_NAMES) else f'Class_{index}'
    return {
        'waste_type': label,
        'confidence': confidence,
        'prediction_index': index
    }


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Usage: python predict.py <image_path>'}))
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        prediction = predict_image(image_path)
        print(json.dumps(prediction))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
