import inspect
import sys
sys.path.append('ai-model')
from inference_sdk import InferenceHTTPClient

print(inspect.signature(InferenceHTTPClient.run_workflow))
print(InferenceHTTPClient.run_workflow.__doc__)
