import os
import sys
import json
from inference_sdk import InferenceHTTPClient
import cv2
import numpy as np


def analyze_image_with_roboflow(image_path):
    api_key = os.getenv("ROBOFLOW_API_KEY")
    workspace_name = os.getenv("ROBOFLOW_WORKSPACE")
    workflow_id = os.getenv("ROBOFLOW_WORKFLOW_ID")
    model_url = os.getenv("ROBOFLOW_MODEL_URL")
    model_name = os.getenv("ROBOFLOW_MODEL")
    classes_env = os.getenv("ROBOFLOW_CLASSES")

    if not api_key:
        raise ValueError("ROBOFLOW_API_KEY is not set")

    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=api_key
    )

    classes = None
    if classes_env:
        classes = [cls.strip() for cls in classes_env.split(",") if cls.strip()]

    if workspace_name and workflow_id:
        # Read image as numpy array
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from {image_path}")

        parameters = {}
        if classes:
            parameters["classes"] = classes

        result = client.run_workflow(
            workspace_name=workspace_name,
            workflow_id=workflow_id,
            images={"image": image},  # Send as numpy array
            parameters=parameters or None,
            use_cache=True
        )
        return parse_roboflow_result(result)

    if model_url or model_name:
        try:
            import requests
        except ImportError as e:
            raise ImportError("The requests package is required for direct Roboflow model inference. Install it with 'pip install requests'.") from e

        endpoint = model_url if model_url else f"https://detect.roboflow.com/{model_name}"
        with open(image_path, "rb") as image_file:
            response = requests.post(
                f"{endpoint}?api_key={api_key}",
                files={"file": image_file},
                timeout=30
            )
            response.raise_for_status()
            return parse_roboflow_result(response.json())

    raise ValueError(
        "No Roboflow workflow or model configured. Set ROBOFLOW_WORKSPACE and ROBOFLOW_WORKFLOW_ID, or ROBOFLOW_MODEL_URL / ROBOFLOW_MODEL in .env."
    )


def parse_roboflow_result(data):
    if not isinstance(data, (dict, list)):
        return {"waste_type": "Unknown", "confidence": 0, "error": "Invalid Roboflow response format"}

    if isinstance(data, list) and len(data) > 0:
        data = data[0]  # Take first item if it's a list

    if data.get("error"):
        return {"waste_type": "Unknown", "confidence": 0, "error": data.get("error")}

    predictions = []
    # Try different possible paths for predictions
    if isinstance(data.get("predictions"), dict) and "predictions" in data["predictions"]:
        predictions = data["predictions"]["predictions"]
    elif isinstance(data.get("predictions"), list):
        predictions = data["predictions"]
    elif isinstance(data.get("outputs"), list):
        predictions = data["outputs"]

    if predictions:
        best_prediction = max(predictions, key=lambda item: item.get("confidence", 0))
        return {
            "waste_type": best_prediction.get("class") or best_prediction.get("label") or "Unknown",
            "confidence": best_prediction.get("confidence", 0),
            "all_predictions": predictions
        }

    return {"waste_type": "Unknown", "confidence": 0, "error": "No predictions found"}


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python roboflow_predict.py <image_path>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    try:
        result = analyze_image_with_roboflow(image_path)
    except Exception as e:
        print(json.dumps({"waste_type": "Unknown", "confidence": 0, "error": str(e)}))
        sys.exit(1)

    print(json.dumps(result))