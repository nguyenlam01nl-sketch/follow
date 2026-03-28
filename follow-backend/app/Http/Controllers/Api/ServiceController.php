<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query()->where('status', 'active');

        if ($request->filled('platform')) {
            $query->where('platform', $request->string('platform'));
        }

        if ($request->filled('group_key')) {
            $query->where('group_key', $request->string('group_key'));
        }

        if ($request->filled('service_key')) {
            $query->where('service_key', $request->string('service_key'));
        }

        return response()->json(
            $query->orderBy('platform')
                ->orderBy('group_key')
                ->orderBy('name')
                ->get()
        );
    }

    public function tree()
    {
        $services = Service::query()
            ->where('status', 'active')
            ->orderBy('platform')
            ->orderBy('group_key')
            ->orderBy('name')
            ->get();

        $tree = $services
            ->groupBy('platform')
            ->map(function ($platformItems, $platform) {
                return [
                    'platform' => $platform,
                    'groups' => $platformItems
                        ->groupBy('group_key')
                        ->map(function ($groupItems, $groupKey) {
                            return [
                                'group_key' => $groupKey,
                                'services' => $groupItems->values()->map(function ($service) {
                                    return [
                                        'id' => $service->id,
                                        'name' => $service->name,
                                        'slug' => $service->slug,
                                        'description' => $service->description,
                                        'mode' => $service->mode,
                                        'price' => $service->price,
                                        'min_quantity' => $service->min_quantity,
                                        'max_quantity' => $service->max_quantity,
                                        'unit' => $service->unit,
                                        'requires_quantity' => $service->requires_quantity,
                                        'requires_link' => $service->requires_link,
                                        'requires_note' => $service->requires_note,
                                        'platform' => $service->platform,
                                        'group_key' => $service->group_key,
                                        'service_key' => $service->service_key,
                                    ];
                                })->values(),
                            ];
                        })
                        ->values(),
                ];
            })
            ->values();

        return response()->json($tree);
    }
    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json([
            'data' => $service
        ]);
    }
}
