<?php
header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

$to = 'sale@halalfoodistan.com';
$subject = 'New Halal Foodistan Lead - ' . ($data['businessName'] ?? 'Unknown Business');
$body = [];
$body[] = 'New lead submitted from the Halal Foodistan inquiry form.';
$body[] = '';
$body[] = 'Business: ' . ($data['businessName'] ?? '');
$body[] = 'Owner: ' . ($data['ownerName'] ?? '');
$body[] = 'Phone: ' . ($data['phone'] ?? '');
$body[] = 'Email: ' . ($data['email'] ?? '');
$body[] = 'Instagram: ' . ($data['instagram'] ?? '');
$body[] = 'Business Type: ' . ($data['businessType'] ?? '');
$body[] = 'Goal: ' . ($data['goal'] ?? '');
$body[] = 'Budget: ' . ($data['budget'] ?? '');
$body[] = 'Services: ' . (isset($data['services']) && is_array($data['services']) ? implode(', ', $data['services']) : '');
$body[] = 'Primary Service: ' . ($data['primaryService'] ?? '');
$body[] = 'Project Focus: ' . ($data['projectFocus'] ?? '');
$body[] = 'Platforms: ' . (isset($data['platforms']) && is_array($data['platforms']) ? implode(', ', $data['platforms']) : '');
$body[] = 'Lead Score: ' . ($data['leadScore'] ?? '');
$body[] = 'Recommendation: ' . ($data['recommendation'] ?? '');
$body[] = 'Notes: ' . ($data['notes'] ?? '');
$body[] = 'Additional Notes: ' . ($data['additionalNotes'] ?? '');
$body[] = 'Submitted: ' . ($data['submittedAt'] ?? date('c'));

$headers = [];
$headers[] = 'From: no-reply@halalfoodistan.com';
$headers[] = 'Reply-To: ' . ($data['email'] ?? 'no-reply@halalfoodistan.com');
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$mailSent = mail($to, $subject, implode("\n", $body), implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode(['ok' => true, 'message' => 'Lead submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Email delivery failed']);
}
?>
