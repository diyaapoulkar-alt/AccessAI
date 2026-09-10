from evaluator import evaluate_alt_text


image_path = "test_image.jpg"

existing_alt_text = "image.jpg"

result = evaluate_alt_text(
    image_path,
    existing_alt_text
)

print("\nACCESSAI RESULT")
print("================")
print(result)