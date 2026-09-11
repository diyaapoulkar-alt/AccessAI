"""
Accessibility Evaluation & Vision Test Cases.
Authored by Diya Payal (Accessibility & AI Engine Specialist).
Benchmarking dataset for WCAG 2.1/2.2 AA alt-text evaluation and OCR context extraction.
"""

ALT_TEXT_BENCHMARK_CASES = [
    {
        "id": "tc_001_generic_filename",
        "description": "Image with generic file name as alt text",
        "existing_alt_text": "IMG_20240912_1042.JPG",
        "expected_quality": "Poor",
        "expected_wcag_compliant": False,
        "is_decorative": False,
    },
    {
        "id": "tc_002_redundant_prefix",
        "description": "Alt text using redundant 'picture of' or 'image of' prefix",
        "existing_alt_text": "Image of a login button with arrow icon",
        "expected_quality": "Needs Improvement",
        "expected_wcag_compliant": False,
        "is_decorative": False,
    },
    {
        "id": "tc_003_descriptive_meaningful",
        "description": "High-quality, context-rich alt text adhering to WCAG AA",
        "existing_alt_text": "Quarterly sales revenue bar chart showing 24% growth in Q3 2026 reaching $4.2M.",
        "expected_quality": "Good",
        "expected_wcag_compliant": True,
        "is_decorative": False,
    },
    {
        "id": "tc_004_decorative_element",
        "description": "Decorative gradient divider that should have empty alt attribute",
        "existing_alt_text": "Colorful curved divider line",
        "expected_quality": "Needs Improvement",
        "expected_wcag_compliant": False,
        "is_decorative": True,
    },
    {
        "id": "tc_005_empty_alt_text",
        "description": "Missing alt text on informative content",
        "existing_alt_text": "",
        "expected_quality": "Poor",
        "expected_wcag_compliant": False,
        "is_decorative": False,
    },
]

DOCUMENT_OCR_SAMPLES = [
    {
        "id": "doc_prescription_01",
        "type": "medical_prescription",
        "raw_text": (
            "METROPOLITAN HEALTH CLINIC\n"
            "Dr. Sarah Jenkins, MD | Reg #MD-88192\n"
            "Date: 12-Sep-2026\n"
            "Patient: Alex Mercer | Age: 34\n"
            "Rx: Amoxicillin 500mg capsules\n"
            "Sig: Take 1 capsule by mouth every 8 hours with food for 10 days.\n"
            "Refills: 0\n"
            "WARNING: Complete entire course even if symptoms subside."
        ),
        "vital_keys": ["Amoxicillin 500mg", "every 8 hours with food", "10 days"],
    },
    {
        "id": "doc_utility_bill_02",
        "type": "utility_bill",
        "raw_text": (
            "PACIFIC POWER & ELECTRIC\n"
            "Account Number: 9812-4410-09\n"
            "Billing Period: Aug 01, 2026 - Aug 31, 2026\n"
            "Total Amount Due: $142.85\n"
            "Due Date: September 25, 2026\n"
            "Notice: Auto-pay scheduled for Sep 24, 2026."
        ),
        "vital_keys": ["$142.85", "September 25, 2026", "9812-4410-09"],
    },
]

SIGN_OCR_SAMPLES = [
    {
        "id": "sign_hazard_01",
        "type": "safety_warning",
        "raw_text": "CAUTION: WET FLOOR | SLIP HAZARD | WATCH YOUR STEP",
        "urgency": "high",
        "purpose": "Safety Caution",
    },
    {
        "id": "sign_store_hours_02",
        "type": "business_hours",
        "raw_text": "HOURS: MON-FRI 8:00 AM - 9:00 PM | SAT-SUN 10:00 AM - 6:00 PM",
        "urgency": "low",
        "purpose": "Operational Schedule",
    },
]
