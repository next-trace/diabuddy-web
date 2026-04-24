import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../lib/server-auth';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const SUPPORTED_UPLOAD_MIME = new Set(['application/pdf']);

function parseText(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function isSupportedUpload(type: string): boolean {
  return type.startsWith('image/') || SUPPORTED_UPLOAD_MIME.has(type);
}

async function parseInput(req: NextRequest): Promise<{
  menuText: string;
  hints: string;
  imageName: string;
  restaurantHint: string;
  locationHint: string;
  planTier: string;
  fileMimeType: string;
  fileBase64: string;
  fileKind: 'restaurant_menu' | 'food_photo' | 'nutrition_label' | 'unknown';
  orderNumber: string;
  clarificationHistory: Array<{ question: string; answer: string }>;
}> {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('image');
    const imageName = file instanceof File ? file.name : '';
    let fileMimeType = '';
    let fileBase64 = '';
    const menuText = parseText(form.get('menu_text'));
    if (file instanceof File) {
      fileMimeType = (file.type || '').trim().toLowerCase();
      if (!isSupportedUpload(fileMimeType)) {
        throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Use image or PDF.`);
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error('Uploaded file is too large. Max size is 8 MB.');
      }
      const arrayBuffer = await file.arrayBuffer();
      fileBase64 = Buffer.from(arrayBuffer).toString('base64');
    }

    return {
      menuText,
      hints: parseText(form.get('hints')),
      imageName,
      restaurantHint: parseText(form.get('restaurant_hint')),
      locationHint: parseText(form.get('location_hint')),
      planTier: parseText(form.get('plan_tier')),
      fileMimeType,
      fileBase64,
      fileKind: parseFileKind(form.get('file_kind')),
      orderNumber: parseText(form.get('order_number')),
      clarificationHistory: parseClarificationHistory(form.get('clarification_history'))
    };
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  return {
    menuText: String(body.menu_text || '').trim(),
    hints: String(body.hints || '').trim(),
    imageName: String(body.image_name || '').trim(),
    restaurantHint: String(body.restaurant_hint || '').trim(),
    locationHint: String(body.location_hint || '').trim(),
    planTier: String(body.plan_tier || '').trim(),
    fileMimeType: String(body.file_mime_type || '').trim().toLowerCase(),
    fileBase64: String(body.file_base64 || '').trim(),
    fileKind: parseFileKind(body.file_kind),
    orderNumber: String(body.order_number || '').trim(),
    clarificationHistory: parseClarificationHistory(body.clarification_history)
  };
}

function parseFileKind(value: unknown): 'restaurant_menu' | 'food_photo' | 'nutrition_label' | 'unknown' {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (normalized === 'restaurant_menu' || normalized === 'food_photo' || normalized === 'nutrition_label') {
    return normalized;
  }
  return 'unknown';
}

function parseClarificationHistory(value: FormDataEntryValue | unknown): Array<{ question: string; answer: string }> {
  const raw = typeof value === 'string' ? value : JSON.stringify(value || []);
  if (!raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw) as Array<{ question?: unknown; answer?: unknown }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        question: String(item.question || '').trim(),
        answer: String(item.answer || '').trim()
      }))
      .filter((item) => item.question && item.answer);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'forbidden', details: 'missing or invalid csrf token' }, { status: 403 });
  }

  try {
    const payload = await parseInput(req);
    const { response, rotatedTokens } = await authedBackendFetch(req, '/ai/meal-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_text: payload.menuText,
        hints: payload.hints,
        image_name: payload.imageName,
        restaurant_hint: payload.restaurantHint,
        location_hint: payload.locationHint,
        plan_tier: payload.planTier,
        file_mime_type: payload.fileMimeType,
        file_base64: payload.fileBase64,
        file_kind: payload.fileKind,
        order_number: payload.orderNumber,
        clarification_history: payload.clarificationHistory
      })
    });
    return toJsonResponse(response, rotatedTokens);
  } catch (error) {
    return NextResponse.json(
      { error: 'invalid_input', details: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
