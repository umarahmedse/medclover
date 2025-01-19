/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiOrganSelector from "@/components/MultipleOrganSelector";
import { Button } from "@/components/ui/button";
import { FiMic, FiMicOff } from "react-icons/fi";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "@clerk/nextjs";
import axios from "axios"
// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default function CaseForm() {
  const { session } = useSession();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [interimTranscript, setInterimTranscript] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const isManualEditingRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.lang = "en-US";
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const formattedTranscript = transcript
            .trim()
            .replace(/(\S)([A-Z])/g, "$1 $2");

          if (event.results[i].isFinal) {
            final += formattedTranscript;
          } else {
            interim += formattedTranscript;
          }
        }

        if (final) {
          setDescription((prev) => {
            const spacer = prev && !prev.endsWith(" ") ? " " : "";
            return prev + spacer + final;
          });
          setInterimTranscript("");
        } else {
          setInterimTranscript(interim);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionInstance.onerror = (event: SpeechRecognitionEvent) => {
        if (event.error !== "aborted") {
          console.error("Speech recognition error:", event.error);
        }
        setIsListening(false);
        setInterimTranscript("");
      };

      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Rest of the component remains the same...
  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        setInterimTranscript("");
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  const startRecognition = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
        stopRecognition();
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);

    if (isListening) {
      stopRecognition();
    }
  };

  const handleMicClick = () => {
    isManualEditingRef.current = false;
    toggleListening();
  };

  const handleOrganChange = (organs: string[]) => {
    setSelectedOrgans(organs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure that all required fields are provided
    if (!patientName || !age || selectedOrgans.length === 0 || !description) {
      alert("Please fill all fields and select at least one organ.");
      return;
    }
  
    setIsSubmitting(true);
  
    // Construct the request body
    const reqBody = {
      patientId: session?.publicUserData?.userId,  // Ensure patientId is properly fetched
      patientName,
      patientAge: age,
      organAffected: selectedOrgans,
      patientDescription: description,
    };
  
    console.log(reqBody); // For debugging purposes
  
    try {
      // Make the API request using axios
      const response = await axios.post("/api/cases", reqBody, {
        headers: { "Content-Type": "application/json" },
      });
  
      // Handle successful response
      console.log("Submission success:", response.data);
  
      // Show success message
      alert(`Case Submitted: ${response.data.message}`);
  
    } catch (error) {
      // Handle error if the request fails
      console.error("Submission error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        alert(`Error: ${errorData.error || "Something went wrong!"}`);
      } else {
        alert("Failed to submit case.");
      }
    } finally {
      // Stop the submitting state regardless of the outcome
      setIsSubmitting(false);
    }
  };
  
console.log(session)
  return (
    <div>
     
      <h1 className="text-2xl font-bold">Add Case</h1>

      <div className="grid w-full items-center gap-4 p-4">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="md:max-w-[50%]">
            <Label htmlFor="patientName">Name</Label>
            <Input
              type="text"
              id="patientName"
              placeholder="John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="md:max-w-[50%]">
            <Label htmlFor="age">Age</Label>
            <Input
              type="number"
              id="age"
              placeholder="22"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <MultiOrganSelector
            selectedOrgans={selectedOrgans}
            onOrganChange={handleOrganChange}
          />

          <div className="relative">
            <Label htmlFor="description">Self Description</Label>
            <textarea
              id="description"
              ref={textAreaRef}
              placeholder="I am having ..."
              value={
                description + (interimTranscript ? " " + interimTranscript : "")
              }
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
              rows={8}
              required
            />
            <button
              type="button"
              onClick={handleMicClick}
              className={`absolute bottom-4 right-2 p-2 rounded-full ${
                isListening
                  ? "bg-red-100 hover:bg-red-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {isListening ? (
                <FiMicOff className="text-gray-700 " />
              ) : (
                <FiMic className="text-gray-700" />
              )}
            </button>
          </div>
          {isSubmitting ? (
            <Skeleton className="h-[30px] w-full rounded-lg" />
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              Submit Case
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
