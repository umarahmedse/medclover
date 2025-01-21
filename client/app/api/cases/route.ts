/* eslint-disable */
import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import { Case, Doctor } from "@/models"; // Assuming you have case and doctor models defined
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Get the generative model instance
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",  // Specify the model you want to use
});

const generationConfig = {
  temperature: 1,  // Controls randomness (higher = more random)
  topP: 0.95,      // Controls the cumulative probability distribution
  topK: 40,        // Limits the number of top-k tokens
  maxOutputTokens: 8192,  // Maximum number of tokens for the response
  responseMimeType: "text/plain",  // Mime type for response (plain text)
};

// Helper function to call the enhancement API using Google Generative AI
const enhanceDescription = async (description: string) => {
  try {
    // Start a chat session with the generative model
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the prompt message to the generative AI model
    const result = await chatSession.sendMessage(description);

    // Get the generated response text from the result
    return result.response.text();
  } catch (error) {
    console.error("Error calling enhance API:", error);
    return description; // Return the original description if enhancement fails
  }
};

export async function POST(req: Request) {
  try {
    await connectToDB(); // Ensure database connection

    // Read the body only once
    const { patientId, patientAge, patientName, assignedDoctor, organAffected, patientDescription } = await req.json();

    if (!patientId || !assignedDoctor || !organAffected || !patientDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Call the enhancement function to improve the patient description
    const enhancedDescription = await enhanceDescription(
      `${patientDescription} selected organs of the patient are ${organAffected} , avoid any fancy type of heading etc response, only paragraph 2-3 maximum, plaint text and emojis only, and dont respond okay i undertand etc, it is a professional description, directly just answer to the point also if possible, at the last line, predict recommendation of the expected disease  MAKE SURE IT SERVES AS A HELPING ENHANCED VERSION, FOR THE DOCTOR TO UNDERSTAND`
    );

    // Create the new case record with the enhanced description
    const newRecord = await Case.create({
      patientId,
      assignedDoctor,
      organAffected,
      patientDescription,
      enhancedDescription,
      patientAge,
      patientName,
    });

    return NextResponse.json({ success: "Case submitted successfully", record: newRecord }, { status: 201 });
  } catch (error) {
    console.error("Error submitting case:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDB(); // Ensure the database connection is established

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Ensure Doctor model is registered before querying
    if (!Doctor) {
      throw new Error("Doctor model is not registered.");
    }

    // Fetch cases where patientId matches userId
    const cases = await Case.find({ patientId: userId })
      .populate("assignedDoctor", "name") // Populate assignedDoctor field
      .lean();

    const formattedCases = cases.map((caseItem: any) => ({
      _id: caseItem._id.toString(),
      patientName: caseItem.patientName,
      assignedDoctor: caseItem.assignedDoctor?.name,
      organAffected: caseItem.organAffected,
      isClosed: caseItem.isClosed,
    }));

    return NextResponse.json(formattedCases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ message: "Failed to fetch cases" }, { status: 500 });
  }
}
