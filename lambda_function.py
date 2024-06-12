import sys
import json
import boto3
import io
import os
import subprocess
import concurrent.futures
import uuid


def execute_test_case(code, test_case):

    temp_script_filename = f"/tmp/temp_script_{uuid.uuid4().hex}.py"

    args = {k: v for k, v in test_case.items() if k != "expected_output"}
    expected_output = test_case.get("expected_output", None)

    complete_code = f"""
import argparse
import json


{code}

def run_test_case():
    try:
        result = add(**{args})
        return {{"test_case": {args}, "your_output": result, "expected_output": {expected_output}, "status": "PASSED" if result == {expected_output} else "FAILED", "error": None}}
    except Exception as e:
        return {{"test_case": {args}, "your_output": None, "expected_output": {expected_output}, "status": "FAILED", "error": str(e)}}

if __name__ == "__main__":
    output = run_test_case()
    print(json.dumps(output))
    """

    try:

        with open(temp_script_filename, "w") as temp_script_file:
            temp_script_file.write(complete_code)

        result = subprocess.run(
            ["python3", temp_script_filename], capture_output=True, text=True
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
        else:
            return {
                "test_case": args,
                "your_output": None,
                "expected_output": expected_output,
                "status": "FAILED",
                "error": result.stderr,
            }

    except Exception as e:
        return {
            "test_case": args,
            "your_output": None,
            "expected_output": expected_output,
            "status": "FAILED",
            "error": str(e),
        }

    finally:

        if os.path.exists(temp_script_filename):
            os.remove(temp_script_filename)


def handler(event, context):
    language = event.get("language", "")
    code = event.get("code", "")

    TEST_CASE_DIR = os.path.join("test_cases", "add_test_cases.json")

    with open(TEST_CASE_DIR, "r") as test_file:
        test_cases = json.load(test_file)

    if language != "python" or code == "":
        response = {
            "status": 400,
            "message": "Valid language (python), code, and test cases are required",
            "output": None,
        }
    else:
        results = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(execute_test_case, code, test_case)
                for test_case in test_cases
            ]
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())

        response = {
            "status": 200,
            "output": results,
            "message": "Code executed successfully",
        }

    return {
        "statusCode": response["status"],
        "headers": {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "POST",
        },
        "body": json.dumps(response),
    }
