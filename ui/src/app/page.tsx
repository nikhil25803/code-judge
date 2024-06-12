"use client";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface ApiRequestBodyInterface {
  code: string;
  language: string;
}

interface ApiResponseInterface {
  test_case: {
    arg1: number;
    arg2: number;
  };
  your_output: number;
  expected_output: number;
  status: "PASSED" | "FAILED";
  error: null | string;
}

export default function Home() {
  const [code, setCode] = useState("");
  const [submissionResult, setSubmissionResult] = useState([]);

  const handleEditorChange = async (value: any, event: any) => {
    setCode(value);
  };

  const onSubmit = async () => {
    const requestBody = {
      language: "python",
      code: code.trim(),
    };

    try {
      const response = await axios.post(`/api/functionInvoke`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response_received = response.data.data;
      const json_response = JSON.parse(response_received.body);
      if (json_response.status === 200) {
        setSubmissionResult(json_response.output);
        console.log("submissionResult: ", submissionResult);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setCode("def add(arg1, arg2):\n    return arg1 + arg2");
  }, []);

  return (
    <main className="bg-white h-screen">
      <div className="max-w-[1280px] mx-auto py-5 px-2">
        <div className="">
          <Editor
            className="border-2 w-1/2"
            height="75vh"
            defaultLanguage="python"
            defaultValue={`print("Hello, World!")`}
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
          />
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-green-700 hover:bg-black text-white w-1/2 py-5"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Tables to show data  */}
        <div className="w-full mt-10">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  arg1
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  arg2
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Your Output
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Expected Output
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Error
                </th>
              </tr>
            </thead>
            {submissionResult.length > 0 ? (
              <tbody>
                {/* Map over each test case in the JSON response */}
                {submissionResult.map(
                  (test_case: ApiResponseInterface, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {test_case.test_case.arg1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {test_case.test_case.arg2}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {test_case.your_output}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {test_case.expected_output}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {test_case.status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {test_case.error}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            ) : (
              <></>
            )}
          </table>
        </div>
      </div>
    </main>
  );
}
