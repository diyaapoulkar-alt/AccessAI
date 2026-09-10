from evaluator import evaluate_alt_text


image_path = "test_image.jpg"

alt_text = "image123.jpg"

result = evaluate_alt_text(
    image_path,
    alt_text
)

print("\nACCESSAI ALT-TEXT EVALUATION")
print("--------------------------------")

print("Score:", result["score"])
print("Status:", result["status"])
print("Reason:", result["reason"])
print("Suggested Alt-Text:", result["suggested_alt_text"])