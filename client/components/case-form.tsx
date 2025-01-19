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
import axios from "axios";
import DoctorSelect from "./DoctorSelect";
import { useToast } from "@/hooks/use-toast"

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
  const patientId = session?.user?.publicMetadata?.user_id;
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(""); // New state for selected doctor
  const [doctors, setDoctors] = useState<Record<string, { id: string; name: string }[]>>({}); // State for doctors list
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const isManualEditingRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { toast } = useToast(); // Hook for toast notifications

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

    // Fetch doctors list
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      }
    };
  }, []);

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

  const handleDoctorSelect = (value: string) => {
    setSelectedDoctor(value); // Set the selected doctor
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure that all required fields are provided
    if (!patientName || !age || selectedOrgans.length === 0 || !description || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please fill all fields, select at least one organ, and choose a doctor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Construct the request body
    const reqBody = {
      patientId, patientName,
      patientAge: age,
      organAffected: selectedOrgans,
      patientDescription: description,
      assignedDoctor: selectedDoctor,
    };

    try {
      // Make the API request using axios
      const response = await axios.post("/api/cases", reqBody, {
        headers: { "Content-Type": "application/json" },
      });

      // Handle successful response
      toast({
        title: "Success",
        description: `Case Submitted Successfully`,
      });
    } catch (error) {
      // Handle error if the request fails
      console.error("Submission error:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        toast({
          title: "Error",
          description: errorData.error || "Something went wrong!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit case.",
          variant: "destructive",
        });
      }
    } finally {
      // Stop the submitting state regardless of the outcome
      setIsSubmitting(false);
    }
  };

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

          <DoctorSelect
            doctors={doctors}
            loading={Object.keys(doctors).length === 0}
            selectedDoctor={selectedDoctor}
            onSelect={handleDoctorSelect}
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
