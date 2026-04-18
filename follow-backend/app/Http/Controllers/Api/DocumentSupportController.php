<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentSupport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class DocumentSupportController extends Controller
{
    private function sendDocumentSupportCreatedEmail(DocumentSupport $documentSupport): void
    {
        $recipients = [
            'nguyenlamit2001@gmail.com',
            'nguyenlam01nl@gmail.com',
            'leoshinenguyen36211@gmail.com',
        ];

        $subject = 'Có yêu cầu hỗ trợ giấy tờ mới - Sola Vietnam';

        Mail::send('emails.document-support-created', [
            'documentSupport' => $documentSupport,
            'typeLabel' => $this->getTypeLabel($documentSupport->type),
            'user' => $documentSupport->user,
        ], function ($message) use ($recipients, $subject) {
            $message->to($recipients)->subject($subject);
        });
    }

    private function getTypeLabel(?string $type): string
    {
        return match ($type) {
            'giay-kham-benh' => 'Giấy khám bệnh',
            'visa' => 'Visa',
            'bang-cap' => 'Bằng cấp',
            'chung-chi' => 'Chứng chỉ',
            'bang-tin-hoc' => 'Bằng tin học',
            'bang-tieng-anh' => 'Bằng tiếng Anh',
            'ho-so-hoc-tap' => 'Hồ sơ học tập',
            'ho-so-benh-an' => 'Hồ sơ bệnh án',
            'giay-to-khac' => 'Giấy tờ khác',
            default => 'Không xác định',
        };
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        $query = DocumentSupport::query()
            ->with('user:id,name,email,phone')
            ->latest();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        } else {
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('keyword')) {
                $keyword = trim($request->keyword);

                $query->where(function ($q) use ($keyword) {
                    $q->where('phone', 'like', "%{$keyword}%")
                        ->orWhere('type', 'like', "%{$keyword}%")
                        ->orWhere('note', 'like', "%{$keyword}%");
                });
            }
        }

        $perPage = (int) $request->input('per_page', 10);
        $supports = $query->paginate($perPage);
        $supports->getCollection()->transform(function ($item) {
            $item->type_label = $this->getTypeLabel($item->type);
            return $item;
        });

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách yêu cầu hỗ trợ giấy tờ thành công',
            'data' => $supports,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                Rule::in([
                    'giay-kham-benh',
                    'visa',
                    'bang-cap',
                    'chung-chi',
                    'bang-tin-hoc',
                    'bang-tieng-anh',
                    'ho-so-hoc-tap',
                    'ho-so-benh-an',
                    'giay-to-khac',
                ]),
            ],
            'phone' => ['required', 'string', 'max:20'],
            'note' => ['nullable', 'string', 'max:3000'],
        ], [
            'type.required' => 'Vui lòng chọn loại giấy tờ.',
            'type.in' => 'Loại giấy tờ không hợp lệ.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',
            'note.max' => 'Mô tả không được vượt quá 3000 ký tự.',
        ]);

        if (
            $validated['type'] === 'giay-to-khac' &&
            empty(trim($validated['note'] ?? ''))
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng mô tả loại giấy tờ cần hỗ trợ.',
            ], 422);
        }

        try {
            $documentSupport = DocumentSupport::create([
                'user_id' => Auth::id(),
                'type' => $validated['type'],
                'phone' => $validated['phone'],
                'note' => $validated['note'] ?? null,
                'status' => 'pending',
            ]);

            $documentSupport->load('user:id,name,email,phone');
            $documentSupport->type_label = $this->getTypeLabel($documentSupport->type);

            try {
                $this->sendDocumentSupportCreatedEmail($documentSupport);
            } catch (\Exception $mailException) {
                Log::error('Gửi email thông báo yêu cầu giấy tờ thất bại: ' . $mailException->getMessage(), [
                    'document_support_id' => $documentSupport->id ?? null,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Gửi yêu cầu hỗ trợ giấy tờ thành công',
                'data' => $documentSupport,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Tạo yêu cầu hỗ trợ giấy tờ thất bại: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể tạo yêu cầu hỗ trợ giấy tờ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $user = Auth::user();

        $query = DocumentSupport::query()->with('user:id,name,email,phone');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $documentSupport = $query->findOrFail($id);
        $documentSupport->type_label = $this->getTypeLabel($documentSupport->type);

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết yêu cầu hỗ trợ giấy tờ thành công',
            'data' => $documentSupport,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện thao tác này',
            ], 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'processing', 'completed', 'cancelled'])],
        ], [
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái không hợp lệ.',
        ]);

        $documentSupport = DocumentSupport::findOrFail($id);
        $documentSupport->status = $validated['status'];
        $documentSupport->save();

        $documentSupport->load('user:id,name,email,phone');
        $documentSupport->type_label = $this->getTypeLabel($documentSupport->type);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái yêu cầu thành công',
            'data' => $documentSupport,
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện thao tác này',
            ], 403);
        }

        $documentSupport = DocumentSupport::findOrFail($id);
        $documentSupport->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xoá yêu cầu hỗ trợ giấy tờ thành công',
        ]);
    }
}
