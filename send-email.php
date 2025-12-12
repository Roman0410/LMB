<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Перевірка методу запиту
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не дозволено']);
    exit;
}

// Отримуємо дані з POST запиту
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Невірний формат даних']);
    exit;
}

// Налаштування email
$to = 'lvivmozhebilshe@gmail.com'; // Email адреса для отримання повідомлень
$subject = 'Нове повідомлення з форми контактів - Львів може більше';

// Підготовка даних
$name = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
$email = isset($data['email']) ? htmlspecialchars(trim($data['email'])) : '';
$message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';

// Валідація
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Всі поля обов\'язкові для заповнення']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Невірний формат email']);
    exit;
}

// Формування тіла листа
$emailBody = "Нове повідомлення з форми контактів\n\n";
$emailBody .= "Ім'я: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Повідомлення:\n" . $message . "\n";
$emailBody .= "\n---\n";
$emailBody .= "Дата відправки: " . date('d.m.Y H:i:s') . "\n";

// Заголовки email
$headers = "From: " . $name . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Відправка email
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    // Відправка підтвердження користувачу (опціонально)
    $userSubject = 'Дякуємо за ваше повідомлення - Львів може більше';
    $userMessage = "Шановний(а) " . $name . ",\n\n";
    $userMessage .= "Дякуємо за ваше повідомлення! Ми отримали його і зв'яжемось з вами найближчим часом.\n\n";
    $userMessage .= "Ваше повідомлення:\n" . $message . "\n\n";
    $userMessage .= "З повагою,\nКоманда Львів може більше";
    
    $userHeaders = "From: Львів може більше <" . $to . ">\r\n";
    $userHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Відправляємо підтвердження користувачу (опціонально, можна закоментувати)
    // mail($email, $userSubject, $userMessage, $userHeaders);
    
    echo json_encode([
        'success' => true,
        'message' => 'Повідомлення успішно відправлено'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Помилка відправки email. Спробуйте пізніше.'
    ]);
}
?>
