<?php

namespace App\Services;

class NormalizeSubjectService
{
    public function handle(string $value, ?string $type = null): array
    {
        $raw = trim($value);

        if (!$type) {
            $type = $this->detectType($raw);
        }

        $normalized = match ($type) {
            'phone' => $this->normalizePhone($raw),
            'facebook_link' => $this->normalizeFacebookLink($raw),
            'bank_account' => $this->normalizeBankAccount($raw),
            default => mb_strtolower($raw),
        };

        return [
            'type' => $type,
            'raw_value' => $raw,
            'normalized_value' => $normalized,
            'display_value' => $raw,
        ];
    }

    protected function detectType(string $value): string
    {
        $trimmed = trim($value);
        $lower = mb_strtolower($trimmed);

        if (str_contains($lower, 'facebook.com') || str_contains($lower, 'fb.com')) {
            return 'facebook_link';
        }

        $digits = preg_replace('/\D+/', '', $trimmed);

        if (preg_match('/^(0|\+84|84)/', $trimmed) && strlen($digits) >= 9 && strlen($digits) <= 11) {
            return 'phone';
        }

        if (ctype_digit($digits) && strlen($digits) >= 6) {
            return 'bank_account';
        }

        return 'other';
    }

    protected function normalizePhone(string $value): string
    {
        $digits = preg_replace('/\D+/', '', $value);

        if (str_starts_with($digits, '84')) {
            $digits = '0' . substr($digits, 2);
        }

        return $digits;
    }

    protected function normalizeBankAccount(string $value): string
    {
        return preg_replace('/\s+/', '', $value);
    }

    protected function normalizeFacebookLink(string $value): string
    {
        $value = trim(mb_strtolower($value));
        $value = preg_replace('#^https?://#', '', $value);
        $value = preg_replace('#^www\.#', '', $value);
        return rtrim($value, '/');
    }
}