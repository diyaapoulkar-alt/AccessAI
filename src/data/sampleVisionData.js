export const sampleVisionImages = [
  {
    id: "prescription",
    title: "Medical Prescription & Dosage Label",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    extractedText: `Rx Prescription #9842104\nPatient: John Doe\nMedication: Amoxicillin 500mg\nInstructions: Take 1 capsule by mouth every 8 hours with food for 10 days.\nRefills Remaining: 2\nDoctor: Dr. Sarah Jenkins, MD\nWarning: Complete the full course even if symptoms improve.`,
    aiExplanation: "This is a medical prescription label for Amoxicillin 500mg. It instructs taking one capsule three times daily (every 8 hours) with meals. You have 2 refills remaining.",
    keyPoints: [
      "Medication: Amoxicillin 500mg",
      "Dosage: 1 capsule every 8 hours with food",
      "Duration: 10 days continuous",
      "Refills: 2 available"
    ],
    audioScript: "Attention. Medical prescription label detected for Amoxicillin 500 milligrams. Take one capsule by mouth every eight hours with food for ten days. Important: complete the full ten day course. You have two refills remaining."
  },
  {
    id: "invoice",
    title: "Utility Invoice & Due Notice",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    extractedText: `Metro Energy Services - Monthly Statement\nAccount Number: 4492-8102-11\nTotal Amount Due: $148.50\nPayment Due Date: August 28, 2026\nBilling Period: July 1 - July 31\nElectricity Usage: 420 kWh ($112.20)\nTax & Service Fees: $36.30`,
    aiExplanation: "This is an electric bill statement from Metro Energy Services. The total balance of $148.50 is due on August 28, 2026.",
    keyPoints: [
      "Provider: Metro Energy Services",
      "Amount Due: $148.50",
      "Due Date: August 28, 2026",
      "Account: 4492-8102-11"
    ],
    audioScript: "Billing statement from Metro Energy Services. Total balance due is 148 dollars and 50 cents. Payment due date is August 28th, 2026. Account number 4492-8102-11."
  },
  {
    id: "streetsign",
    title: "Public Transit Schedule & Platform Sign",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    extractedText: `Platform 4 - Central Express Line\nNext Departures:\n- Train 204 to Downtown Metro: 08:15 AM (On Time)\n- Train 108 to Airport Direct: 08:24 AM (Delayed 5m)\nWarning: Stand behind yellow safety line at all times. Accessible ramp available at Car 3.`,
    aiExplanation: "This is a Platform 4 transit sign. Downtown Metro train departs at 8:15 AM on time. Airport Direct train is delayed by 5 minutes, departing at 8:29 AM. Wheelchair accessibility is at Car 3.",
    keyPoints: [
      "Location: Platform 4 (Central Line)",
      "Next Train: Downtown Metro 8:15 AM",
      "Airport Train: 8:24 AM (Delayed 5m)",
      "Wheelchair Access: Car 3"
    ],
    audioScript: "Public Transit Notice for Platform 4. Train 204 to Downtown Metro departs at 8:15 AM on time. Train 108 to Airport Direct is delayed 5 minutes and departs at 8:29 AM. Accessible boarding ramp is located at Car 3."
  },
  {
    id: "chart",
    title: "Infographic Chart & Quarterly Revenue Report",
    category: "Document",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    extractedText: `Q2 Financial Overview\nRevenue Growth: +24% YoY ($4.2M)\nTop Performing Sector: Cloud Services (45% share)\nCustomer Retention Rate: 94.2%\nTarget Goal for Q3: $5.0M Expansion`,
    aiExplanation: "This chart visualizes quarterly financial results showing a 24 percent revenue growth reaching 4.2 million dollars, driven mostly by Cloud Services.",
    keyPoints: [
      "Q2 Revenue: $4.2M (+24% YoY)",
      "Top Sector: Cloud Services (45%)",
      "Retention Rate: 94.2%",
      "Q3 Target: $5.0M"
    ],
    audioScript: "Financial Infographic summary. Second quarter revenue reached 4.2 million dollars, representing a 24 percent year over year growth. Cloud Services accounted for 45 percent of overall business revenue."
  }
];
