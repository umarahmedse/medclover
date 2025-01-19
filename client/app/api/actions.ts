"use server";

export async function submitCase(formData: {
  patientName: string;
  age: string;
  selectedOrgans: string[];
  description: string;
}) {
  try {
    // Example: Send data to an external API or database
    console.log("Submitting case:", formData);

    return { success: true, message: "Case submitted successfully!" };
  } catch (error) {
    console.error("Error submitting case:", error);
    return { success: false, error: "Failed to submit case." };
  }
}
